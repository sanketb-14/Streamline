import { motion } from "framer-motion";

const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-base-100 p-6">
      {/* Top Header Skeleton */}
      <motion.div
        className="bg-gradient-to-br from-primary via-base-300 shadow-xl rounded-xl mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            {/* Profile Image Skeleton */}
            <div className="w-36 h-36 rounded-full border-4 border-accent bg-base-200 animate-pulse" />
            <div className="space-y-2 flex-1">
              {/* Channel Name Skeleton */}
              <div className="h-8 bg-base-200 rounded animate-pulse w-3/4" />
              {/* Description Skeleton */}
              <div className="h-4 bg-base-200 rounded animate-pulse w-full" />
              <div className="h-4 bg-base-200 rounded animate-pulse w-1/2" />
              {/* Subscribers Skeleton */}
              <div className="h-4 bg-base-200 rounded animate-pulse w-1/3" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Skeleton */}
      <div className="space-y-6">
        {/* Channel Statistics Heading Skeleton */}
        <div className="h-8 bg-base-200 rounded animate-pulse w-1/4" />

        {/* Stats Grid Skeleton */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-base-100 rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                {/* Stat Title Skeleton */}
                <div className="h-4 bg-base-200 rounded animate-pulse w-1/2" />
                {/* Stat Icon Skeleton */}
                <div className="h-6 w-6 bg-base-200 rounded-full animate-pulse" />
              </div>
              <div className="space-y-2">
                {/* Stat Value Skeleton */}
                <div className="h-8 bg-base-200 rounded animate-pulse w-3/4" />
                {/* Stat Change Skeleton */}
                <div className="h-4 bg-base-200 rounded animate-pulse w-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Video Section Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg">
              {/* Video Thumbnail Skeleton */}
              <div className="aspect-video bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-4">
                {/* Video Title Skeleton */}
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-2">
                  {/* Video Description Skeleton */}
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                </div>
                {/* Video Metadata Skeleton */}
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;