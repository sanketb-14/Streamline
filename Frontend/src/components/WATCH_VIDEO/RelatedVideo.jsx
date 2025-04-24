import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { Eye, Clock } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * RelatedVideoItem Component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.video - Video data object
 * @returns {JSX.Element} - Rendered related video item
 */
const RelatedVideoItem = ({ video }) => (
  <Link to={`/watch/${video._id}`} className="block hover:bg-base-200/50 rounded-lg transition-colors">
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="flex gap-3 p-2"
      whileHover={{ scale: 1.02 }}
    >
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-40 h-24">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover rounded-lg bg-base-300"
          loading="lazy"
        />
        {video.duration && (
          <div className="absolute bottom-1 right-1 bg-base-100/90 text-xs px-1.5 py-0.5 rounded">
            {video.duration}
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-base-content line-clamp-2 text-sm md:text-base">
          {video.title}
        </h4>
        <p className="text-sm text-base-content/60 mt-1 line-clamp-1">
          {video.channelName}
        </p>
        <div className="flex items-center gap-3 mt-1 text-xs text-base-content/50 text-nowrap">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3 text-accent" />
            {video.views}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-accent" />
            {video.uploadDate}
          </span>
        </div>
      </div>
    </motion.div>
  </Link>
);

/**
 * RelatedVideos Component
 * 
 * @param {Object} props - Component props
 * @param {Array} props.videos - Array of related videos
 * @param {string} props.currentVideoId - ID of the current video to exclude
 * @returns {JSX.Element} - Rendered related videos list
 */
const RelatedVideos = ({ videos, currentVideoId }) => {
  // Filter out the current video and limit to 6 related videos
  const filteredVideos = videos
    ?.filter(video => video._id !== currentVideoId)
    ?.slice(0, 6) || [];

  if (filteredVideos.length === 0) {
    return null; // Don't render if no related videos
  }

  return (
    <div className="mt-8 lg:mt-0 lg:ml-6 lg:w-80 flex-shrink-0">
    
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-3"
      >
        {filteredVideos.map((video) => (
          <RelatedVideoItem 
            key={video._id} 
            video={video} 
          />
        ))}
      </motion.div>
    </div>
  );
};

// PropTypes validation
RelatedVideos.propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
      channelName: PropTypes.string.isRequired,
      views: PropTypes.string,
      uploadDate: PropTypes.string,
      duration: PropTypes.string
    })
  ),
  currentVideoId: PropTypes.string
};

RelatedVideoItem.propTypes = {
  video: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    channelName: PropTypes.string.isRequired,
    views: PropTypes.string,
    uploadDate: PropTypes.string,
    duration: PropTypes.string
  }).isRequired
};

export default RelatedVideos;