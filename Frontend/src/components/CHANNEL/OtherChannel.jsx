import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useChannel } from "../../hooks/useChannel";
import { Users, Video, Eye, Bell, Share2, ThumbsUp } from "lucide-react";
import LoadingSkeleton from "./LoadingChannelSkeleton";
import VideoCard from "./VideoCard";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useSubscribers } from "../../hooks/useSubscribers";


const OtherChannelPage = () => {
  const { channelId } = useParams();
  const {user} = useAuth()

  const {
    channelData,
    isLoadingChannel,
    isOwnChannel,
  } = useChannel(channelId);

  const {
    isSubscribed,
    subscribeToChannel,
    isSubscribing,
    unsubscribeFromChannel,
    isUnsubscribing,
  } = useSubscribers(channelId);

  if (isLoadingChannel) return <LoadingSkeleton />;

  const {
    name,
    description,
    owner,
    statistics,
    videos,
    
  } = channelData;

  
 
  
  const handleSubscribeClick = async () => {
    try {
      if (isSubscribed) {
        await unsubscribeFromChannel();
      } else {
        await subscribeToChannel();
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(error.message || "Failed to update subscription");
    }
  };




  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Channel Banner */}
      <div className="relative">
        <div className="w-full h-32 md:h-56 lg:h-80 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-accent/50 to-primary/50" />
        </div>

        {/* Channel Info Overlay */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 -mt-16 lg:-mt-20 pb-4 relative z-10">
            {/* Profile Picture */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-black bg-gray-800"
            >
              <img
                src={
                  owner.photo === "default.webp"
                    ? "http://localhost:4000/public/img/users/default.webp"
                    : `http://localhost:4000/public/img/users/${owner.photo}`
                }
                alt={owner.fullName}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Channel Details */}
            <div className="flex-1 lg:pt-16">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold">{name}</h1>
                  <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 text-gray-400 mt-1">
                    <span className="text-sm">{owner.fullName}</span>
                    <div className="flex items-center gap-6 text-sm">
                      <span>{statistics.totalSubscribers} subscribers</span>
                      <span>{statistics.totalVideos} videos</span>
                    </div>
                  </div>
                  {description && (
                    <p className="mt-2 text-sm text-gray-400 max-w-2xl">
                      {description}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {!isOwnChannel && (
                    <motion.button
                      onClick={handleSubscribeClick}
                      disabled={isSubscribing || isUnsubscribing}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-8 py-2.5 font-medium rounded-full flex items-center gap-2 transition-colors
                        ${
                          isSubscribed
                            ? "bg-gray-800 hover:bg-gray-700 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }
                        ${
                          (isSubscribing || isUnsubscribing) &&
                          "opacity-50 cursor-not-allowed"
                        }
                      `}
                    >
                      <Bell className="w-5 h-5" />
                      {isSubscribed ? "Subscribed" : "Subscribe"}
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-2.5 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="border-b border-base-300 mb-6">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-8">
            <button className="py-4 px-3 text-sm font-medium border-b-2 border-base-content">
              HOME
            </button>
            <button className="py-4 px-3 text-sm font-medium text-base-content hover:text-accent">
              VIDEOS
            </button>
            <button className="py-4 px-3 text-sm font-medium text-base-content hover:text-accent">
              PLAYLISTS
            </button>
            <button className="py-4 px-3 text-sm font-medium text-base-content hover:text-accent">
              COMMUNITY
            </button>
          </nav>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-bold mb-6">Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video, index) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <VideoCard video={video} />
            </motion.div>
          ))}
        </div>

        {videos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-base-200 rounded-lg"
          >
            <Video className="w-16 h-16 mx-auto text-base-content mb-4" />
            <h3 className="text-2xl text-accent font-semibold">
              No Videos Yet
            </h3>
            <p className="text-base-content mt-2">
              This channel hasn't uploaded any videos.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OtherChannelPage;
