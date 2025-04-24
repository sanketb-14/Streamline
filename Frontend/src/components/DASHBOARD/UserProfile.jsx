"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Share2, ExternalLink, Users, Video, Eye, ThumbsUp } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useChannel } from "../../hooks/useChannel";
import EditProfileModal from "./pages/EditProfileModal";

/**
 * UserProfile Component
 * 
 * Displays a user's profile with animations and interactive elements
 * Shows user information, statistics, and social sharing options
 * Uses Framer Motion for animations and DaisyUI for styling
 * 
 * @returns {JSX.Element} The user profile component
 */
export default function UserProfile() {
  const { user } = useAuth();
  const { channelData } = useChannel();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Animation variants for container elements
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for child elements
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Social media platforms with their icons and colors
  const socialPlatforms = [
    { icon: FaFacebook, color: "text-blue-600 hover:text-blue-700", label: "Facebook" },
    { icon: FaTwitter, color: "text-sky-500 hover:text-sky-600", label: "Twitter" },
    { icon: FaLinkedin, color: "text-blue-700 hover:text-blue-800", label: "LinkedIn" },
  ];

  // User statistics with icons
  const userStats = [
    {
      label: "Total Videos",
      value: channelData?.statistics?.totalVideos || 0,
      icon: <Video className="w-5 h-5 text-primary" />,
    },
    {
      label: "Subscribers",
      value: channelData?.statistics?.totalSubscribers || 0,
      icon: <Users className="w-5 h-5 text-secondary" />,
    },
    {
      label: "Total Views",
      value: channelData?.statistics?.totalViews || 0,
      icon: <Eye className="w-5 h-5 text-accent" />,
    },
    {
      label: "Likes",
      value: "12.5k",
      icon: <ThumbsUp className="w-5 h-5 text-info" />,
    },
  ];

  // Get the profile image URL
  const profileImageUrl = user.photo === "default.webp"
    ? "https://www.clipartkey.com/mpngs/m/152-1520367_user-profile-default-image-png-clipart-png-download.png"
    : user.photo;

  return (
    <>
      <motion.div
        className="w-full max-w-5xl mx-auto bg-base-200 rounded-xl shadow-xl overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3 }}
      >
        {/* Banner Section */}
        <motion.div
          className="relative h-36 sm:h-48 md:h-72 bg-gradient-to-tr from-base-300 via-secondary/75 to-base-100 overflow-hidden"
          initial={{ height: 0 }}
          animate={{ height: ["0rem", "18rem"] }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-base-content/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          />
        </motion.div>

        {/* Profile Section */}
        <div className="relative px-4 sm:px-6 pb-6">
          {/* Profile Picture */}
          <motion.div
            className="absolute -top-12 sm:-top-16 left-4 sm:left-8"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full border-4 border-accent shadow-lg overflow-hidden">
              <img
                src={profileImageUrl}
                alt={user.fullName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* User Info */}
          <div className="pt-16 sm:pt-20 md:pt-24 pb-4">
            <div className="flex items-start justify-between flex-wrap gap-4">
              {/* User Details */}
              <motion.div variants={itemVariants} className="space-y-2">
                <motion.h1
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-base-content"
                  whileHover={{ scale: 1.02 }}
                >
                  {user.fullName}
                </motion.h1>
                <motion.div
                  className="flex items-center gap-2 text-base-content/70"
                  whileHover={{ x: 10 }}
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </motion.div>
              </motion.div>

              {/* Share Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3"
              >
                {socialPlatforms.map((social, index) => (
                  <motion.button
                    key={index}
                    className={`btn btn-ghost btn-circle btn-sm ${social.color}`}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    aria-label={`Share on ${social.label}`}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.button>
                ))}
                <motion.button
                  className="btn btn-ghost btn-circle btn-sm"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Share profile"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
              </motion.div>
            </div>

            {/* Stats Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-2 gap-3 md:gap-4 mt-6 md:mt-8"
            >
              {userStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-base-300/80 hover:bg-base-300 rounded-xl p-3 md:p-4 text-center flex flex-col items-center justify-center"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {stat.icon}
                  <motion.div
                    className="text-lg sm:text-xl md:text-2xl font-bold mt-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <motion.div
                    className="text-xs sm:text-sm text-base-content/60 mt-1"
                    whileHover={{ scale: 1.1 }}
                  >
                    {stat.label}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <EditProfileModal
            onClose={() => setIsEditModalOpen(false)}
            user={user}
          />
        )}
      </AnimatePresence>
    </>
  );
}