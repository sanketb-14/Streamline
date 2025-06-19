import { useVideos } from "../../hooks/useVideos";
import LoadingSkeleton from "./LoadingSkeleton";
import VideoCard from "./VideoCard";
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * VideoList Component
 * 
 * Displays a grid of video cards with:
 * - Loading state skeleton
 * - Error handling with retry option
 * - Responsive grid layout
 * - Smooth animations
 */
export default function VideoList() {
  const { videos, isLoading, isError, error, refetch } = useVideos();

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-8 rounded-lg bg-base-200/50 text-center"
      >
        <div className="flex items-center text-error mb-4">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span className="font-medium">Error loading videos</span>
        </div>
        <p className="text-base-content/70 mb-4 text-sm">
          {error?.message || "An unknown error occurred"}
        </p>
        <motion.button
          onClick={refetch}
          className="btn btn-sm btn-ghost text-primary hover:text-primary/80 flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </motion.button>
      </motion.div>
    );
  }

  // Empty state
  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-base-content/60">
        <AlertCircle className="w-8 h-8 mb-4" />
        <h3 className="text-lg font-medium mb-2">No videos found</h3>
        <p className="text-sm">Try adjusting your filters or check back later</p>
      </div>
    );
  }

  // Success state
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {videos.map((video, index) => (
        <VideoCard key={video.id} video={video} index={index} />
      ))}
    </motion.div>
  );
}

// // Prop type validation
// VideoList.propTypes = {
//   // Add any props if this component receives any
// };