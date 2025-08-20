import express from "express";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import cors from "cors";
import path from "path";
import helmet from "helmet"; 
import compression from "compression"; 

import { errorHandler as globalErrorHandler } from "./controllers/errorController.js";
import userRouter from "./routes/userRoutes.js";
import videoRouter from "./routes/videoRoutes.js";
import channelRouter from "./routes/channelRoutes.js";
import hpp from "hpp";
import {AppError} from "./utils/appError.js"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();


app.use(helmet());

//  Enable response compression
app.use(compression());

app.use("/public", express.static(path.join(__dirname, "public")));


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://streamline02.vercel.app", //  real production URL
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], //  Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], //  Specify allowed headers
    exposedHeaders: ["set-cookie"]
  })
);

// MIDDLEWARE
// Adjusted rate limiting to more reasonable values
const limiter = rateLimit({
  max: 100, // 100 requests per window
  windowMs: 15 * 60 * 1000, //  15 minutes 
  message: "Too many requests from this IP, please try again in 15 minutes",
  standardHeaders: true, //  Return rate limit info in headers
  legacyHeaders: false, //  Disable deprecated headers
});

//  Apply rate limiting to all API routes
app.use("/api", limiter);

app.use(express.json());
app.use(mongoSanitize());
app.use(morgan("dev")); // Using 'dev' format for more concise logs in development
app.use(
  hpp({
    whitelist: ["createdAt", "views"],
  })
);
app.use(express.static(join(__dirname, "public")));

// Body parser configuration remains the same
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
    origin: req.headers.origin,
    cookies: req.cookies,
    headers: req.headers
  });
  next();
});
// ROUTES 
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/channel", channelRouter);

//for ping
app.get("/ping", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "health is ok" });
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on server`, 404));
});

app.use(globalErrorHandler);

export default app;
