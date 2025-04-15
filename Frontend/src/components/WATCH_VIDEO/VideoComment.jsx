import { motion } from "framer-motion";
import { useState } from "react";
import { MessageCircle, ThumbsUp, ThumbsDown, Loader } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
const Comment = ({ 
  comment, 
  user,
  onLikeComment,
  onDislikeComment,
  isLikingComment,
  isDislikingComment,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 mb-4"
    >
      <img 
        className="h-10 w-10 rounded-full bg-base-100/50 flex-shrink-0" 
        src={`http://localhost:4000/public/img/users/${comment?.userAvatar}`} 
        alt={comment.userName} 
      />
      
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <span className="font-medium">{comment.userName}</span>
          <span className="text-sm text-base-content/50">{comment.timestamp}</span>
        </div>
        <p className="mt-1">{comment.content}</p>
        <div className="flex items-center gap-4 mt-2">
          <button 
            className={`flex items-center gap-1 ${comment.isLiked ? 'text-primary' : ''}`}
            onClick={() => onLikeComment(comment._id)}
            disabled={isLikingComment}
          >
            {isLikingComment && comment._id === isLikingComment ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <ThumbsUp size={16} />
            )} 
            {comment.likes}
          </button>
          <button 
            className={`flex items-center gap-1 ${comment.isDisliked ? 'text-blue-500' : ''}`}
            onClick={() => onDislikeComment(comment._id)}
            disabled={isDislikingComment}
          >
            {isDislikingComment && comment._id === isDislikingComment ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <ThumbsDown size={16} />
            )}
          </button>
          <button className="text-sm font-medium">Reply</button>
        </div>
      </div>
    </motion.div>
  );
};
const VideoComments = ({ 
  comments, 
  totalComments, 
  onAddComment,
  likeComment,
  dislikeComment,
  isLikingComment,
  isDislikingComment,
  isAddingComment,
}) => {
  const { isLoadingUser, user } = useAuth();
  const [newComment, setNewComment] = useState("");

  const handleAddComment = async () => {
    if (newComment.trim()) {
      await onAddComment(newComment);
      setNewComment("");
    }
  };

  if (isLoadingUser) {
    return <Loader className="animate-spin" />;
  }

  return (
    <div className="mt-6 ">
      {!user && (
        <div className="flex flex-col items-center justify-center p-6 bg-base-200 rounded-lg text-center gap-4 max-w-md mx-auto my-2">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-base-content">
              Join the conversation
            </h2>
            <p className="text-base-content/75">
              Sign in to leave comments and interact with other users
            </p>
          </div>

          <Link
            to="/login"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Sign In
          </Link>

          <p className="text-sm text-base-content/50">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      )}
      <h3 className="text-lg font-medium mb-4">{totalComments} Comments</h3>

      {/* Comment Input */}
      {user && (
        <div className="flex gap-4 mb-6">
          <img 
            className="rounded-full w-12 h-12" 
            src={`http://localhost:4000/public/img/users/${user.photo}`} 
            alt={user.fullName} 
          />
          <div className="flex-grow">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              placeholder="Add a comment..."
              className="w-full bg-transparent border-b border-base/75 focus:border-blue-500 outline-none pb-2"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setNewComment("")}
                className="px-4 py-2 text-sm font-medium bg-base-200 rounded-2xl"
              >
                Cancel
              </button>
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim() || isAddingComment}
                className="px-4 py-2 text-sm font-medium bg-primary rounded-full disabled:opacity-50"
              >
                {isAddingComment ? (
                  <Loader className="animate-spin" size={16} />
                ) : (
                  "Comment"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div>
        {comments.map((comment) => (
          <Comment 
            key={comment._id} 
            comment={comment} 
            user={user}
            onLikeComment={likeComment}
            onDislikeComment={dislikeComment}
            isLikingComment={isLikingComment}
            isDislikingComment={isDislikingComment}

          />
        ))}
      </div>
    </div>
  );
};

export default VideoComments;