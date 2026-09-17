import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import healthRoutes from "./routes/health.js";
import categoryRoutes from "./routes/categories.js";
import productRoutes from "./routes/products.js";
import { errorHandler } from "./middleware/errorHandler.js";

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
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
