/**
 * DashboardHome Component
 * 
 * A comprehensive dashboard displaying channel statistics and videos
 * with optimized performance and responsive design using DaisyUI theming.
 */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { BarChart3, Users, Video, Eye, Award, TrendingUp } from "lucide-react";
import { useChannel } from "../../../hooks/useChannel";
import { motion } from "framer-motion";
import MyVideo from "../MyVideo";
import notFoundImage from "../../../assets/not found.svg";
import { useAuth } from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import LoadingSkeleton from "../LoadingSkeleton";
import AddVideoButton from "../AddVideo";
import {Card} from "../Card"

// Animation variants for consistent effects
const animationVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 15 }
    }
  }
};



/**
 * DashboardHome - Main dashboard component for channel creators
 * Displays channel statistics, recent performance, and uploaded videos
 */
const DashboardHome = () => {
  const {
    channelData,
    isLoadingChannel,
    channelError,
    getChannel,
    isFetchingChannel,
  } = useChannel();

  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch channel data if not already loaded
  useEffect(() => {
    if (user?.channel?._id && !channelData && !isLoadingChannel) {
      getChannel();
    }
  }, [user?.channel?._id, channelData, isLoadingChannel, getChannel]);

  // Toggle modal handler with useCallback for optimization
  const toggleModal = useCallback(() => {
    setIsModalOpen(prev => !prev);
  }, []);

  // Memoized statistics data to prevent unnecessary re-renders
  const stats = useMemo(() => [
    {
      title: "Total Views",
      value: channelData?.statistics?.totalViews?.toLocaleString() || "0",
      icon: <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-info" />,
      change: "+12%",
      color: "text-info"
    },
    {
      title: "Subscribers",
      value: channelData?.statistics?.totalSubscribers?.toLocaleString() || "0",
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-success" />,
      change: "+4.3%",
      color: "text-success"
    },
    {
      title: "Videos",
      value: channelData?.statistics?.totalVideos?.toLocaleString() || "0",
      icon: <Video className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />,
      change: "+2",
      color: "text-secondary"
    },
    {
      title: "Avg. Watch Time",
      value: "12m 30s",
      icon: <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />,
      change: "+1m 12s",
      color: "text-accent"
    },
    {
      title: "Engagement Rate",
      value: "8.7%",
      icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />,
      change: "+0.5%",
      color: "text-primary"
    },
    {
      title: "Top Performance",
      value: "4.8/5",
      icon: <Award className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />,
      change: "+0.2",
      color: "text-warning"
    },
  ], [channelData?.statistics]);

  // Render loading state
  if (isLoadingChannel || isFetchingChannel) {
    return <LoadingSkeleton />;
  }

  // Render error state or channel not found
  if (channelError || (!channelData && !isLoadingChannel)) {
    const errorMessage = channelError?.message || "An error occurred while loading channel data";
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <img
            src={notFoundImage}
            alt="Channel not found"
            className="w-full h-full object-cover opacity-20 md:opacity-40"
            loading="lazy"
          />
        </div>
        <div className="relative z-10 text-center bg-base-200/90 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-lg max-w-md mx-4">
          <h2 className="text-xl md:text-2xl font-bold text-error">
            {`${user?.fullName}'s Channel Not Found`}
          </h2>
          <p className="text-base-content/80 mt-2 text-sm md:text-base">{errorMessage}</p>
          <Link to="/dashboard/create">
            <button className="mt-4 px-6 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary-focus transition-all">
              Create Channel
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Return null if user has no channel
  if (!user?.channel) {
    return null;
  }

  // Default profile image if none is provided
  const profileImage = channelData?.owner?.photo === "default.webp" 
    ? "https://www.clipartkey.com/mpngs/m/152-1520367_user-profile-default-image-png-clipart-png-download.png" 
    : channelData?.owner?.photo;

  return (
    <div className="min-h-screen bg-base-100 p-4 sm:p-6">
      {/* Channel Header Card */}
      <motion.div
        className="bg-gradient-to-tr from-base-200 via-base-300 to-accent/75 shadow-lg rounded-xl mb-6 md:mb-8 overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* Profile Image */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <img
                src={profileImage}
                alt={channelData?.owner?.fullName || "Channel owner"}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-accent object-cover shadow-lg"
                loading="lazy"
              />
              <div className="absolute bottom-0 right-0 bg-success rounded-full w-5 h-5 border-2 border-base-100"></div>
            </motion.div>
            
            {/* Channel Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-secondary">
                {channelData?.name || "NA"}
              </h1>
              <p className="text-sm sm:text-base text-base-content/90 mt-1 line-clamp-2">
                {channelData?.description || "No description available"}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                <p className="text-xs sm:text-sm flex items-center gap-1">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-info" />
                  <span className="font-medium">{channelData?.statistics?.totalSubscribers?.toLocaleString() || "0"}</span> subscribers
                </p>
                <p className="text-xs sm:text-sm flex items-center gap-1">
                  <Video className="w-3 h-3 sm:w-4 sm:h-4 text-secondary" />
                  <span className="font-medium">{channelData?.statistics?.totalVideos?.toLocaleString() || "0"}</span> videos
                </p>
              </div>
            </div>
            
            {/* Upload Button */}
            <div className="w-full sm:w-auto flex justify-center sm:justify-end">
              <motion.button
                onClick={toggleModal}
                className="btn btn-primary flex items-center gap-2 px-4 py-2 rounded-lg"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Video className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Upload Video</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6 md:space-y-8">
        {/* Statistics Section */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-accent mb-4 md:mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
            Channel Statistics
          </h2>
          
          <motion.div 
            className="grid gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
            variants={animationVariants.container}
            initial="hidden"
            animate="visible"
          >
            {stats.map((stat) => (
              <Card key={stat.title}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-base-content/80">
                    {stat.title}
                  </span>
                  {stat.icon}
                </div>
                <div className="space-y-1">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold">
                    {stat.value}
                  </div>
                  <p className="text-xs sm:text-sm flex items-center">
                    <span className={`${stat.color} font-medium`}>
                      {stat.change}
                    </span>
                    <span className="ml-1 text-base-content/70">from last month</span>
                  </p>
                </div>
              </Card>
            ))}
          </motion.div>
        </section>

        {/* Videos Section */}
        <section>
          <MyVideo myVideos={channelData?.videos || []} />
        </section>
      </div>

      {/* Upload Video Modal */}
      <AddVideoButton
        isOpen={isModalOpen}
        onClose={toggleModal}
      />
    </div>
  );
};

export default React.memo(DashboardHome);