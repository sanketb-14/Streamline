import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";

/**
 * Loader Component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.size="md"] - Size of loader (sm, md, lg, xl)
 * @param {string} [props.color="primary"] - Color of loader (primary, secondary, accent, etc.)
 * @param {string} [props.message] - Optional loading message
 * @param {boolean} [props.fullScreen=false] - Whether to cover full screen
 * @returns {JSX.Element} - Rendered loader component
 */
const Loader = ({ size = "md", color = "primary", message, fullScreen = false }) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
    neutral: "text-base-content",
    success: "text-success",
    error: "text-error",
    warning: "text-warning",
    info: "text-info"
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex flex-col items-center justify-center gap-3 ${
        fullScreen ? "fixed inset-0 bg-base-100/90 z-50" : ""
      }`}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        className={`${sizeClasses[size]} ${colorClasses[color]}`}
      >
        <Loader2 className="h-full w-full" />
      </motion.div>
      
      {message && (
        <motion.p
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          className={`text-${color} font-medium ${
            size === "sm" ? "text-sm" : 
            size === "md" ? "text-base" :
            size === "lg" ? "text-lg" : "text-xl"
          }`}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
};

Loader.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "accent",
    "neutral",
    "success",
    "error",
    "warning",
    "info"
  ]),
  message: PropTypes.string,
  fullScreen: PropTypes.bool
};

export default Loader;