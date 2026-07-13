import mongoose from "mongoose";
import { env } from "./env";

export const connectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  await mongoose.connect(env.mongoUri, {
    dbName: "karigar",
    autoIndex: false
  });

  console.log("MongoDB connected successfully");
};
