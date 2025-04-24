import { motion } from "framer-motion";
import { Play, Eye, Clock, Verified } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

/**
 * VideoCard - A responsive card component for displaying video content
 * 
 * Features:
 * - Responsive design with hover animations
 * - Optimized view count formatting
 * - Duration display formatting
 * - Fallback thumbnail handling
 * - Accessibility optimized
 * - DaisyUI color system integration
 * - Performance optimized with memoization
 */
const VideoCard = ({ video }) => {
  // Memoized formatted view count
  const formattedViews = useMemo(() => {
    if (!video?.views) return '0';
    if (video.views >= 1000000) return `${(video.views / 1000000).toFixed(1)}M`;
    if (video.views >= 1000) return `${(video.views / 1000).toFixed(1)}K`;
    return video.views.toString();
  }, [video.views]);

  // Memoized formatted duration (mm:ss)
  const formattedDuration = useMemo(() => {
    if (!video?.duration) return '0:00';
    
    const minutes = Math.floor(video.duration / 60);
    const seconds = Math.floor(video.duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [video.duration]);

  // Thumbnail with fallback
  const thumbnailUrl = video?.thumbnail || '/default-thumbnail.jpg';

  return (
    <Link 
      to={`/watch/${video?._id}`}
      className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg transition-all duration-200 hover:bg-base-200/50"
      aria-label={`Watch ${video?.title || 'video'}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="group"
      >
        {/* Thumbnail Container */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-base-300 shadow-sm">
          {/* Optimized Thumbnail Image */}
          <img
            src={thumbnailUrl}
            alt={`${video?.title || 'Video'} thumbnail`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = '/default-thumbnail.jpg';
            }}
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-base-content/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
            >
              <Play className="w-5 h-5 text-primary-content fill-current" />
            </motion.div>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-base-content/90 text-base-100 text-xs px-2 py-1 rounded-md">
            {formattedDuration}
          </div>
        </div>

        {/* Video Info */}
        <div className="mt-3 space-y-1.5 px-1 pb-1">
          <h3 
            className="font-medium text-base-content line-clamp-2 text-sm md:text-base"
            title={video?.title}
          >
            {video?.title || 'Untitled Video'}
            {video?.isVerified && (
              <Verified className="w-4 h-4 inline-block ml-1.5 text-primary" />
            )}
          </h3>
          
          <div className="flex items-center gap-3 text-xs md:text-sm text-base-content/70">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              {formattedViews} views
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {formattedDuration}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

VideoCard.propTypes = {
  video: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    thumbnail: PropTypes.string,
    views: PropTypes.number,
    duration: PropTypes.number,
    isVerified: PropTypes.bool,
  }).isRequired,
};

export default VideoCard;