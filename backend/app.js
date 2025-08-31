// app.js
import express from "express";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet"; 
import compression from "compression"; 
import hpp from "hpp";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { errorHandler as globalErrorHandler } from "./controllers/errorController.js";
import userRouter from "./routes/userRoutes.js";
import videoRouter from "./routes/videoRoutes.js";
import channelRouter from "./routes/channelRoutes.js";
import { AppError } from "./utils/appError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Security headers
app.use(helmet());

// Enable response compression
app.use(compression());

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://streamline02.vercel.app", 
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  })
);

// Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Body parsing
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(mongoSanitize());
app.use(morgan("dev"));
app.use(
  hpp({
    whitelist: ["createdAt", "views"],
  })
);

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/channel", channelRouter);

// 404 handler
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on server`, 404));
});

// Global error handler
app.use(globalErrorHandler);

export default app;
