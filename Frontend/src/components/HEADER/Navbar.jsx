import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaSignOutAlt, FaTachometerAlt, FaMicrophone, FaTimes } from "react-icons/fa";
import { BsYoutube, BsGrid3X3Gap } from "react-icons/bs";
import { IoSearchOutline, IoEllipsisVerticalSharp, IoArrowBack } from "react-icons/io5";
import ThemeSwitcher from "./ThemeChanger";
import { useAuth } from "../../hooks/useAuth";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../Services/axios";
import SearchSuggestions from "./SearchSuggestions";
import debounce from "lodash.debounce";

// Separate UserProfile component (unchanged)
const UserProfile = React.memo(({ user, logout }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = useCallback(() => {
    setIsDropdownVisible(prev => !prev);
  }, []);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownVisible && !event.target.closest('.user-profile-container')) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownVisible]);

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <div className="user-profile-container relative">
      <motion.div
        className="flex items-center gap-2 cursor-pointer"
        onClick={toggleDropdown}
      >
        <img
          src={`http://localhost:4000/public/img/users/${user.photo}`}
          alt={user?.fullName}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="hidden sm:inline">
          {user?.fullName.split(" ")[0]}
        </span>
      </motion.div>

      <AnimatePresence>
        {isDropdownVisible && (
          <motion.div
            className="absolute top-10 right-0 bg-base-100 shadow-lg rounded-lg w-48 overflow-hidden z-50"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Link to="/dashboard">
              <motion.button
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-base-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaTachometerAlt className="text-lg" />
                <span>Go to Dashboard</span>
              </motion.button>
            </Link>
            <motion.button
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-base-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
            >
              <FaSignOutAlt className="text-lg" />
              <span>Logout</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
UserProfile.displayName = "UserProfile";

const Navbar = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // Debounced search query
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

  // Fetch search suggestions
  const { data: suggestions = [], isLoading: isLoadingSuggestions } = useQuery({
    queryKey: ["search-suggestions", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      try {
        const response = await axiosInstance.get(
          `/videos/suggestions?search=${encodeURIComponent(searchQuery)}&limit=5`
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

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showSuggestions &&
        !e.target.closest(".search-container") &&
        !e.target.closest(".search-suggestions")
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSuggestions]);

  // Focus search input when mobile search is shown
  useEffect(() => {
    if (isMobileSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isMobileSearchVisible]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Screen size detection
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

  const searchBarVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <>
      {/* Sidebar (unchanged) */}
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

      <motion.div
        className={`fixed left-0 top-0 h-screen w-60 bg-base-100 z-50 shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <Sidebar />
      </motion.div>

      {/* Navbar */}
      <nav className="bg-base-100 h-14 fixed w-full top-0 z-40 flex items-center justify-between px-4 shadow-md">
        {/* Left Section */}
        {(!isSmallScreen || !isMobileSearchVisible) && (
          <div className="flex items-center gap-2 sm:gap-4">
            <motion.button
              className="hover:bg-base-200 p-2 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSidebar}
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
                <span className="text-lg sm:text-xl font-semibold ml-1 hidden sm:inline">
                  YouTube
                </span>
              </motion.div>
            </Link>
          </div>
        )}

        {/* Search Section */}
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
              {isSmallScreen && (
                <motion.button
                  className="p-2 mr-2 hover:bg-base-300 rounded-full"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileSearchVisible(false)}
                >
                  <IoArrowBack className="text-xl" />
                </motion.button>
              )}
              
              <div className="search-container relative flex-1">
                <form onSubmit={handleSearchSubmit}>
                  <div className="flex flex-1 items-center">
                    <div className="flex flex-1 items-center border-2 border-gray-600 rounded-l-full overflow-hidden focus-within:border-blue-500 relative">
                      <input
                        ref={searchInputRef}
                        id="search-input"
                        type="text"
                        placeholder="Search"
                        className="w-full input input-xs sm:input-sm outline-none text-sm sm:text-base bg-base-100 pl-4 pr-8"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => {
                          setSearchFocused(true);
                          setShowSuggestions(true);
                        }}
                        onBlur={() => setSearchFocused(false)}
                      />
                      {searchQuery && (
                        <motion.button
                          type="button"
                          className="absolute right-2 p-1 rounded-full hover:bg-base-300"
                          onClick={clearSearch}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaTimes className="text-sm" />
                        </motion.button>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="input input-xs sm:input-sm bg-base-100 border-2 border-gray-600 border-l-0 rounded-r-full hover:bg-base-300 px-4"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!searchQuery.trim()}
                    >
                      <IoSearchOutline className="text-xl" />
                    </button>
                  </div>
                </form>
                
                {showSuggestions && (
                  <SearchSuggestions
                    suggestions={suggestions}
                    isLoading={isLoadingSuggestions}
                    onSelect={handleSuggestionSelect}
                    searchQuery={searchQuery}
                  />
                )}
              </div>

              {!isSmallScreen && (
                <motion.button
                  className="ml-4 p-2 hover:bg-base-300 rounded-full"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Search with voice"
                >
                  <FaMicrophone className="text-xl" />
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Section */}
        {(!isSmallScreen || !isMobileSearchVisible) && (
          <div className="flex items-center gap-2 sm:gap-3">
            {isSmallScreen && (
              <motion.button
                className="p-2 hover:bg-base-300 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileSearchVisible(true)}
                title="Search"
              >
                <IoSearchOutline className="text-xl" />
              </motion.button>
            )}
            <motion.button
              className="p-2 hover:bg-base-300 rounded-full hidden sm:block"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Apps"
            >
              <BsGrid3X3Gap className="text-xl" />
            </motion.button>
            <motion.button
              className="p-2 hover:bg-base-300 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Settings"
            >
              <IoEllipsisVerticalSharp className="text-xl" />
            </motion.button>

            {/* User Profile Section */}
            {user ? (
              <UserProfile user={user} logout={logout} />
            ) : (
              <motion.button
                className="flex items-center gap-2 px-3 py-1 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50"
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
                  <span className="hidden sm:inline">Sign in</span>
                </Link>
              </motion.button>
            )}

            <ThemeSwitcher />
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;