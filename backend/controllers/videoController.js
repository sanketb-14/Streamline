import multer from "multer";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import ffmpeg from "fluent-ffmpeg";
import { promises as fs } from "fs";
import path from "path";

import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
import { getTimeAgo } from "../helper/helper.js";

import VideoFeature from "../utils/videoFeature.js";
import { uploadVideo } from "../config/cloudinaryConfig.js";
import cloudinary from "../config/cloudinaryConfig.js";

ffmpeg.setFfmpegPath("C:/FFmpeg/bin/ffmpeg.exe");
ffmpeg.setFfprobePath("C:/FFmpeg/bin/ffprobe.exe");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb(new AppError("Please upload only video files", 400), false);
  }
};



export const validateTags = catchAsync(async (req, res, next) => {
  const allowedTags = [
    "Technology",
    "Education",
    "Entertainment",
    "Music",
    "Gaming",
    "News",
    "Sports",
    "Comedy",
    "Film",
    "Science",
  ];
  const video = await Video.findById(req.params.id);

  if (!req.body.tags || !video.tags) {
    req.body.tags = [];
    return next();
  }

  // Parse tags if they come as string
  const tags = Array.isArray(req.body.tags)
    ? req.body.tags
    : JSON.parse(req.body.tags);

  // Validate tags
  if (tags.length > 5) {
    return next(new AppError("Maximum 5 tags allowed per video", 400));
  }

  const validTags = tags.filter((tag) => allowedTags.includes(tag));
  if (validTags.length !== tags.length) {
    return next(new AppError("One or more invalid tags provided", 400));
  }

  req.body.tags = validTags;
  next();
});

export const ensureUserHasChannel = catchAsync(async (req, res, next) => {
  if (!req.channel) {
    // Create default channel if none exists
    const defaultChannelName = `${req.user.fullName}'s Channel`;
    const newChannel = await Channel.create({
      name: defaultChannelName,
      description: "",
      owner: req.user._id,
      subscribers: [],
      videos: [],
    });
    req.channel = newChannel;
    req.user.channel = newChannel._id;
  }

  next();
});
export const processVideo = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("No video file uploaded", 400));
  }

  const publicId = req.file.public_id || req.file.filename.split('.')[0];
  
  // The video is already uploaded to Cloudinary via multer-storage-cloudinary
  const videoUrl = req.file.path;
  
  // Generate a default thumbnail URL that we'll use initially
  // This might be a placeholder until the eager transformation completes
  const thumbnailUrl = cloudinary.url(publicId, {
    resource_type: "video",
    format: "jpg",
    transformation: [
      { width: 320, height: 180, crop: "fill" },
      { quality: "auto" },
      { start_offset: "10%" },
    ],
  });

  // For large videos, request an eager transformation asynchronously
  try {
    await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      resource_type: "video",
      eager: [
        { 
          format: "jpg", 
          transformation: [
            { width: 320, height: 180, crop: "fill" },
            { quality: "auto" },
            { start_offset: "10%" }
          ]
        }
      ],
      eager_async: true,
      eager_notification_url: process.env.CLOUDINARY_NOTIFICATION_URL // Optional webhook for notification
    });
    
    console.log('Eager transformation requested for thumbnail generation');
  } catch (error) {
    console.error('Error requesting eager transformation:', error);
    // Continue anyway, as we still have the default thumbnail URL
  }

  // Attach to request for next middleware
  req.videoData = {
    fileUrl: videoUrl,
    thumbnailUrl: thumbnailUrl,
    publicId: publicId,
  };

  next();
});
// Create video entry in database
export const createVideo = catchAsync(async (req, res, next) => {
  if (!req.videoData) {
    return next(new AppError("Video processing failed", 500));
  }

  try {
    const { fileUrl, thumbnailUrl,publicId } = req.videoData;

    const video = await Video.create({
      title: req.body.title,
      description: req.body.description,
      fileUrl: fileUrl,
      thumbnail: thumbnailUrl,
      filePublicId: publicId,
     
      channel: req.user.channel,
      tags: req.body.tags || [],
    });

    await Channel.findByIdAndUpdate(
      req.user.channel,
      { $push: { videos: video._id } },
      { new: true, runValidators: true }
    );

    res.status(201).json({
      status: "success",
      data: { video },
    });
  } catch (err) {
    next(err);
  }
});

export const syncChannelVideos = catchAsync(async (req, res, next) => {
  // 1. Get all videos
  const videos = await Video.find({});
  const updates = [];

  // 2. For each video, update its channel's videos array
  for (const video of videos) {
    updates.push(
      Channel.findByIdAndUpdate(
        video.channel,
        { $addToSet: { videos: video._id } },
        { new: true }
      )
    );
  }

  // 3. Execute all updates
  await Promise.all(updates);

  // 4. Verify the sync
  const channels = await Channel.find({}).populate(
    "videos",
    "title description views createdAt"
  );

  res.status(200).json({
    status: "success",
    message: "All channels synchronized with their videos",
    data: {
      channels,
    },
  });
});
// Get video with processed URL
export const getVideo = catchAsync(async (req, res, next) => {
  const video = await Video.findById(req.params.videoId)
    .populate({
      path: "channel",
      select: "name owner subscribers",
      populate: {
        path: "owner",
        select: "photo fullName",
      },
    })
    .populate("likes", "fullName photo")
    .populate("dislikes", "fullName photo");

  if (!video) {
    return next(new AppError("Video not found", 404));
  }

  // Increment views
  video.views += 1;
  await video.save({ validateBeforeSave: false });

  // Format response
  const response = {
    id: video._id,
    title: video.title,
    description: video.description,
    fileUrl: video.fileUrl,
    thumbnail: video.thumbnail,
    views: video.views,
    likes: video.likes,
    dislikes: video.dislikes,
    tags: video.tags,
    channel: {
      id: video.channel._id,
      name: video.channel.name,
      subscribers: video.channel.subscribers,
      owner: {
        id: video.channel.owner._id,
        name: video.channel.owner.fullName,
        photo: video.channel.owner.photo,
      },
    },
    timeAgo: getTimeAgo(video.createdAt),
  };

  res.status(200).json({
    status: "success",
    data: { video: response },
  });
});
// Update video details
export const updateVideo = catchAsync(async (req, res, next) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    return next(new AppError("Video not found", 404));
  }

  // Ensure tags is always an array
  const allowedFields = ["title", "description", "tags"];
  console.log(req.body);

  const filteredBody = {};

  allowedFields.forEach((field) => {
    if (field in req.body) {
      if (field === "tags") {
        // Handle tags specifically - ensure it's always an array
        filteredBody[field] = Array.isArray(req.body[field])
          ? req.body[field]
          : [];
      } else {
        // For other fields, just copy them as is
        filteredBody[field] = req.body[field];
      }
    }
  });

  const updatedVideo = await Video.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    { new: true, runValidators: true }
  );

  if (!updatedVideo) {
    return next(new AppError("Failed to update video", 500));
  }

  res.status(200).json({
    status: "success",
    data: {
      video: updatedVideo,
    },
  });
});

// Delete video
export const deleteVideo = catchAsync(async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  
  if (!video) {
    return next(new AppError('Video not found', 404));
  }

  const channel = await Channel.findById(video.channel);
  
  if (!channel) {
    return next(new AppError('Associated channel not found', 404));
  }

  if (channel.owner.toString() !== req.user._id.toString()) {
    return next(new AppError('You are not authorized to delete this video', 403));
  }

  // Remove video reference from channel
  await Channel.findByIdAndUpdate(
    video.channel,
    { $pull: { videos: video._id } }
  );

  // Delete files from Cloudinary using stored public IDs
  try {
    if (video.filePublicId) {
      console.log('Deleting video with public ID:', video.filePublicId);
      const videoResult = await cloudinary.uploader.destroy(video.filePublicId, {
        resource_type: 'video'
      });
      console.log('Video deletion result:', videoResult);
    }

    if (video.thumbnailPublicId) {
      console.log('Deleting thumbnail with public ID:', video.thumbnailPublicId);
      const thumbnailResult = await cloudinary.uploader.destroy(video.thumbnailPublicId);
      console.log('Thumbnail deletion result:', thumbnailResult);
    }

    console.log('Cloudinary resources deleted successfully');
  } catch (err) {
    console.error('Error deleting from Cloudinary:', err);
    // Return error to client
    return next(new AppError('Error deleting media files from storage', 500));
  }

  // Delete the video document
  await video.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const aliasTrendingVideos = (req, res, next) => {
  req.query.limit = "10";
  req.query.sort = "-views,-createdAt";
  req.query.fields = "title,thumbnail,views,likes,channel,createdAt";
  next();
};

// getting all videos

export const getAllVideos = catchAsync(async (req, res, next) => {
  const features = new VideoFeature(
    Video.find()
      .populate({
        path: "channel",
        select: "name owner",
        populate: {
          path: "owner",
          select: "photo",
        },
      })
      .populate("likes", "fullName")
      .populate("dislikes", "fullName"),
    req.query
  )
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();

  const [videos, total] = await Promise.all([
    features.query,
    Video.countDocuments(features.queryObj),
  ]);

  // Format response data
  const formattedVideos = videos.map((video) => ({
    id: video._id,
    title: video.title,
    thumbnail: video.thumbnail,
    views: video.views,
    likes: video.likes.length,
    dislikes: video.dislikes.length,
    tags: video.tags,
    channel: {
      id: video.channel._id,
      name: video.channel.name,
      owner: {
        name: video.channel.owner.fullName,
        photo: video.channel.owner.photo,
      },
    },
    timeAgo: getTimeAgo(video.createdAt),
  }));

  res.status(200).json({
    status: "success",
    results: videos.length,
    total,
    data: {
      videos: formattedVideos,
    },
  });
});

export const videoSuggestions = catchAsync(async (req, res, next) => {
  const { search, limit = 5 } = req.query;

  if (!search) {
    return res.status(400).json({
      message: "Search query is required",
    });
  }

  // Escape any special regex characters in the search term
  const escapedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

  // Log the search term for debugging
  console.log("Search term:", search);

  const videos = await Video.aggregate([
    {
      $match: {
        // Use a simple contains match
        title: { $regex: escapedSearch, $options: "i" },
      },
    },
    {
      // Log matching titles for debugging
      $project: {
        _id: 1,
        title: 1,
        channel: 1,
        debug_title: { $toLower: "$title" },
      },
    },
    {
      $lookup: {
        from: "channels",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
      },
    },
    {
      $unwind: "$channel",
    },
    {
      $project: {
        _id: 1,
        title: 1,
        thumbnail: 1,
        "channel.name": 1,
      },
    },
    {
      $limit: parseInt(limit),
    },
  ]);

  // Log the result count

  res.status(200).json({
    status: "success",
    data: { videos },
  });
});

export const getVideosByTag = catchAsync(async (req, res, next) => {
  const { tag } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const videos = await Video.find({ tags: tag })
    .populate({
      path: "channel",
      select: "name owner",
      populate: {
        path: "owner",
        select: "photo fullName",
      },
    })
    .skip(skip)
    .limit(limit)
    .sort("-createdAt");

  const total = await Video.countDocuments({ tags: tag });

  res.status(200).json({
    status: "success",
    results: videos.length,
    total,
    data: { videos },
  });
});
export const getVideoStats = catchAsync(async (req, res, next) => {
  const { channelId } = req.query;

  // Convert channelId to ObjectId if provided
  const matchStage = channelId
    ? { channel: new mongoose.Types.ObjectId(channelId) }
    : {};

  const stats = await Video.aggregate([
    {
      $match: matchStage,
    },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
        totalLikes: { $sum: { $size: "$likes" } },
        totalDislikes: { $sum: { $size: "$dislikes" } },
        avgViews: { $avg: "$views" },
        avgLikes: { $avg: { $size: "$likes" } },
        avgDuration: { $avg: "$duration" },
      },
    },
  ]);

  const trendingTags = await Video.aggregate([
    {
      $match: matchStage, // Apply same channel filter to tags if needed
    },
    {
      $unwind: "$tags",
    },
    {
      $group: {
        _id: "$tags",
        count: { $sum: 1 },
        totalViews: { $sum: "$views" },
      },
    },
    {
      $sort: { totalViews: -1 },
    },
    {
      $limit: 10,
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats: stats[0],
      trendingTags,
    },
  });
});

// Get channel videos summary
export const getChannelVideoStats = catchAsync(async (req, res, next) => {
  const channelId = req.params.channelId;
  console.log(channelId);

  const stats = await Video.aggregate([
    {
      $match: { channel: channelId },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m", date: "$createdAt" },
        },
        videos: { $sum: 1 },
        totalViews: { $sum: "$views" },
        totalLikes: { $sum: { $size: "$likes" } },
        avgViews: { $avg: "$views" },
      },
    },
    {
      $sort: { _id: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});


export const cleanupOnError = catchAsync(async (req, res, next) => {
  // If there was an error and a file was uploaded
  if (req.file && req.videoData?.publicId) {
    try {
      await cloudinary.uploader.destroy(req.videoData.publicId, {
        resource_type: 'video'
      });
    } catch (err) {
      console.error('Cleanup error:', err);
    }
  }
  next(); // Continue to error handler
});

export const uploadVideoFile = (req, res, next) => {
  const upload = uploadVideo.single('video');
  
  upload(req, res, function(err) {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          status: 'error',
          message: 'File too large: Maximum size is 100MB'
        });
      }
      
      if (err.message && err.message.includes('timeout')) {
        return res.status(408).json({
          status: 'error',
          message: 'Upload timed out. Try a smaller file or check your connection.'
        });
      }
      
      // Log detailed error for debugging
      console.error('Upload error:', err);
      
      return res.status(400).json({
        status: 'error',
        message: `Upload failed: ${err.message}`
      });
    }
    next();
  });
};