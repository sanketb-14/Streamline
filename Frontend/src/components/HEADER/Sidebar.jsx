import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AiFillHome,
  AiOutlineHistory,
  AiOutlineLike,
  AiOutlinePlaySquare,
  AiOutlineClockCircle,
  AiOutlineDown,
  AiOutlineUp
} from 'react-icons/ai';
import { 
  MdOutlineVideoLibrary, 
  MdOutlineWatchLater, 
  MdExplore,
  MdSubscriptions
} from 'react-icons/md';
import { BsPlayBtn, BsCollection } from 'react-icons/bs';
import { FaGraduationCap, FaShoppingBag } from 'react-icons/fa';
import { IoTrendingUpSharp } from 'react-icons/io5';

/**
 * Sidebar component that displays navigation menu with collapsible sections
 * Includes main menu, user menu, subscriptions, and explore sections
 * 
 * @returns {JSX.Element} The sidebar navigation component
 */
const Sidebar = () => {
  const [showMore, setShowMore] = useState(false);
  
  // Example subscriptions - replace with actual data
  const defaultPic = "https://www.clipartkey.com/mpngs/m/152-1520367_user-profile-default-image-png-clipart-png-download.png";
  const subscriptions = [
    { id: 1, name: 'Sony', image: defaultPic },
    { id: 2, name: 'MortaL', image: defaultPic },
    { id: 3, name: 'Nat-geo', image: defaultPic },
    { id: 4, name: 'T-series', image: defaultPic },
    { id: 5, name: 'History-Tv', image: defaultPic },
    { id: 6, name: 'Cricbuzz', image: defaultPic },
    { id: 7, name: 'Hindustan Times', image: defaultPic }
  ];

  // Menu configuration
  const mainMenuItems = [
    { icon: <AiFillHome className="text-xl" />, label: 'Home', link: '/' },
    { icon: <BsPlayBtn className="text-xl" />, label: 'Shorts', link: '/' },
    { icon: <MdSubscriptions className="text-xl" />, label: 'Subscriptions', link: '/dashboard' }
  ];

  const userMenuItems = [
    { icon: <AiOutlinePlaySquare className="text-xl" />, label: 'Your videos', link: '/dashboard' },
    { icon: <AiOutlineHistory className="text-xl" />, label: 'History', link: '/dashboard' },
    { icon: <BsCollection className="text-xl" />, label: 'Playlists', link: '/dashboard' },
    { icon: <MdOutlineWatchLater className="text-xl" />, label: 'Watch later', link: '/dashboard' },
    { icon: <AiOutlineLike className="text-xl" />, label: 'Liked videos', link: '/dashboard' },
    { icon: <FaGraduationCap className="text-xl" />, label: 'Your courses', link: '/dashboard' }
  ];

  const exploreItems = [
    { icon: <IoTrendingUpSharp className="text-xl" />, label: 'Trending', link: '/dashboard' },
    { icon: <FaShoppingBag className="text-xl" />, label: 'Shopping', link: '/dashboard' },
    { icon: <MdExplore className="text-xl" />, label: 'Explore', link: '/dashboard' }
  ];

  /**
   * Renders a menu item with animation
   * 
   * @param {Object} item - Menu item object
   * @param {number} index - Item index
   * @returns {JSX.Element} Menu item component
   */
  const renderMenuItem = (item, index) => (
    <Link key={index} to={item.link}>
      <motion.div
        className="flex items-center gap-4 p-3 rounded-lg hover:bg-base-200/80 transition-colors"
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-base-content/90">{item.icon}</span>
        <span className="text-sm font-medium text-base-content">{item.label}</span>
      </motion.div>
    </Link>
  );

  /**
   * Renders a subscription item
   * 
   * @param {Object} sub - Subscription object
   * @returns {JSX.Element} Subscription item component
   */
  const renderSubscriptionItem = (sub) => (
    <motion.div
      key={sub.id}
      className="flex items-center gap-4 p-3 rounded-lg hover:bg-base-200/80 transition-colors"
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <img 
        src={sub.image} 
        alt={sub.name} 
        className="w-6 h-6 rounded-full object-cover border border-base-300" 
      />
      <span className="text-sm font-medium text-base-content">{sub.name}</span>
    </motion.div>
  );

  return (
    <div className="w-60 h-[calc(100vh-3.5rem)] mt-14 fixed left-0 overflow-y-auto bg-base-100 border-r border-base-300/50 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-100">
      <div className="p-2 space-y-1">
        {/* Main Menu */}
        <div className="space-y-1">
          {mainMenuItems.map(renderMenuItem)}
        </div>

        <div className="border-t border-base-300/50 my-2" />

        {/* User Menu */}
        <div className="space-y-1">
          <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-base-content/70">
            You
          </h3>
          {userMenuItems.map(renderMenuItem)}
        </div>

        <div className="border-t border-base-300/50 my-2" />

        {/* Subscriptions */}
        <div className="space-y-1">
          <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-base-content/70">
            Subscriptions
          </h3>
          {subscriptions.slice(0, showMore ? undefined : 5).map(renderSubscriptionItem)}
          
          <motion.button
            className="flex items-center gap-4 p-3 w-full rounded-lg hover:bg-base-200/80 transition-colors"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? (
              <AiOutlineUp className="text-base-content/70" />
            ) : (
              <AiOutlineDown className="text-base-content/70" />
            )}
            <span className="text-sm font-medium text-base-content/80">
              {showMore ? 'Show less' : 'Show more'}
            </span>
          </motion.button>
        </div>

        <div className="border-t border-base-300/50 my-2" />

        {/* Explore */}
        <div className="space-y-1">
          <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-base-content/70">
            Explore
          </h3>
          {exploreItems.map(renderMenuItem)}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;