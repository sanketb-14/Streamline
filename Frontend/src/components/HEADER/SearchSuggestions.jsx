// components/SearchSuggestions.js
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const SearchSuggestions = ({ suggestions, isLoading, onSelect }) => {
  return (
    <AnimatePresence>
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-1 bg-base-100 shadow-lg rounded-lg z-50 max-h-80 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : (
            <ul>
              {suggestions.map((video) => (
                <motion.li
                  key={video._id}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                  className="border-b border-base-200 last:border-b-0"
                >
                  <Link
                    to={`/watch/${video._id}`}
                    className="block p-3 hover:bg-base-200"
                    onClick={() => onSelect(video)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="font-medium">{video.title}</p>
                        <p className="text-sm text-base-content/70">
                          {video.channel?.name || 'Unknown channel'}
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