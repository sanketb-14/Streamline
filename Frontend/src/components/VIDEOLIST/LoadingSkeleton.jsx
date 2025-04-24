import { motion } from "framer-motion";
import { FiFilm } from "react-icons/fi";

/**
 * VideoSkeleton - A skeleton loader component for video cards
 * Uses DaisyUI colors and proper animation for better UX
 */
const VideoSkeleton = () => (
  <motion.div
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
    className="w-full space-y-3"
  >
    {/* Video thumbnail placeholder */}
    <div className="aspect-video bg-base-300/50 rounded-xl flex items-center justify-center">
      <FiFilm className="text-base-content/30 text-4xl animate-pulse" />
    </div>
    
    {/* Video info placeholder */}
    <div className="flex gap-3">
      {/* Channel avatar placeholder */}
      <div className="w-10 h-10 rounded-full bg-base-200/70 flex-shrink-0" />
      
      <div className="flex-1 space-y-2">
        {/* Video title placeholder */}
        <div className="h-4 bg-base-300/60 rounded w-full max-w-[80%]" />
        
        {/* Channel name placeholder */}
        <div className="h-3 bg-base-300/40 rounded w-full max-w-[60%]" />
        
        {/* View count placeholder */}
        <div className="h-3 bg-base-300/30 rounded w-full max-w-[40%]" />
      </div>
    </div>
  </motion.div>
);

/**
 * LoadingSkeleton - Grid layout for multiple video skeleton loaders
 * Responsive design with different columns for different screen sizes
 */
export default function LoadingSkeleton() {
  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4"
      aria-label="Loading videos..."
    >
      {[...Array(8)].map((_, i) => (
        <VideoSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  );
}