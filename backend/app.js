import express from "express";
import rateLimit from "express-rate-limit"
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan"


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

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.headers);
    next();
  });

  //ROUTES



  app.all('*',(req,res,next) => {

    next(new AppError(`Can't find ${req.originalUrl} on server` , 404 ))
  
  })

  export default app

