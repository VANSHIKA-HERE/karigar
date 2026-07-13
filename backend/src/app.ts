import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { json, urlencoded } from "express";
import { authRoutes } from "./routes/auth";
import { globalErrorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use(globalErrorHandler);

export default app;
