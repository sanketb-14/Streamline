import { motion } from "framer-motion";
import { useState } from "react";
import { MessageCircle, ThumbsUp, ThumbsDown, Loader, ChevronDown, ChevronUp, Reply } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * Comment Component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.comment - Comment data object
 * @param {Object} props.user - Current user object
 * @param {Function} props.onLikeComment - Like comment handler
 * @param {Function} props.onDislikeComment - Dislike comment handler
 * @param {string|boolean} props.isLikingComment - Loading state for like action
 * @param {string|boolean} props.isDislikingComment - Loading state for dislike action
 * @returns {JSX.Element} - Rendered comment component
 */
const Comment = ({ 
  comment, 
  user,
  onLikeComment,
  onDislikeComment,
  isLikingComment,
  isDislikingComment,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showReplies, setShowReplies] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="mb-6 bg-base-100 rounded-xl p-4 shadow-sm"
    >
      <div className="flex gap-4">
        <Link to={`/channel/${comment.userId}`} className="flex-shrink-0">
          <img 
            className="h-10 w-10 rounded-full bg-base-200 object-cover" 
            src={comment.userAvatar} 
            alt={comment.userName} 
            loading="lazy"
          />
        </Link>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <Link to={`/channel/${comment.userId}`} className="font-medium hover:text-primary">
                {comment.userName}
              </Link>
              <span className="text-xs text-base-content/50 ml-2">
                {comment.timestamp}
              </span>
            </div>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-base-content/50 hover:text-base-content"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {isExpanded && (
            <>
              <p className="mt-2 text-base-content/90">{comment.content}</p>
              
              <div className="flex items-center gap-4 mt-3">
                <button 
                  onClick={() => onLikeComment(comment._id)}
                  disabled={isLikingComment}
                  className={`flex items-center gap-1 text-sm ${comment.isLiked ? 'text-primary' : 'text-base-content/70 hover:text-primary'}`}
                >
                  {isLikingComment && comment._id === isLikingComment ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <ThumbsUp size={16} />
                  )} 
                  {comment.likes > 0 && comment.likes}
                </button>
                
                <button 
                  onClick={() => onDislikeComment(comment._id)}
                  disabled={isDislikingComment}
                  className={`flex items-center gap-1 text-sm ${comment.isDisliked ? 'text-error' : 'text-base-content/70 hover:text-error'}`}
                >
                  {isDislikingComment && comment._id === isDislikingComment ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <ThumbsDown size={16} />
                  )}
                </button>
                
                <button className="flex items-center gap-1 text-sm text-base-content/70 hover:text-primary">
                  <Reply size={14} />
                  Reply
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Replies Section */}
      {comment.replies?.length > 0 && (
        <div className="mt-4 pl-14">
          <button 
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1 text-sm text-primary hover:underline mb-2"
          >
            {showReplies ? 'Hide replies' : `Show ${comment.replies.length} replies`}
            {showReplies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showReplies && (
            <div className="space-y-4 border-l-2 border-base-200 pl-4">
              {comment.replies.map(reply => (
                <Comment 
                  key={reply._id}
                  comment={reply}
                  user={user}
                  onLikeComment={onLikeComment}
                  onDislikeComment={onDislikeComment}
                  isLikingComment={isLikingComment}
                  isDislikingComment={isDislikingComment}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

/**
 * VideoComments Component
 * 
 * @param {Object} props - Component props
 * @param {Array} props.comments - Array of comments
 * @param {number} props.totalComments - Total number of comments
 * @param {Function} props.onAddComment - Add comment handler
 * @param {Function} props.likeComment - Like comment handler
 * @param {Function} props.dislikeComment - Dislike comment handler
 * @param {string|boolean} props.isLikingComment - Loading state for like action
 * @param {string|boolean} props.isDislikingComment - Loading state for dislike action
 * @param {boolean} props.isAddingComment - Loading state for add comment action
 * @returns {JSX.Element} - Rendered video comments component
 */
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
  const [isFocused, setIsFocused] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      await onAddComment(newComment);
      setNewComment("");
      setIsFocused(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex justify-center py-8">
        <Loader className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-8"
    >
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <MessageCircle size={20} className="text-primary" />
        <span>{totalComments} Comments</span>
      </h3>

      {/* Comment Input */}
      {user ? (
        <form onSubmit={handleAddComment} className="mb-8">
          <div className="flex gap-4">
            <Link to={`/channel/${user._id}`} className="flex-shrink-0">
              <img 
                className="rounded-full w-10 h-10 object-cover bg-base-200" 
                src={user.photo} 
                alt={user.fullName} 
                loading="lazy"
              />
            </Link>
            
            <div className="flex-grow space-y-3">
              <div className="relative">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  placeholder="Add a comment..."
                  rows={isFocused ? 3 : 1}
                  className="w-full bg-base-200 border border-base-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                />
              </div>
              
              {(isFocused || newComment.trim()) && (
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setNewComment("");
                      setIsFocused(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-base-content/75 hover:text-base-content bg-base-200 hover:bg-base-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isAddingComment}
                    className="px-6 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-content rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-24"
                  >
                    {isAddingComment ? (
                      <Loader className="animate-spin mr-2" size={16} />
                    ) : null}
                    Comment
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 bg-base-200 rounded-xl text-center gap-4 mb-8">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-base-content">
              Join the conversation
            </h2>
            <p className="text-base-content/75">
              Sign in to leave comments and interact with other users
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/login"
              className="btn btn-primary"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn btn-ghost bg-base-300 hover:bg-base-300/80"
            >
              Register
            </Link>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Comment 
              key={comment._id} 
              comment={comment} 
              user={user}
              onLikeComment={likeComment}
              onDislikeComment={dislikeComment}
              isLikingComment={isLikingComment}
              isDislikingComment={isDislikingComment}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-base-200 rounded-xl">
            <MessageCircle size={40} className="mx-auto text-base-content/30 mb-3" />
            <h4 className="text-lg font-medium text-base-content/70">
              No comments yet
            </h4>
            <p className="text-base-content/50 mt-1">
              Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// PropTypes validation
Comment.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
   
    userName: PropTypes.string.isRequired,
    userAvatar: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    likes: PropTypes.number,
    isLiked: PropTypes.bool,
    isDisliked: PropTypes.bool,
    replies: PropTypes.array,
  }).isRequired,
  user: PropTypes.object,
  onLikeComment: PropTypes.func.isRequired,
  onDislikeComment: PropTypes.func.isRequired,
  isLikingComment: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  isDislikingComment: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

VideoComments.propTypes = {
  comments: PropTypes.array.isRequired,
  totalComments: PropTypes.number.isRequired,
  onAddComment: PropTypes.func.isRequired,
  likeComment: PropTypes.func.isRequired,
  dislikeComment: PropTypes.func.isRequired,
  isLikingComment: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  isDislikingComment: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  isAddingComment: PropTypes.bool,
};

export default VideoComments;