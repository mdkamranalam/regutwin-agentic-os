import app from "./app.js";
import { connectDB } from "./config/database.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

import { initSocket } from "./utils/socket.js";

const startServer = async (): Promise<void> => {
  await connectDB();

  const server = app.listen(Number(env.PORT), "0.0.0.0", () => {
    logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });

  // Initialize Socket.io
  initSocket(server);
};

startServer();
