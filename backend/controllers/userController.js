import User from "../models/User.js";
import Channel from "../models/Channel.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import multer from "multer";
import sharp from "sharp";
import Video from "../models/Video.js";
import { uploadImage } from "../config/cloudinaryConfig.js";

function filterObj(obj, ...allowFields) {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
}

// const multerStorage = multer.diskStorage({
//     destination:(req , file , cb) => {
//         cb(null , 'public/img/users')
//     },
//     filename:(req,file,cb) =>{
//         const ext = file.mimetype.split('/')[1]
//         cb(null , `user-${req.user.id}-${Date.now()}.${ext}`)
//     }
// })

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Please upload only images", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = uploadImage.single("photo");



export const getMe = catchAsync(async (req, res, next) => {
  // 1. Get user data (assuming req.user.id exists from auth middleware)



  const user = await User.findById(req.user.id)
    .select("fullName email photo provider")

    .lean();

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  // 2. Get channel data for the user
  const channel = await Channel.findOne({ owner: user._id })
    .populate("subscribers", "fullName photo") // Only get necessary subscriber fields
    .populate({
      path: "videos",
      select: "title description views createdAt", // Select relevant video fields
      options: { sort: { createdAt: -1 } }, // Sort videos by newest first
    })
    .lean();
  // Add debug logs
  // console.log('Channel before populate:', channel?._id);
  // console.log('Video IDs in channel:', channel?.videos);

  // Verify videos exist
  if (channel?.videos?.length > 0) {
    const videoCheck = await Video.find({
      _id: { $in: channel.videos },
    }).lean();
  }
  // 4. Send response
  // 3. Combine user and channel data
  const userData = {
    ...user,
    channel: channel || null, // Include channel data if it exists, null if not
  };

  // Check if the videos exist

  // 4. Send response
  res.status(200).json({
    status: "success",
    data: {
      user: userData,
    },
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  const filter = filterObj(req.body, "fullName", "email");


  
  
  // If file is uploaded, use the Cloudinary URL
  if (req.file) {
    
    filter.photo = req.file.path; // Cloudinary returns the URL in req.file.path
  }

  console.log('Final update filter:', filter);

  try {
    const user = await User.findByIdAndUpdate(req.user.id, filter, {
      new: true,
      runValidators: true,
    });

  

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return next(error);
  }
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ status: "success", data: null });
});

export const getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});
