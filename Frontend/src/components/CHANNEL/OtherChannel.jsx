import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Video, Bell, Share2 } from "lucide-react";
import LoadingSkeleton from "./LoadingChannelSkeleton";
import VideoCard from "./VideoCard";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useChannel } from "../../hooks/useChannel";
import { useSubscribers } from "../../hooks/useSubscribers";

/**
 * OtherChannelPage - Displays a channel profile with videos and subscription functionality
 * 
 * Features:
 * - Responsive layout with DaisyUI theming
 * - Animated transitions with Framer Motion
 * - Subscription management
 * - Video grid with loading states
 * - Proper error handling
 * - Accessibility considerations
 */
const OtherChannelPage = () => {
  const { channelId } = useParams();
  const { user } = useAuth();

  // Channel data hooks
  const { channelData, isLoadingChannel, isOwnChannel } = useChannel(channelId);
  const {
    isSubscribed,
    subscribeToChannel,
    isSubscribing,
    unsubscribeFromChannel,
    isUnsubscribing,
  } = useSubscribers(channelId);

  // Handle subscription toggle
  const handleSubscribeClick = async () => {
    try {
      if (isSubscribed) {
        await unsubscribeFromChannel();
        toast.success("Unsubscribed successfully");
      } else {
        await subscribeToChannel();
        toast.success("Subscribed successfully");
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(error.message || "Failed to update subscription");
    }
  };

  // Loading state
  if (isLoadingChannel) return <LoadingSkeleton />;

  const { name, description, owner, statistics, videos } = channelData;

  // Subscription button classes
  const subscribeBtnClasses = `btn gap-2 rounded-full ${
    isSubscribed
      ? "btn-neutral hover:bg-base-300"
      : "btn-error hover:bg-error/90"
  } ${(isSubscribing || isUnsubscribing) && "loading"}`;

  // Navigation tabs
  const TABS = [
    { name: 'HOME', icon: null },
    { name: 'VIDEOS', icon: <Video className="w-4 h-4" /> },
    { name: 'PLAYLISTS', icon: null },
    { name: 'COMMUNITY', icon: <Users className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Channel Banner Section */}
      <section className="relative">
        <div className="w-full h-32 md:h-48 lg:h-64 bg-gradient-to-br from-primary/80 to-secondary/80" />
        
        {/* Channel Info Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 -mt-16 lg:-mt-20 pb-6 relative z-10">
            {/* Profile Picture */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-primary bg-base-200 shadow-lg"
            >
              <img
                src={owner.photo === "default.webp" 
                  ? "/default-avatar.webp" 
                  : owner.photo}
                alt={owner.fullName}
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
              />
            </motion.div>

            {/* Channel Details */}
            <div className="flex-1 lg:pt-8 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-2xl lg:text-3xl font-bold text-base-content">{name}</h1>
                  <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 text-sm text-base-content/80">
                    <span>{owner.fullName}</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {statistics.totalSubscribers.toLocaleString()} subscribers
                      </span>
                      <span className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        {statistics.totalVideos.toLocaleString()} videos
                      </span>
                    </div>
                  </div>
                  {description && (
                    <p className="text-sm text-base-content/70 max-w-2xl line-clamp-2">
                      {description}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {!isOwnChannel && (
                    <motion.button
                      onClick={handleSubscribeClick}
                      disabled={isSubscribing || isUnsubscribing}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={subscribeBtnClasses}
                      aria-label={isSubscribed ? "Unsubscribe" : "Subscribe"}
                    >
                      {!(isSubscribing || isUnsubscribing) && <Bell className="w-5 h-5" />}
                      {isSubscribed ? "Subscribed" : "Subscribe"}
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-ghost btn-circle"
                    aria-label="Share channel"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="border-b border-base-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button 
                key={tab.name}
                className={`flex items-center gap-2 py-4 px-4 text-sm font-medium whitespace-nowrap ${
                  tab.name === 'HOME' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-base-content/80 hover:text-primary'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Videos Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Video className="w-5 h-5" />
          Videos
        </h2>
        
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video, index) => (
              <motion.div
                key={`video-${video._id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <VideoCard video={video} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-base-200 rounded-lg"
          >
            <Video className="w-16 h-16 mx-auto text-base-content/50 mb-4" />
            <h3 className="text-xl font-semibold text-base-content">
              No Videos Uploaded Yet
            </h3>
            <p className="text-base-content/70 mt-2">
              This channel hasn't shared any videos
            </p>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default OtherChannelPage;