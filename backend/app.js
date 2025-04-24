import express from "express";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import cors from "cors";
import path from "path";

import { errorHandler as globalErrorHandler } from "./controllers/errorController.js";
import userRouter from "./routes/userRoutes.js";
import videoRouter from "./routes/videoRoutes.js";
import channelRouter from "./routes/channelRoutes.js";
import hpp from "hpp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: ["http://localhost:5173",//  frontend URL
    'https://your-frontend-url.vercel.app', ],// Your live frontend URL

    credentials: true,
  })
);

// MIDDLEWARE
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 10000,
  message: "Too many requests from this IP, please try again in an hour...!",
});

// app.use("/api", limiter);
app.use(express.json());
app.use(mongoSanitize());
app.use(morgan("combined"));
app.use(
  hpp({
    whitelist: ["createdAt", "views"],
  })
);
app.use(express.static(join(__dirname, "public")));
// Increase payload limit for JSON and URL-encoded bodies
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES

app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/channel", channelRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on server`, 404));
});

app.use(globalErrorHandler);

export default app;
