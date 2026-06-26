import { Request, Response } from "express";
import MAP, { MapStatus, MapDepartment } from "../models/map.model.js";
import Regulation from "../models/regulation.model.js";
import Audit from "../models/audit.model.js";

export const getComplianceHealth = async (req: Request, res: Response) => {
  try {
    const totalMaps = await MAP.countDocuments();
    const openMaps = await MAP.countDocuments({ status: MapStatus.OPEN });
    const inProgressMaps = await MAP.countDocuments({ status: MapStatus.IN_PROGRESS });
    const closedMaps = await MAP.countDocuments({ status: MapStatus.CLOSED });
    const inReviewMaps = await MAP.countDocuments({ status: MapStatus.IN_REVIEW });
    const overdueMaps = await MAP.countDocuments({ status: MapStatus.OVERDUE });
    const activeRegulationsCount = await Regulation.countDocuments();

    // Risk Score Calculation: 100 is perfect health.
    // Penalty weights: OVERDUE (3x - highest risk), OPEN (2x), IN_PROGRESS (1x)
    let riskScore = 100;
    if (totalMaps > 0) {
      const weightedPenalty = (overdueMaps * 3) + (openMaps * 2) + inProgressMaps;
      const maxPossiblePenalty = totalMaps * 3;
      riskScore = Math.max(0, Math.round(100 - ((weightedPenalty / maxPossiblePenalty) * 100)));
    }

    res.json({
      healthScore: riskScore,
      activeRegulationsCount,
      metrics: {
        total: totalMaps,
        open: openMaps,
        inProgress: inProgressMaps,
        inReview: inReviewMaps,
        overdue: overdueMaps,
        closed: closedMaps,
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate compliance health." });
  }
};

export const getUpcomingDeadlines = async (req: Request, res: Response) => {
  try {
    const upcoming = await MAP.find({
      status: { $ne: MapStatus.CLOSED },
    }).populate("regulationId").sort({ deadline: 1 }).limit(10);

    res.json(upcoming);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch upcoming deadlines." });
  }
};

export const getTrends = async (req: Request, res: Response) => {
  try {
    const maps = await MAP.find({});
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    
    // Create baseline trends
    const trends = months.map((month, idx) => ({
      month,
      avgDaysToClose: 18 - (idx * 1.2), // simulated default trend
      closureRate: 70 + (idx * 2.5), // simulated default trend
      riskScore: 80 + (idx * 1.5)
    }));

    // Adjust the current month with actuals if closed maps exist
    const closedMaps = maps.filter(m => m.status === MapStatus.CLOSED);
    const currentMonthIdx = now.getMonth();

    if (closedMaps.length > 0) {
      let totalDays = 0;
      closedMaps.forEach(m => {
        const created = (m as any).createdAt;
        const updated = (m as any).updatedAt;
        if (created && updated) {
          totalDays += (updated.getTime() - created.getTime()) / (1000 * 3600 * 24);
        }
      });
      const avgDays = closedMaps.length > 0 ? Number((totalDays / closedMaps.length).toFixed(1)) : 6.1;
      const totalMapsCount = maps.length;
      const rate = totalMapsCount > 0 ? Math.round((closedMaps.length / totalMapsCount) * 100) : 98;

      if (trends[currentMonthIdx]) {
        trends[currentMonthIdx].avgDaysToClose = avgDays;
        trends[currentMonthIdx].closureRate = rate;
        trends[currentMonthIdx].riskScore = Math.min(100, Math.round(rate * 1.02));
      }
    }
    
    // Return the last 5 months
    const last5Months = [];
    for (let i = 4; i >= 0; i--) {
      let idx = currentMonthIdx - i;
      if (idx < 0) idx += 12;
      last5Months.push(trends[idx]);
    }

    res.json(last5Months);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch compliance velocity trends." });
  }
};

export const getRiskTrends = async (req: Request, res: Response) => {
  try {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const now = new Date();
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date(now.getTime() - i * 24 * 3600 * 1000);
      const dayName = days[targetDate.getDay()];

      // Query MAPs created on or before targetDate
      const allMaps = await MAP.find({ createdAt: { $lte: targetDate } });
      const openCount = allMaps.filter(m => m.status === MapStatus.OPEN || (m.status !== MapStatus.CLOSED && (m as any).updatedAt > targetDate)).length;
      const progressCount = allMaps.filter(m => m.status === MapStatus.IN_PROGRESS && (m as any).updatedAt <= targetDate).length;
      const overdueCount = allMaps.filter(m => m.status === MapStatus.OVERDUE && (m as any).updatedAt <= targetDate).length;

      let riskScore = 100;
      if (allMaps.length > 0) {
        const weightedPenalty = (overdueCount * 3) + (openCount * 2) + progressCount;
        const maxPossiblePenalty = allMaps.length * 3;
        riskScore = Math.max(0, Math.round(100 - ((weightedPenalty / maxPossiblePenalty) * 100)));
      } else {
        // Safe baseline curve
        riskScore = 85 - (i * 2);
      }

      result.push({
        day: dayName,
        compliance: riskScore,
        risk: 100 - riskScore
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch 7-day risk trends." });
  }
};

export const getSectorImpact = async (req: Request, res: Response) => {
  try {
    const departments = Object.values(MapDepartment);
    const result = [];

    for (const dept of departments) {
      const count = await MAP.countDocuments({ assignedTo: dept });
      result.push({ name: dept, value: count });
    }

    // Default distribution if DB is completely empty
    const totalCount = result.reduce((acc, curr) => acc + curr.value, 0);
    if (totalCount === 0) {
      return res.json([
        { name: "IT Security", value: 35 },
        { name: "Risk", value: 25 },
        { name: "Legal", value: 15 },
        { name: "Compliance", value: 15 },
        { name: "Finance", value: 10 }
      ]);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sector impact distribution." });
  }
};

export const getRecentActivities = async (req: Request, res: Response) => {
  try {
    const list = await Audit.find({})
      .populate("regulationId", "title")
      .populate("mapId", "actionRequired")
      .sort({ createdAt: -1 })
      .limit(5);

    const activities = list.map(a => {
      let event = "Event logged";
      let detail = "System event";
      let type = "audit";

      if (a.action === "CREATED") {
        event = "MAP Created";
        detail = a.mapId ? (a.mapId as any).actionRequired : "New compliance task added";
        type = "upload";
      } else if (a.action === "STATUS_CHANGED") {
        event = `Status Changed to ${a.newStatus}`;
        detail = a.mapId ? (a.mapId as any).actionRequired : "Compliance task updated";
        type = "audit";
      } else if (a.action === "VALIDATED") {
        const isValid = a.validationResult?.is_valid;
        event = isValid ? "AI Validation Passed" : "AI Validation Failed";
        detail = a.mapId ? (a.mapId as any).actionRequired : "Evidence validation completed";
        type = isValid ? "success" : "conflict";
      }

      return {
        id: a._id,
        event,
        detail,
        time: formatRelativeTime(a.createdAt),
        type
      };
    });

    // Return dummy items if no audit records exist yet
    if (activities.length === 0) {
      return res.json([
        { id: 1, event: "System Online", detail: "ReguTwin Agentic OS is online.", time: "10m ago", type: "audit" },
        { id: 2, event: "ChromaDB Connected", detail: "Longitudinal compliance memory vault established.", time: "9m ago", type: "success" }
      ]);
    }

    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recent activities." });
  }
};

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
}
