import cron from "node-cron";
import MAP, { MapStatus } from "../models/map.model.js";
import { NotificationService } from "../services/notification.service.js";
import { getIO } from "../utils/socket.js";

export const runDeadlineChecks = async () => {
  console.log("[Scheduler] Executing SLA and Deadline enforcement audit...");
  const now = new Date();
  const fortyEightHoursLater = new Date(now.getTime() + 48 * 3600 * 1000);

  try {
    // 1. Check overdue MAPs
    const overdueMaps = await MAP.find({
      status: { $in: [MapStatus.OPEN, MapStatus.IN_PROGRESS, MapStatus.IN_REVIEW] },
      deadline: { $lt: now }
    }).populate("regulationId");

    for (const mapItem of overdueMaps) {
      mapItem.status = MapStatus.OVERDUE;
      mapItem.slaBreachCount += 1;
      await mapItem.save();

      const regTitle = (mapItem.regulationId as any)?.title || "Unknown Regulation";
      await NotificationService.sendAlert(
        mapItem.assignedTo,
        "🚨 CRITICAL SLA BREACH: MAP Overdue",
        `Task '${mapItem.description}' for regulation '${regTitle}' has breached its compliance deadline. Status escalated to OVERDUE.`
      );

      try {
        getIO().emit("deadline_warning", {
          mapId: mapItem._id,
          description: mapItem.description,
          assignedTo: mapItem.assignedTo,
          status: "OVERDUE",
          deadline: mapItem.deadline
        });
      } catch (e) {}
    }

    // 2. Check approaching deadlines (<48h)
    const upcomingMaps = await MAP.find({
      status: { $in: [MapStatus.OPEN, MapStatus.IN_PROGRESS] },
      deadline: { $gte: now, $lte: fortyEightHoursLater }
    }).populate("regulationId");

    for (const mapItem of upcomingMaps) {
      const regTitle = (mapItem.regulationId as any)?.title || "Unknown Regulation";
      await NotificationService.sendAlert(
        mapItem.assignedTo,
        "⚠️ SLA WARNING: Deadline Approaching",
        `Task '${mapItem.description}' for regulation '${regTitle}' is due within 48 hours.`
      );

      try {
        getIO().emit("deadline_warning", {
          mapId: mapItem._id,
          description: mapItem.description,
          assignedTo: mapItem.assignedTo,
          status: "APPROACHING",
          deadline: mapItem.deadline
        });
      } catch (e) {}
    }

    console.log(`[Scheduler] Audit complete. ${overdueMaps.length} tasks marked OVERDUE, ${upcomingMaps.length} warning alerts sent.`);
  } catch (err) {
    console.error("[Scheduler] Error executing deadline audit:", err);
  }
};

export const initScheduler = () => {
  console.log("[Scheduler] Initializing SLA enforcement background worker (Cron: 0 * * * *)");
  // Run every hour
  cron.schedule("0 * * * *", runDeadlineChecks);
  
  // Also run once 10 seconds after boot
  setTimeout(runDeadlineChecks, 10000);
};
