import Channel from "../models/Channel.js";
import User from "../models/User.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";

export const getChannelDetail = catchAsync(async (req, res, next) => {
  const { channelId } = req.params;

 

  // Find channel and populate necessary data
  const channel = await Channel.findById(channelId)
    .populate({
      path: "owner",
      select: "fullName photo email isEmailVerified", // Select relevant owner fields
    })
    .populate({
      path: "subscribers",
      select: "fullName photo", // Select relevant subscriber fields
    })
    .populate({
      path: "videos",
      select: "title description thumbnail views duration createdAt",
      options: { sort: { createdAt: -1 } }, // Sort videos by newest first
    })
    .lean();

  if (!channel) {
    return next(new AppError("No channel found with that ID", 404));
  }

  // Calculate channel statistics
  const statistics = {
    totalSubscribers: channel.subscribers.length,
    totalVideos: channel.videos.length,
    totalViews: channel.videos.reduce(
      (acc, video) => acc + (video.views || 0),
      0
    ),
  };

  // Check if the requesting user is subscribed (if authenticated)
  let isSubscribed = false;
  if (req.user) {
    isSubscribed = channel.subscribers.some(
      (subscriber) => subscriber._id.toString() === req.user._id.toString()
    );
  }

  console.log(isSubscribed);
  

  // Format response
  const response = {
    ...channel,
    statistics,
    isSubscribed,
  };

  // Send response
  res.status(200).json({
    status: "success",
    data: {
      channel: response,
    },
  });
});

// Get channel by custom URL or name (optional additional function)
export const getChannelByName = catchAsync(async (req, res, next) => {
  const { channelName } = req.params;

  const channel = await Channel.findOne({ name: channelName })
    .populate({
      path: "owner",
      select: "fullName photo email isEmailVerified",
    })
    .populate({
      path: "subscribers",
      select: "fullName photo",
    })
    .populate({
      path: "videos",
      select: "title description thumbnail views duration createdAt",
      options: { sort: { createdAt: -1 } },
    })
    .lean();

  if (!channel) {
    return next(new AppError("No channel found with that name", 404));
  }

  const statistics = {
    totalSubscribers: channel.subscribers.length,
    totalVideos: channel.videos.length,
    totalViews: channel.videos.reduce(
      (acc, video) => acc + (video.views || 0),
      0
    ),
  };

  let isSubscribed = false;
  if (req.user) {
    isSubscribed = channel.subscribers.some(
      (subscriber) => subscriber._id.toString() === req.user._id.toString()
    );
  }

  const response = {
    ...channel,
    statistics,
    isSubscribed,
  };

  res.status(200).json({
    status: "success",
    data: {
      channel: response,
    },
  });
});



export const updateChannel = catchAsync(async (req, res, next) => {
  // 1. Get data from request body
  const { name, description } = req.body;

  // 2. Get user's channel (using authenticated user's ID)
  const channel = await Channel.findOne({ owner: req.user._id });

  // 3. Check if channel exists
  if (!channel) {
    return next(new AppError('No channel found for this user', 404));
  }

  // 4. Validate input data
  if (!name && !description) {
    return next(new AppError('Please provide name or description to update', 400));
  }

  // 5. Update only allowed fields
  const updates = {};
  if (name) updates.name = name;
  if (description) updates.description = description;

  // 6. Update channel
  const updatedChannel = await Channel.findByIdAndUpdate(
    channel._id,
    updates,
    {
      new: true, // Return updated document
      runValidators: true, // Run model validators
    }
  ).populate({
    path: 'owner',
    select: 'fullName photo'
  });

  // 7. Send response
  res.status(200).json({
    status: 'success',
    data: {
      channel: updatedChannel
    }
  });
});

// Middleware to check if user owns the channel
export const checkChannelOwnership = catchAsync(async (req, res, next) => {
  const channel = await Channel.findById(req.params.channelId);

  if (!channel) {
    return next(new AppError('No channel found with that ID', 404));
  }

  if (channel.owner.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to edit this channel', 403));
  }

  next();
});


export const createChannel = catchAsync(async (req, res, next) => {
  // 1. Check if user already has a channel
  const existingChannel = await Channel.findOne({ owner: req.user._id });
  
  if (existingChannel) {
    return next(new AppError('You already have a channel', 400));
  }

  // 2. Create channel
  const channel = await Channel.create({
    name: req.body.name,
    description: req.body.description || '',
    owner: req.user._id
  });

  // 3. Update user with channel reference
  await User.findByIdAndUpdate(
    req.user._id,
    { channel: channel._id },
    { new: true, runValidators: true }
  );

  // 4. Fetch complete channel data with populated fields
  const populatedChannel = await Channel.findById(channel._id)
    .populate('owner', 'fullName photo')
    .populate('subscribers', 'fullName photo');

  // 5. Send response
  res.status(201).json({
    status: 'success',
    data: {
      channel: populatedChannel
    }
  });
});

// Subscribe to a channel
export const subscribeChannel = catchAsync(async (req, res, next) => {
  const { channelId } = req.params;

  // 1. Check if channel exists
  const channelToSubscribe = await Channel.findById(channelId);
  if (!channelToSubscribe) {
    return next(new AppError('Channel not found', 404));
  }

  // 2. Check if user is trying to subscribe to their own channel
  // if (channelToSubscribe.owner.toString() === req.user._id.toString()) {
  //   return next(new AppError('You cannot subscribe to your own channel', 400));
  // }

  // 3. Check if user is already subscribed
  if (channelToSubscribe.subscribers.includes(req.user._id)) {
    return next(new AppError('You are already subscribed to this channel', 200));
  }

  // 4. Add user to subscribers
  channelToSubscribe.subscribers.push(req.user._id);
  await channelToSubscribe.save();

  res.status(200).json({
    status: 'success',
    message: 'Successfully subscribed to channel',
    data: {
      channel: {
        id: channelToSubscribe._id,
        name: channelToSubscribe.name,
        subscribersCount: channelToSubscribe.subscribers.length ,
        isSubscribed :true 
      }
    }
  });
});


// Unsubscribe from a channel
export const unsubscribeChannel = catchAsync(async (req, res, next) => {
  const { channelId } = req.params;

  // 1. Check if channel exists
  const channel = await Channel.findById(channelId);
  if (!channel) {
    return next(new AppError('Channel not found', 404));
  }

  // 2. Check if user was subscribed in the first place
  const isSubscribed = channel.subscribers.some(
    subscriberId => subscriberId.toString() === req.user._id.toString()
  );
  
  if (!isSubscribed) {
    return next(new AppError('You are not subscribed to this channel', 400));
  }

  // 3. Remove user from subscribers
  channel.subscribers = channel.subscribers.filter(
    subscriberId => subscriberId.toString() !== req.user._id.toString()
  );
  await channel.save();

  res.status(200).json({
    status: 'success',
    message: 'Successfully unsubscribed from channel',
    data: {
      channel: {
        id: channel._id,
        name: channel.name,
        subscribersCount: channel.subscribers.length,
        isSubscribed: false
      }
    }
  });
});

// Get channel subscribers
export const getChannelSubscribers = catchAsync(async (req, res, next) => {
  const { channelId } = req.params;

  const channel = await Channel.findById(channelId)
    .populate('subscribers', 'fullName photo')
    .select('subscribers');

  if (!channel) {
    return next(new AppError('Channel not found', 404));
  }

  res.status(200).json({
    status: 'success',
    results: channel.subscribers.length,
    data: {
      subscribers: channel.subscribers
    }
  });
});
