import React, { useState, useEffect } from "react";
import { BarChart3, Users, Video, Eye } from "lucide-react";
import { useChannel } from "../../../hooks/useChannel";
import Loader from "../../Loader";
import { motion } from "framer-motion";
import MyVideo from "../MyVideo";
import notFound from "../../../assets/not found.svg";
import { useAuth } from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import LoadingSkeleton from "../LoadingSkeleton";
import AddVideoButton from "../AddVideo";

// Card Component with Animation
export const Card = ({ children, className = "" }) => (
  <motion.div
    className={`bg-gradient-to-br from-base-100 to-base-300 p-6 rounded-lg shadow ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

const DashboardLayout = () => {
  const {
    channelData,
    isLoadingChannel,
    channelError,
    getChannel,
    isFetchingChannel,
  } = useChannel();

  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Effect to ensure channel data is loaded when component mounts
  useEffect(() => {
    if (user?.channel?._id && !channelData && !isLoadingChannel) {
      getChannel(); // Updated to call getChannel when conditions are met
    }
  }, [user?.channel?._id, channelData, isLoadingChannel, getChannel]);

  const stats = [
    {
      title: "Total Views",
      value: channelData?.statistics?.totalViews || "0",
      icon: <Eye className="w-6 h-6 text-blue-500" />,
      change: "+12%",
    },
    {
      title: "Subscribers",
      value: channelData?.statistics?.totalSubscribers || "0",
      icon: <Users className="w-6 h-6 text-green-500" />,
      change: "+4.3%",
    },
    {
      title: "Videos",
      value: channelData?.statistics?.totalVideos || "0",
      icon: <Video className="w-6 h-6 text-purple-500" />,
      change: "+2",
    },
    {
      title: "Avg. Watch Time",
      value: "12m 30s",
      icon: <BarChart3 className="w-6 h-6 text-orange-500" />,
      change: "+1m 12s",
    },
  ];

  if (isLoadingChannel || isFetchingChannel) {
    return <LoadingSkeleton />;
  }

  if (channelError || (!channelData && !isLoadingChannel)) {
    const errorMessage =
      channelError?.message ||
      channelError?.toString() ||
      "An error occurred while loading channel data";
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center relative">
        {/* SVG or Image */}
        <div className="absolute inset-0 z-1 flex items-center justify-center">
          <img
            src={notFound}
            alt="notFound"
            className="w-full h-full object-cover opacity-50"
          />
        </div>

        {/* Error Content */}
        <div className="relative z-20 text-center bg-base-200 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-500">{`${user.fullName}'s channel Not Found`}</h2>
          <p className="text-gray-600 mt-2">{errorMessage}</p>
          <Link to="/dashboard/create">
            <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
              Create Channel
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!user?.channel) {
    return null;
  }

  console.log("data ", channelData);
  

  return (
    <div className="min-h-screen bg-base-100 p-6">
      {/* Top Header with Animation */}
      <motion.div
        className="bg-gradient-to-tr from-base-200 via-base-300 to-secondary/50 shadow-xl rounded-xl mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <img
              src={
                channelData?.owner?.photo === "default.webp"
                  ? "http://localhost:4000/public/img/users/default.webp"
                  : `http://localhost:4000/public/img/users/${channelData?.owner?.photo}`
              }
              alt={channelData?.owner?.fullName}
              className="w-36 h-36 rounded-full border-4 border-accent object-cover shadow-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-secondary">
                {channelData?.name || "NA"}
              </h1>
              <p className="text-base-content">
                {channelData?.description || "NA"}
              </p>
              <p className="text-sm text-base-content/75">
                {channelData?.statistics?.totalSubscribers || "0"} subscribers
              </p>
            </div>
          </div>
        </div>
        <div className="w-full justify-end  flex">
          {/* Add Video Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className=" btn flex items-center gap-2 px-4 py-2 bg-gradient-to-tr from-base-300  to-secondary text-base-content rounded-lg hover:bg-primary-dark"
          >
            <Video className="w-5 h-5" />
            Upload Video
          </button>

          {/* Video Upload Modal */}
          <AddVideoButton
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-accent">Channel Statistics</h2>

        {/* Stats Grid with Animation */}
        <motion.div
          className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {stats.map((stat) => (
            <Card key={stat.title}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-secondary">
                  {stat.title}
                </span>
                {stat.icon}
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-sm text-accent">
                  <span className="text-green-500 font-medium">
                    {stat.change}
                  </span>
                  <span className="ml-1 text-base-content/80">from last month</span>
                </p>
              </div>
            </Card>
          ))}
        </motion.div>
       

        <div>
          <MyVideo myVideos={channelData?.videos || []} />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
