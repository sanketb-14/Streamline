import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Share2, ExternalLink } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useChannel } from "../../hooks/useChannel";
import EditProfileModal from "./pages/EditProfileModal";

export default function UserProfile() {
  const { user } = useAuth();
  const { channelData } = useChannel();

  const [isHovered, setIsHovered] = useState(false);

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="hidden md:block w-full max-w-5xl min-h-screen mx-auto bg-base-200 rounded-xl shadow-xl overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      {/* Banner Section */}
      <motion.div
        className="relative h-72 bg-gradient-to-r from-primary via-secondary to-accent overflow-hidden"
        initial={{ height: 0 }}
        animate={{ height: "18rem" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0 bg-opacity-30 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        />
      </motion.div>

      {/* Profile Section */}
      <div className="relative px-6 pb-6">
        {/* Profile Picture */}
       
        <motion.div
          className="absolute -top-16 left-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <motion.div
            className="relative rounded-full overflow-hidden"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1 }}
          >
            <img
              src={
                user.photo === "default.webp"
                  ? "http://localhost:4000/public/img/users/default.webp"
                  : `http://localhost:4000/public/img/users/${user.photo}`
              }
              alt={user.fullName}
              className="w-36 h-36 rounded-full border-4 border-accent object-cover shadow-lg"
            />
          </motion.div>
        </motion.div>

        {/* User Info */}
        <div className="pt-24 pb-4">
          <div className="flex items-start justify-between flex-wrap gap-4">
          
            
            <motion.div variants={itemVariants} className="space-y-2">
              <motion.h1
                className="text-3xl font-bold text-accent"
                whileHover={{ scale: 1.02 }}
              >
                {user.fullName}
              </motion.h1>
              <motion.div
                className="flex items-center gap-2 text-gray-400"
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
              {[
                { icon: FaFacebook, color: "blue" },
                { icon: FaTwitter, color: "sky" },
                { icon: FaLinkedin, color: "blue" },
              ].map((social, index) => (
                <motion.button
                  key={index}
                  className={`p-2 rounded-full text-${social.color}-600 hover:text-${social.color}-700`}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.button>
              ))}
              <motion.button
                className="ml-2 p-2 rounded-full hover:bg-base-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2  gap-4 mt-8"
          >
            {[
              {
                label: "Total Video's",
                value: channelData?.statistics?.totalVideos || 0,
              },
              {
                label: "Total Subscribers",
                value: channelData?.statistics?.totalSubscribers || 0,
              },
              {
                label: "Total views",
                value: channelData?.statistics?.totalViews || 0,
              },
              { label: "Likes", value: "12.5k" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-base-300 rounded-xl p-2 text-center"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className="text-2xl font-bold text-accent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {stat.value}
                </motion.div>
                <motion.div
                  className="text-sm text-secondary mt-2"
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Channel Info */}
        </div>
      </div>
    </motion.div>
  );
}
