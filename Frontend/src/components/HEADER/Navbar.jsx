import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaSignOutAlt,
  FaTachometerAlt,
  FaMicrophone,
  FaTimes,
  FaVideo,
  FaPlus,
} from "react-icons/fa";

import { BsYoutube, BsGrid3X3Gap } from "react-icons/bs";
import {
  IoSearchOutline,
  IoEllipsisVerticalSharp,
  IoArrowBack,
} from "react-icons/io5";
import ThemeSwitcher from "./ThemeChanger";
import { useAuth } from "../../hooks/useAuth";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../Services/axios";
import SearchSuggestions from "./SearchSuggestions";
import debounce from "lodash.debounce";
import VideoUploadModal from "../DASHBOARD/AddVideo";

/**
 * UserProfile Component - Displays user avatar with dropdown menu
 * @param {Object} props - Component props
 * @param {Object} props.user - User object with details
 * @param {Function} props.logout - Logout function
 * @param {Function} props.openAddVideo - Function to open add video modal
 */
const UserProfile = React.memo(({ user, logout, openAddVideo }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = useCallback(() => {
    setIsDropdownVisible((prev) => !prev);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDropdownVisible &&
        !event.target.closest(".user-profile-container")
      ) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownVisible]);

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  // Default avatar image for users without custom photos
  const defaultAvatar =
    "https://www.clipartkey.com/mpngs/m/152-1520367_user-profile-default-image-png-clipart-png-download.png";

  return (
    <div className="user-profile-container relative">
      <motion.div
        className="flex items-center gap-2 cursor-pointer"
        onClick={toggleDropdown}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src={user.photo === "default.webp" ? defaultAvatar : user.photo}
          alt={user?.fullName}
          className="w-8 h-8 rounded-full object-cover border border-base-300"
        />
        <span className="hidden sm:inline font-medium">
          {user?.fullName.split(" ")[0]}
        </span>
      </motion.div>

      <AnimatePresence>
        {isDropdownVisible && (
          <motion.div
            className="absolute top-10 right-0 bg-base-100 shadow-lg rounded-lg w-48 overflow-hidden z-50 border border-base-300"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Link to="/dashboard">
              <motion.button
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-base-200 text-base-content"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaTachometerAlt className="text-lg" />
                <span>Go to Dashboard</span>
              </motion.button>
            </Link>
            <motion.button
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-base-200 text-base-content"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openAddVideo}
            >
              <FaVideo className="text-lg" />
              <span>Upload Video</span>
            </motion.button>
            <motion.button
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-base-200 text-base-content"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
            >
              <FaSignOutAlt className="text-lg text-red-600" />
              <span>Logout</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
UserProfile.displayName = "UserProfile";

/**
 * Navbar Component - Main navigation bar for the application
 * Includes search functionality, user profile, and navigation controls
 */
const Navbar = () => {
  // State variables
  const [searchFocused, setSearchFocused] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Hooks
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // Handle Add Video modal
  const toggleVideoModal = useCallback(() => {
    setShowVideoModal((prev) => !prev);
  }, []);

  // Setup debounced search to avoid excessive API calls
  const debouncedSearchQuery = useRef(
    debounce((query) => {
      setSearchQuery(query);
    }, 300)
  ).current;

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearchQuery.cancel();
    };
  }, [debouncedSearchQuery]);

  // Fetch search suggestions query
  const { data: suggestions = [], isLoading: isLoadingSuggestions } = useQuery({
    queryKey: ["search-suggestions", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      try {
        const response = await axiosInstance.get(
          `/videos/suggestions?search=${encodeURIComponent(
            searchQuery
          )}&limit=5`
        );
        return response.data.data?.videos || [];
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        return [];
      }
    },
    enabled: searchQuery.trim().length > 0,
    staleTime: 1000,
  });

  // Sync search query with URL params
  useEffect(() => {
    const searchParam = searchParams.get("search") || "";
    setSearchQuery(searchParam);
  }, [searchParams]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    debouncedSearchQuery(value);
    setShowSuggestions(true);
  };

  const handleSuggestionSelect = (video) => {
    setSearchQuery(video.title);
    setShowSuggestions(false);
    navigate(`/watch/${video._id}`);
    searchInputRef.current?.blur();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setShowSuggestions(false);
    const params = new URLSearchParams();
    params.set("search", searchQuery);
    params.set("page", "1");
    setSearchParams(params);
    navigate(`/results?${params.toString()}`);
    searchInputRef.current?.blur();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Screen size detection for responsive UI
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640);
      // Close mobile search when screen gets larger
      if (window.innerWidth >= 640) {
        setIsMobileSearchVisible(false);
      }
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Animation variants
  const searchBarVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: {
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  return (
    <>
      {/* Sidebar Overlay - shown when sidebar is open */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleSidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Component */}
      <motion.div
        className="fixed left-0 top-0 h-screen w-60 bg-base-100 z-50 shadow-lg"
        variants={sidebarVariants}
        initial="hidden"
        animate={isSidebarOpen ? "visible" : "hidden"}
      >
        <Sidebar />
      </motion.div>

      {/* Main Navbar */}
      <nav className="bg-base-100 h-14 fixed w-full top-0 z-40 flex items-center justify-between px-4 shadow-md">
        {/* Left Section - Logo and Menu Toggle */}
        {(!isSmallScreen || !isMobileSearchVisible) && (
          <div className="flex items-center gap-2 sm:gap-4">
            <motion.button
              className="hover:bg-base-200 p-2 rounded-full text-base-content"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <FaBars className="text-xl" />
            </motion.button>
            <Link to="/">
              <motion.div
                className="flex items-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BsYoutube className="text-2xl sm:text-3xl text-red-600" />
                <span className="text-lg sm:text-xl font-semibold ml-1 hidden sm:inline text-base-content">
                  StreamLine
                </span>
              </motion.div>
            </Link>
          </div>
        )}

        {/* Search Section - Responsive Search Bar */}
        <AnimatePresence mode="wait">
          {(!isSmallScreen || isMobileSearchVisible) && (
            <motion.div
              className={`flex items-center ${
                isSmallScreen
                  ? "absolute left-0 right-0 bg-base-100 px-4 py-2"
                  : "flex-1 max-w-2xl mx-4"
              }`}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={searchBarVariants}
            >
              {/* Back button for mobile search */}
              {isSmallScreen && (
                <motion.button
                  className="p-2 mr-2 hover:bg-base-300 rounded-full text-base-content"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileSearchVisible(false)}
                  aria-label="Back"
                >
                  <IoArrowBack className="text-xl" />
                </motion.button>
              )}

              {/* Search input container */}
              <div className="search-container relative flex-1">
                <form onSubmit={handleSearchSubmit}>
                  <div className="flex flex-1 items-center">
                    <div className="flex flex-1 items-center border-2 border-base-300 rounded-l-full overflow-hidden focus-within:border-primary relative">
                      <input
                        ref={searchInputRef}
                        id="search-input"
                        type="text"
                        placeholder="Search"
                        className="w-full input input-xs sm:input-sm outline-none text-sm sm:text-base bg-base-100 pl-4 pr-8 text-base-content"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => {
                          setSearchFocused(true);
                          setShowSuggestions(!!searchQuery.trim());
                        }}
                        onBlur={() => setSearchFocused(false)}
                      />
                      {/* Clear search button */}
                      {searchQuery && (
                        <motion.button
                          type="button"
                          className="absolute right-2 p-1 rounded-full hover:bg-base-300 text-base-content/60"
                          onClick={clearSearch}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label="Clear search"
                        >
                          <FaTimes className="text-sm" />
                        </motion.button>
                      )}
                    </div>
                    {/* Search button */}
                    <motion.button
                      type="submit"
                      className="input input-xs sm:input-sm bg-base-200 border-2 border-base-300 border-l-0 rounded-r-full hover:bg-base-300 px-4 text-base-content"
                      whileHover={{ opacity: 0.9 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!searchQuery.trim()}
                      aria-label="Search"
                    >
                      <IoSearchOutline className="text-xl" />
                    </motion.button>
                  </div>
                </form>

                {/* Search suggestions dropdown */}
                {showSuggestions && (
                  <SearchSuggestions
                    suggestions={suggestions}
                    isLoading={isLoadingSuggestions}
                    onSelect={handleSuggestionSelect}
                    searchQuery={searchQuery}
                  />
                )}
              </div>

              {/* Voice search button - desktop only */}
              {!isSmallScreen && (
                <motion.button
                  className="ml-4 p-2 hover:bg-base-300 rounded-full text-base-content"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Search with voice"
                  aria-label="Voice search"
                >
                  <FaMicrophone className="text-xl" />
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Section - Actions and User Profile */}
        {(!isSmallScreen || !isMobileSearchVisible) && (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile search toggle */}
            {isSmallScreen && (
              <motion.button
                className="p-2 hover:bg-base-300 rounded-full text-base-content"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileSearchVisible(true)}
                title="Search"
                aria-label="Search"
              >
                <IoSearchOutline className="text-xl" />
              </motion.button>
            )}

            {/* Create video button - visible when logged in */}
            {user && (
              <motion.button
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-info/75 hover:bg-primary-focus "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleVideoModal}
                title="Create video"
                aria-label="Create video"
              >
                <FaPlus className="text-sm" />
                <span className="text-sm hidden sm:inline">Create</span>
              </motion.button>
            )}

            {/* Apps grid button - desktop only */}
            <motion.button
              className="p-2 hover:bg-base-300 rounded-full text-base-content hidden sm:block"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Apps"
              aria-label="Apps"
            >
              <BsGrid3X3Gap className="text-xl" />
            </motion.button>

            {/* Settings button */}
            <motion.button
              className="p-2 hover:bg-base-300 rounded-full text-base-content"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Settings"
              aria-label="Settings"
            >
              <IoEllipsisVerticalSharp className="text-xl" />
            </motion.button>

            {/* User Profile or Sign In Button */}
            {user ? (
              <UserProfile
                user={user}
                logout={logout}
                openAddVideo={toggleVideoModal}
              />
            ) : (
              <motion.div
                className="flex items-center gap-2 px-3 py-1 text-primary border border-primary rounded-full hover:bg-primary/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/login" className="flex items-center gap-2">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 1c4.96 0 9 4.04 9 9s-4.04 9-9 9-9-4.04-9-9 4.04-9 9-9zM12 6c-2.21 0-4 1.79-4 4v2h2v-2c0-1.1.9-2 2-2s2 .9 2 2v2h2v-2c0-2.21-1.79-4-4-4z"
                    />
                  </svg>
                  <span className="hidden sm:inline font-medium">Sign in</span>
                </Link>
              </motion.div>
            )}

            {/* Theme Switcher Component */}
            <ThemeSwitcher />
          </div>
        )}
      </nav>

      {/* Add VideoUploadModal */}
      <VideoUploadModal 
        isOpen={showVideoModal} 
        onClose={toggleVideoModal} 
      />
    </>
  );
};

export default Navbar;
