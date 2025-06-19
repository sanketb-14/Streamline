import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import VideoList from "../VIDEOLIST/VideoList"
import VideoFilter from "../VIDEOLIST/VideoFilterBar"
import { useVideos } from "../../hooks/useVideos"

export default function Home() {
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showColdStartNotice, setShowColdStartNotice] = useState(false)
  const [loadingStartTime, setLoadingStartTime] = useState(null)
  const { isLoading, videos } = useVideos()

  useEffect(() => {
    if (isLoading) {
      // Record when loading started
      setLoadingStartTime(Date.now())
      setLoadingProgress(0)
      setShowColdStartNotice(false)

      // Simulate progress during loading
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 8 + 2 // More realistic progress increments
        })
      }, 800)

      // Show cold start notice after 3 seconds
      const coldStartTimer = setTimeout(() => {
        setShowColdStartNotice(true)
      }, 3000)

      return () => {
        clearInterval(progressInterval)
        clearTimeout(coldStartTimer)
      }
    } else {
      // When loading is complete, finish the progress bar
      setLoadingProgress(100)
      // Hide cold start notice after a brief delay
      const hideNoticeTimer = setTimeout(() => {
        setShowColdStartNotice(false)
      }, 1000)

      return () => {
        clearTimeout(hideNoticeTimer)
      }
    }
  }, [isLoading])

  // Calculate loading duration for display
  const getLoadingDuration = () => {
    if (!loadingStartTime) return 0
    return Math.floor((Date.now() - loadingStartTime) / 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-base-100 text-base-content relative"
    >
      <div className="container mx-auto px-0 sm:px-2 py-6">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold mb-6"
        >
          Discover Videos
        </motion.h1>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl"
              >
                {/* Loading Animation */}
                <div className="mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"
                  />
                </div>

                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                  Loading Videos...
                </h3>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <motion.div
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-blue-600 h-2 rounded-full"
                  />
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {Math.round(loadingProgress)}% Complete
                  {loadingStartTime && (
                    <span className="block text-xs mt-1">
                      ({getLoadingDuration()}s elapsed)
                    </span>
                  )}
                </p>

                {/* Cold Start Notice */}
                <AnimatePresence>
                  {showColdStartNotice && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4"
                    >
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium text-blue-800 dark:text-blue-200">
                          First-time loading
                        </span>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Our server is starting up. This happens on the first visit and usually takes about 30 seconds. 
                        Future visits will be much faster!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Dynamic Loading Messages */}
                <motion.p
                  key={Math.floor(loadingProgress / 20)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-gray-500 dark:text-gray-400 mt-4"
                >
                  {loadingProgress < 20 && "Waking up our servers..."}
                  {loadingProgress >= 20 && loadingProgress < 40 && "Connecting to database..."}
                  {loadingProgress >= 40 && loadingProgress < 60 && "Fetching your videos..."}
                  {loadingProgress >= 60 && loadingProgress < 80 && "Organizing content..."}
                  {loadingProgress >= 80 && loadingProgress < 95 && "Almost ready..."}
                  {loadingProgress >= 95 && "Finalizing..."}
                </motion.p>

                {/* Optional: Skip button for impatient users */}
                {showColdStartNotice && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => {
                      // You could implement a "skip loading" feature here
                      // For now, just hide the modal
                      console.log("User wants to skip loading animation")
                    }}
                    className="mt-4 text-xs text-gray-400 hover:text-gray-600 underline"
                  >
                    Hide loading screen
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show skeleton/placeholder content while loading */}
        {isLoading ? (
          <div className="opacity-30 pointer-events-none">
            {/* Skeleton for VideoFilter */}
            <div className="mb-6 space-y-4">
              <div className="flex space-x-2 overflow-x-auto">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 w-24 bg-gray-200 rounded animate-pulse flex-shrink-0" />
                ))}
              </div>
            </div>

            {/* Skeleton for VideoList */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-200 rounded-lg animate-pulse overflow-hidden"
                >
                  <div className="aspect-video bg-gray-300" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-full" />
                    <div className="h-3 bg-gray-300 rounded w-3/4" />
                    <div className="h-3 bg-gray-300 rounded w-1/2" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <VideoFilter />
            <VideoList />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}