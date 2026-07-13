import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGODB_URI ?? "mongodb://localhost:27017/karigar",
  jwtSecret: getEnv("JWT_SECRET", "dev-secret-key-change-in-production"),
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID ?? "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ?? "",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
  backendUrl: process.env.BACKEND_URL ?? "http://localhost:4000",
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY ?? ""
};
