import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp, Eye, Calendar } from "lucide-react";
import PropTypes from "prop-types";

/**
 * VideoDescription Component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.video - Video data object
 * @returns {JSX.Element} - Rendered video description component
 */
const VideoDescription = ({ video }) => {
  const [expanded, setExpanded] = useState(false);
  const hasLongDescription = video.description?.length > 200;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="mt-6 bg-base-200/30 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Video Stats */}
      <div className="flex items-center gap-4 text-sm text-base-content/70 mb-3">
        <span className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {video.views}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {video.uploadDate}
        </span>
      </div>

      {/* Description with expand/collapse */}
      <motion.div
        initial={false}
        animate={{ 
          height: expanded || !hasLongDescription ? "auto" : "6rem" 
        }}
        className="overflow-hidden"
      >
        <p className="whitespace-pre-line text-base-content/90">
          {video.description}
        </p>
      </motion.div>

      {/* Show More/Less button (only if description is long) */}
      {hasLongDescription && (
        <motion.button
          onClick={() => setExpanded(!expanded)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-3 text-sm font-medium text-primary flex items-center gap-1 hover:text-primary/80 transition-colors"
        >
          {expanded ? (
            <>
              Show Less
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show More
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </motion.button>
      )}
    </motion.div>
  );
};

// PropTypes validation
VideoDescription.propTypes = {
  video: PropTypes.shape({
    views: PropTypes.string.isRequired,
    uploadDate: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default VideoDescription;