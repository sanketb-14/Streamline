import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js'
import Video from '../models/Video.js';
import Comment from '../models/Comment.js';
import Channel from '../models/Channel.js';

// Like/Dislike Video Functions
export const likeVideo = catchAsync(async (req, res, next) => {
    const video = await Video.findById(req.params.videoId);
    if (!video) {
        return next(new AppError('Video not found', 404));
    }

    // Check if user already liked the video
    const alreadyLiked = video.likes.includes(req.user._id);
    const alreadyDisliked = video.dislikes.includes(req.user._id);

    // If already liked, remove like (toggle)
    if (alreadyLiked) {
        video.likes.pull(req.user._id);
    } 
    // If not liked yet
    else {
        // If disliked, remove from dislikes first
        if (alreadyDisliked) {
            video.dislikes.pull(req.user._id);
        }
        // Add like
        video.likes.push(req.user._id);
    }

    await video.save();

    res.status(200).json({
        status: 'success',
        data: {
            likes: video.likes.length,
            dislikes: video.dislikes.length,
            isLiked: !alreadyLiked,
            isDisliked: false
        }
    });
});

export const dislikeVideo = catchAsync(async (req, res, next) => {
    const video = await Video.findById(req.params.videoId);
    if (!video) {
        return next(new AppError('Video not found', 404));
    }

    const alreadyDisliked = video.dislikes.includes(req.user._id);
    const alreadyLiked = video.likes.includes(req.user._id);

    if (alreadyDisliked) {
        video.dislikes.pull(req.user._id);
    } else {
        if (alreadyLiked) {
            video.likes.pull(req.user._id);
        }
        video.dislikes.push(req.user._id);
    }

    await video.save();

    res.status(200).json({
        status: 'success',
        data: {
            likes: video.likes.length,
            dislikes: video.dislikes.length,
            isLiked: false,
            isDisliked: !alreadyDisliked
        }
    });
});

// Comment Functions
export const createComment = catchAsync(async (req, res, next) => {
    const video = await Video.findById(req.params.videoId);
    if (!video) {
        return next(new AppError('Video not found', 404));
    }

    const comment = await Comment.create({
        content: req.body.content,
        user: req.user._id,
        video: req.params.videoId
    });

    // Populate user details for response
    await comment.populate('user', 'fullName photo');

    res.status(201).json({
        status: 'success',
        data: {
            comment
        }
    });
});

export const getVideoComments = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ video: req.params.videoId })
        .populate('user', 'fullName photo')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit);

    const total = await Comment.countDocuments({ video: req.params.videoId });

    res.status(200).json({
        status: 'success',
        results: comments.length,
        total,
        data: {
            comments
        }
    });
});

export const deleteComment = catchAsync(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId)
        .populate({
            path: 'video',
            select: 'channel',
            populate: {
                path: 'channel',
                select: 'owner'
            }
        });

    if (!comment) {
        return next(new AppError('Comment not found', 404));
    }

    // Check if user is comment owner or video owner
    const isCommentOwner = comment.user.toString() === req.user._id.toString();
    const isVideoOwner = comment.video.channel.owner.toString() === req.user._id.toString();

    if (!isCommentOwner && !isVideoOwner) {
        return next(new AppError('You are not authorized to delete this comment', 403));
    }

    await comment.deleteOne();

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Comment Like/Dislike Functions
export const likeComment = catchAsync(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
        return next(new AppError('Comment not found', 404));
    }

    const alreadyLiked = comment.likes.includes(req.user._id);
    const alreadyDisliked = comment.dislikes.includes(req.user._id);

    if (alreadyLiked) {
        comment.likes.pull(req.user._id);
    } else {
        if (alreadyDisliked) {
            comment.dislikes.pull(req.user._id);
        }
        comment.likes.push(req.user._id);
    }

    await comment.save();

    res.status(200).json({
        status: 'success',
        data: {
            likes: comment.likes.length,
            dislikes: comment.dislikes.length,
            isLiked: !alreadyLiked,
            isDisliked: false
        }
    });
});

export const dislikeComment = catchAsync(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
        return next(new AppError('Comment not found', 404));
    }

    const alreadyDisliked = comment.dislikes.includes(req.user._id);
    const alreadyLiked = comment.likes.includes(req.user._id);

    if (alreadyDisliked) {
        comment.dislikes.pull(req.user._id);
    } else {
        if (alreadyLiked) {
            comment.likes.pull(req.user._id);
        }
        comment.dislikes.push(req.user._id);
    }

    await comment.save();

    res.status(200).json({
        status: 'success',
        data: {
            likes: comment.likes.length,
            dislikes: comment.dislikes.length,
            isLiked: false,
            isDisliked: !alreadyDisliked
        }
    });
});