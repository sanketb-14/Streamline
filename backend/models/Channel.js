import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "", // Empty default description
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // One channel per user
  },
  subscribers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



const Channel = mongoose.model("Channel", ChannelSchema);

export default Channel;