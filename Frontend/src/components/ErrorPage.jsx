import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const ErrorPage = ({ errorCode = 404, errorMessage = "Page Not Found" }) => {
  // Common error messages based on status codes
  const errorMessages = {
    404: {
      title: "Page Not Found",
      description: "The page you're looking for doesn't exist or has been moved."
    },
    500: {
      title: "Server Error",
      description: "Something went wrong on our end. Please try again later."
    },
    403: {
      title: "Access Denied",
      description: "You don't have permission to access this resource."
    }
  };

  // Get the appropriate message or use defaults
  const { title, description } = errorMessages[errorCode] || {
    title: errorMessage,
    description: "An unexpected error occurred."
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-base-100 to-base-200 p-6 text-center"
    >
      <div className="max-w-md w-full space-y-6">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0] 
          }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="p-4 bg-error/10 rounded-full">
            <AlertTriangle className="w-16 h-16 text-error" />
          </div>
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-base-content">
            {errorCode} - {title}
          </h1>
          <p className="text-lg text-base-content/80">
            {description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
          <Link
            to="/"
            className="btn btn-primary flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Return Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-ghost bg-base-300 hover:bg-base-300/80 flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </div>

        {errorCode === 404 && (
          <div className="pt-8">
            <p className="text-sm text-base-content/60 mb-2">
              Maybe you were looking for:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                to="/videos"
                className="px-4 py-2 text-sm bg-base-300 hover:bg-base-300/80 rounded-full transition-colors"
              >
                Popular Videos
              </Link>
              <Link
                to="/channels"
                className="px-4 py-2 text-sm bg-base-300 hover:bg-base-300/80 rounded-full transition-colors"
              >
                Featured Channels
              </Link>
              <Link
                to="/trending"
                className="px-4 py-2 text-sm bg-base-300 hover:bg-base-300/80 rounded-full transition-colors"
              >
                Trending Content
              </Link>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorPage;