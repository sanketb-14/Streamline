// components/SearchSuggestions.js
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiYoutube, FiLoader, FiUser } from "react-icons/fi";

/**
 * SearchSuggestions component displays a dropdown list of video suggestions
 * with smooth animations and responsive design.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.suggestions - Array of video suggestion objects
 * @param {boolean} props.isLoading - Loading state indicator
 * @param {Function} props.onSelect - Callback when a suggestion is selected
 * @returns {JSX.Element} Rendered search suggestions dropdown
 */
const SearchSuggestions = ({ suggestions, isLoading, onSelect }) => {
  return (
    <AnimatePresence>
      {(suggestions.length > 0 || isLoading) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="absolute top-full left-0 right-0 mt-1 bg-base-100 shadow-lg rounded-box z-50 max-h-80 overflow-y-auto border border-base-200"
        >
          {isLoading ? (
            <div className="p-4 text-center flex items-center justify-center gap-2 text-primary">
              <FiLoader className="animate-spin" />
              <span>Loading suggestions...</span>
            </div>
          ) : (
            <ul className="menu menu-compact w-full">
              {suggestions.map((video) => (
                <motion.li
                  key={video._id}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="border-b border-base-200 last:border-b-0 hover:bg-base-200/50"
                >
                  <Link
                    to={`/watch/${video._id}`}
                    className="active:bg-base-300"
                    onClick={() => onSelect(video)}
                  >
                    <div className="flex items-center gap-3 p-2">
                      <div className="flex-shrink-0 text-error">
                        <FiYoutube size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{video.title}</p>
                        <p className="text-sm text-base-content/70 flex items-center gap-1">
                          <FiUser size={14} />
                          <span className="truncate">
                            {video.channel?.name || 'Unknown channel'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchSuggestions;