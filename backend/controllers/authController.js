import User from "../models/User.js";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import ms from "ms";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";
import Channel from "../models/Channel.js";





const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: ms(process.env.JWT_EXPIRED_IN) / 1000,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: true,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const register = catchAsync(async (req, res) => {
  const { fullName, email, password, passwordConfirm } = req.body;

  const newUser = await User.create({
    fullName,
    email,
    password,
    passwordConfirm,
  });
  
  createSendToken(newUser, 201, res);

 

  
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ email })
    .select("+password")
    

  console.log(user);
  

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }


 
  createSendToken(user, 200, res);
});

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id)
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  req.user = currentUser;

  next();
});

export const restrict = (...role) => {
  return (req, res, next) => {
    console.log(req.user.role, "Role");
    if (!req.user || !role.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to access this route", 403)
      );
    }
    next();
  };
};

export const logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};
