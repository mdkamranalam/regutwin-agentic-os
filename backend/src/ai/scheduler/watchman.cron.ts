import cron from "node-cron";

import { WatchmanService } from "../agents/watchman/watchman.service.js";

cron.schedule("0 */6 * * *", async () => {
  console.log("Running Watchman...");

  await WatchmanService.monitor();
});
