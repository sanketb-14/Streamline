import User from "../models/User.js";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import ms from "ms";
import { catchAsync } from "../utils/catchAsync.js";
import Channel from "../models/Channel.js";
import { AppError } from "../utils/appError.js";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';
import axios from 'axios';
import cloudinary from "../config/cloudinaryConfig.js";

// google Sign-In
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const googleSignIn = catchAsync(async (req, res) => {
  const { email, name, picture } = req.body;
  let user = await User.findOne({ email });
  let profilePicture = 'default';

  try {
    // Upload Google profile picture to Cloudinary
    if (picture) {
      const result = await cloudinary.uploader.upload(picture, {
        folder: 'StreamLine/images',
        transformation: [{ width: 250, height: 250, crop: 'fill' }]
      });
      profilePicture = result.secure_url;
    }
  } catch (err) {
    console.error('Image upload failed:', err.message);
    profilePicture = 'default';
  }
  
  // User creation/update logic
  if (!user) {
    const randomPassword = crypto.randomBytes(20).toString("hex");
    user = await User.create({
      fullName: name,
      email,
      photo: profilePicture,
      password: randomPassword,
      passwordConfirm: randomPassword,
      provider: ["google"],
      isEmailVerified: true,
    });
  } else {
    if (!user.provider.includes("google")) {
      user.provider = [...(user.provider || []), "google"];
    }
    if (profilePicture !== 'default') {
      user.photo = profilePicture;
    }
    await user.save({ validateBeforeSave: false });
  }

  createSendToken(user, 200, res);
});
// Existing functions
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
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // critical for cross-site
    domain: process.env.NODE_ENV === 'production' ? 'none' : 'lax' ,
    path:'/'
  };

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user }
  });
};

export const register = catchAsync(async (req, res, next) => {
  const { fullName, email, password, passwordConfirm } = req.body;

  // Check if required fields are present
  if (!fullName || !email || !password || !passwordConfirm) {
    return next(new AppError('Please provide all required fields', 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already in use. Please use a different email or login instead.', 409));
  }

  try {
    // Create new user
    const newUser = await User.create({
      fullName,
      email,
      password,
      passwordConfirm,
    });

    // Send token to client
    createSendToken(newUser, 201, res);
  } catch (err) {
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return next(new AppError(`Validation error: ${messages.join('. ')}`, 400));
    }
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return next(new AppError(`${field.charAt(0).toUpperCase() + field.slice(1)} already in use`, 409));
    }

    // Pass any other errors to the global error handler
    return next(err);
  }
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

 
  
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 200, res);
});

export const protect = catchAsync(async (req, res, next) => {
  let token;

  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in! Please log in to get access.", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  
  if (!currentUser) {
    return next(new AppError("The user belonging to this token does no longer exist.", 401));
  }

  // Always attach user to request
  req.user = currentUser;

  // Find channel if it exists (but don't require it)
  const userChannel = await Channel.findOne({ owner: currentUser._id });
  req.channel = userChannel || null;

  
  

  next();
});

export const restrict = (...role) => {
  return (req, res, next) => {
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
