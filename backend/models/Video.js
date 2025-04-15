import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Video must have title"],
    trim: true,
    maxLength: [50, "A video title must be at max 50 characters"],
    minLength: [10, "A video title must be at least 10 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxLength: [500, "Description must be at 100 characters"],
  },
  fileUrl: { type: String, required: true },
  thumbnail: String,
  views: {
    type: Number,
    default: 0,
    validate: {
      validator: Number.isInteger,
      message: "Views must be an integer",
    },
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: true,
  },
  tags: {
    type: [
      {
        type: String,
        enum: [
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
        ],
      },
    ],
    validate: [arrayLimit, "A video can have up to 5 tags"],
  },
  createdAt: { type: Date, default: Date.now },
});

function arrayLimit(val) {
  return val.length <= 5;
}

const Video = mongoose.model("Video", VideoSchema);

export default Video;
