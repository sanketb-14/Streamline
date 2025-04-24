"use client";

import { motion } from "framer-motion";
import { TrendingUp, Eye, Clock, ThumbsUp, Users, Video, Award, BarChart3 } from "lucide-react";

/**
 * LoadingSkeleton Component
 * 
 * Displays a skeleton loading state for a channel dashboard while content is loading
 * Uses DaisyUI theming system for consistent styling
 * Animated with Framer Motion for better UX
 * 
 * @returns {JSX.Element} The loading skeleton component
 */
const LoadingSkeleton = () => {
  // Animation variants for staggered children animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Stats data with icons
  const skeletonStats = [
    { icon: <TrendingUp className="text-primary/80" />, name: "Views" },
    { icon: <Users className="text-secondary/80" />, name: "Subscribers" },
    { icon: <Video className="text-accent/80" />, name: "Videos" },
    { icon: <Award className="text-info/80" />, name: "Engagement" }
  ];

  // Video metadata icons for skeleton
  const videoMetadataIcons = [
    <Eye size={16} className="text-base-content/60" />,
    <Clock size={16} className="text-base-content/60" />, 
    <ThumbsUp size={16} className="text-base-content/60" />,
    <BarChart3 size={16} className="text-base-content/60" />
  ];

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-6">
      {/* Top Header Skeleton */}
      <motion.div
        className="bg-gradient-to-br from-primary/30 to-base-300 shadow-xl rounded-xl mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Profile Image Skeleton */}
            <div className="w-24 h-24 md:w-36 md:h-36 rounded-full border-4 border-accent/50 bg-base-200 animate-pulse mx-auto md:mx-0" />
            
            <div className="space-y-3 flex-1">
              {/* Channel Name Skeleton */}
              <div className="h-8 bg-base-200 rounded-lg animate-pulse w-3/4 max-w-md" />
              
              {/* Description Skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-base-200 rounded animate-pulse w-full" />
                <div className="h-4 bg-base-200 rounded animate-pulse w-1/2" />
              </div>
              
              {/* Subscribers Skeleton */}
              <div className="h-5 bg-base-200 rounded animate-pulse w-1/3 max-w-xs" />
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Main Content Skeleton */}
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Channel Statistics Heading Skeleton */}
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <BarChart3 className="text-primary w-5 h-5" />
          <div className="h-8 bg-base-200 rounded-lg animate-pulse w-48" />
        </motion.div>
        
        {/* Stats Grid Skeleton */}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {skeletonStats.map((stat, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="bg-base-100 rounded-xl shadow-md border border-base-200 p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                {/* Stat Title Skeleton */}
                <div className="h-5 bg-base-200 rounded-lg animate-pulse w-1/2" />
                {/* Stat Icon */}
                <div className="h-10 w-10 rounded-full bg-base-200/50 flex items-center justify-center animate-pulse">
                  {stat.icon}
                </div>
              </div>
              <div className="space-y-3">
                {/* Stat Value Skeleton */}
                <div className="h-8 bg-base-200 rounded-lg animate-pulse w-3/4" />
                {/* Stat Change Skeleton */}
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-base-200 rounded-full animate-pulse" />
                  <div className="h-4 bg-base-200 rounded animate-pulse w-24" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Video Section Skeleton */}
        <motion.div variants={itemVariants} className="space-y-4">
          {/* Section Header */}
          <div className="flex items-center gap-2">
            <Video className="text-primary w-5 h-5" />
            <div className="h-7 bg-base-200 rounded-lg animate-pulse w-36" />
          </div>
          
          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="bg-base-100 rounded-xl overflow-hidden shadow-md border border-base-200 hover:shadow-lg transition-shadow"
              >
                {/* Video Thumbnail Skeleton with play button overlay */}
                <div className="relative aspect-video bg-base-200 animate-pulse">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-base-300/50 flex items-center justify-center">
                      <div className="w-4 h-4 border-t-2 border-r-2 border-base-content/30 rounded-full animate-spin" />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  {/* Video Title Skeleton */}
                  <div className="h-6 bg-base-200 rounded-lg animate-pulse" />
                  
                  <div className="space-y-2">
                    {/* Video Description Skeleton */}
                    <div className="h-4 bg-base-200 rounded animate-pulse" />
                    <div className="h-4 bg-base-200 rounded animate-pulse w-2/3" />
                  </div>
                  
                  {/* Video Metadata Skeleton */}
                  <div className="grid grid-cols-2 gap-3">
                    {[0, 1, 2, 3].map((j) => (
                      <div key={j} className="flex items-center gap-2">
                        {videoMetadataIcons[j]}
                        <div className="h-4 bg-base-200 rounded animate-pulse flex-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingSkeleton;