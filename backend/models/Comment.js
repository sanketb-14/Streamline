import mongoose from "mongoose";
const CommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
  });

  const Comment = mongoose.model("Comment" , CommentSchema)

  export default Comment 