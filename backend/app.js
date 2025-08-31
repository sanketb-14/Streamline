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

<<<<<<< HEAD
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
=======
app.use("/public", express.static(path.join(__dirname, "public")));


app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://streamline02.vercel.app',
  ],
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'], // include OPTIONS
  allowedHeaders: ['Content-Type','Authorization'],
  // exposedHeaders is optional; JS can’t read Set-Cookie anyway if httpOnly
}))

app.options('*', cors())
>>>>>>> 3575d272215850c51efb0f842663bfec20ff1c11

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

<<<<<<< HEAD
// Routes
=======
// Body parser configuration remains the same
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
//     origin: req.headers.origin,
//     cookies: req.cookies,
//     headers: req.headers
//   });
//   next();
// });
// ROUTES 
>>>>>>> 3575d272215850c51efb0f842663bfec20ff1c11
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/channel", channelRouter);

<<<<<<< HEAD
// 404 handler
=======
//for ping
app.get("/ping", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "health is fine" });
});

>>>>>>> 3575d272215850c51efb0f842663bfec20ff1c11
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on server`, 404));
});

// Global error handler
app.use(globalErrorHandler);

export default app;
