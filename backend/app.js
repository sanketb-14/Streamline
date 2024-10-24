import express from "express";
import rateLimit from "express-rate-limit"
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan"
import {errorHandler as globalErrorHandler} from "./controllers/errorController.js"
import userRouter from "./routes/userRoutes.js"
import videoRouter from "./routes/videoRoutes.js"
import path from 'path';
import hpp from 'hpp'

// Get the directory name from the current module
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express()

//MIDDLEWARE

// app.use(helmet())
const limiter = rateLimit({
  max:100,
  windowMs:60*60*1000,
  message: 'Too many requests from this IP, please try again in hour...!'
})

app.use('/api',limiter)
app.use(express.json());
app.use(mongoSanitize())
app.use(morgan("combined"));

app.use(hpp({
  whitelist:['createdAt,views']
}))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.headers);
    next();
  });

  //ROUTES
  app.use('/api/v1/users' , userRouter )
  app.use('/api/v1/videos' , videoRouter)




  app.all('*',(req,res,next) => {

    next(new AppError(`Can't find ${req.originalUrl} on server` , 404 ))
  
  })
  app.use(globalErrorHandler)

  export default app
