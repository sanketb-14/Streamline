import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
const VideoDescription = ({ video }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4 bg-base-200/50 shadow-lg rounded-xl p-4"
    >
      <div className="text-sm text-base-content/50">
        {video.views} views • {video.uploadDate}
      </div>

      <motion.div
        animate={{ height: expanded ? "auto" : "100px" }}
        className="mt-2 overflow-hidden"
      >
        <p className="whitespace-pre-wrap">{video.description}</p>
      </motion.div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 text-sm font-medium text-secondary flex items-center gap-1"
      >
        {expanded ? (
          <>
            Show More <ChevronDown size={16} />
          </>
        ) : (
          <>
            Show less <ChevronUp size={16} />
          </>
        )}
      </button>
    </motion.div>
  );
};

export default VideoDescription;
