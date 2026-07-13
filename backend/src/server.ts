import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

const startServer = async () => {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`Backend running in ${env.nodeEnv} mode on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});
