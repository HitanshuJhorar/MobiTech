import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import healthRoutes from "./routes/health";
import { errorHandler } from "./middleware/errorHandler";

const app: Express = express();

// Basic Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Base API Routes
app.use("/api/health", healthRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
