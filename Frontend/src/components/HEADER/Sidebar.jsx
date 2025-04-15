import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AiFillHome,
  AiOutlineHistory,
  AiOutlineLike,
  AiOutlinePlaySquare,
  AiOutlineClockCircle
} from 'react-icons/ai';
import { MdOutlineVideoLibrary, MdOutlineWatchLater, MdExplore } from 'react-icons/md';
import { BsPlayBtn, BsCollection } from 'react-icons/bs';
import { FaGraduationCap, FaShoppingBag } from 'react-icons/fa';
import { IoTrendingUpSharp } from 'react-icons/io5';

const Sidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMore, setShowMore] = useState(false);
  
  // Example subscriptions - replace with actual data
  const defaultPic = "http://localhost:4000/public/img/users/default.webp"
  const subscriptions = [
    { id: 1, name: 'Sony', image: defaultPic },
    { id: 2, name: 'MortaL', image:defaultPic  },
    { id: 3, name: 'Nat-geo', image: defaultPic },
    { id: 4, name: 'T-series', image: defaultPic },
    { id: 5, name: 'History-Tv', image: defaultPic },
    { id: 6, name: 'Cricbuzz', image: defaultPic },
    { id: 7, name: 'Hindustan Times', image: defaultPic }
  ];

  const mainMenuItems = [
    { icon: <AiFillHome className="text-xl" />, label: 'Home', link: '/' },
    { icon: <BsPlayBtn className="text-xl" />, label: 'Shorts', link: '/' },
    { icon: <MdOutlineVideoLibrary className="text-xl" />, label: 'Subscriptions', link: '/dashboard' }
  ];

 



  const userMenuItems = [
    { icon: <AiOutlinePlaySquare className="text-xl" />, label: 'Your videos', link: '/dashboard' },
    { icon: <AiOutlineHistory className="text-xl" />, label: 'History', link: '/dashboard' },
    { icon: <BsCollection className="text-xl" />, label: 'Playlists', link: '/dashboard'},
    { icon: <MdOutlineWatchLater className="text-xl" />, label: 'Watch later', link: '/dashboard' },
    { icon: <AiOutlineLike className="text-xl" />, label: 'Liked videos', link: 'dashboard' },
    { icon: <FaGraduationCap className="text-xl" />, label: 'Your courses', link: '/dashboard' }
  ];

  const exploreItems = [
    { icon: <IoTrendingUpSharp className="text-xl" />, label: 'Trending', link: '/dashboard' },
    { icon: <FaShoppingBag className="text-xl" />, label: 'Shopping', link: '/dashboard' },
    { icon: <MdExplore className="text-xl" />, label: 'Explore', link: '/dashboard' }
  ];

 
  return (
    <div className="w-60 h-[calc(100vh-3.5rem)] mt-14 fixed left-0 overflow-y-auto bg-base-100 scrollbar-thin scrollbar-thumb-base-300">
      <div className="p-2">
        {/* Main Menu */}
        
        <div className="mb-2">
          {mainMenuItems.map((item, index) => (
            <Link key={index} to={item.link}>
              <motion.div
                className="flex items-center gap-6 p-2 rounded-lg hover:bg-base-200 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="border-t border-base-300 my-2" />

        {/* User Menu */}
        <div className="mb-2">
          <h3 className="px-3 py-1 text-sm font-semibold">You</h3>
          {userMenuItems.map((item, index) => (
            <Link key={index} to={item.link}>
              <motion.div
                className="flex items-center gap-6 p-2 rounded-lg hover:bg-base-200 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="border-t border-base-300 my-2" />

        {/* Subscriptions */}
        <div className="mb-2">
          <h3 className="px-3 py-1 text-sm font-semibold">Subscriptions</h3>
          {subscriptions.slice(0, showMore ? undefined : 5).map((sub) => (
            <motion.div
              key={sub.id}
              className="flex items-center gap-6 p-2 rounded-lg hover:bg-base-200 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              
            >
              <img src={sub.image} alt={sub.name} className="w-6 h-6 rounded-full" />
              <span className="text-sm">{sub.name}</span>
            </motion.div>
          ))}
          <motion.button
            className="flex items-center gap-6 p-2 w-full rounded-lg hover:bg-base-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowMore(!showMore)}
          >
            <span className="text-sm">{showMore ? 'Show less' : 'Show more'}</span>
          </motion.button>
        </div>

        <div className="border-t border-base-300 my-2" />

        {/* Explore */}
        <div className="mb-2">
          <h3 className="px-3 py-1 text-sm font-semibold">Explore</h3>
          {exploreItems.map((item, index) => (
            <Link key={index} to={item.link}>
              <motion.div
                className="flex items-center gap-6 p-2 rounded-lg hover:bg-base-200 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;