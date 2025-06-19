import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import VideoList from "../VIDEOLIST/VideoList"
import VideoFilter from "../VIDEOLIST/VideoFilterBar"
import { useVideos } from "../../hooks/useVideos"

export default function Home() {

  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showColdStartNotice, setShowColdStartNotice] = useState(false)
  const { isLoading } = useVideos();
  
  

  useEffect(() => {
    // Simulate progress during loading
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 10
      })
    }, 1000)

    // Show cold start notice after 3 seconds
    const coldStartTimer = setTimeout(() => {
      setShowColdStartNotice(true)
    }, 3000)

    // This would be replaced by your actual video loading logic
    const loadingTimer = setTimeout(() => {
      setLoadingProgress(100)
      setTimeout(() => {
        setIsLoading(false)
        setShowColdStartNotice(false)
      }, 500)
    }, 25000) // 25 seconds simulation

    return () => {
      clearInterval(progressInterval)
      clearTimeout(coldStartTimer)
      clearTimeout(loadingTimer)
    }
  }, [])

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
                    initial={{ width: 0 }}
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-blue-600 h-2 rounded-full"
                  />
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {Math.round(loadingProgress)}% Complete
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

                {/* Fun Loading Messages */}
                <motion.p
                  key={Math.floor(loadingProgress / 25)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-gray-500 dark:text-gray-400 mt-4"
                >
                  {loadingProgress < 25 && "Waking up our servers..."}
                  {loadingProgress >= 25 && loadingProgress < 50 && "Fetching your videos..."}
                  {loadingProgress >= 50 && loadingProgress < 75 && "Organizing content..."}
                  {loadingProgress >= 75 && loadingProgress < 95 && "Almost ready..."}
                  {loadingProgress >= 95 && "Finalizing..."}
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show skeleton/placeholder content while loading */}
        {isLoading ? (
          <div className="opacity-30">
            <div className="mb-6 h-10 bg-gray-200 rounded animate-pulse" />
            <div className="grid gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <VideoFilter />
            <VideoList />
          </>
        )}
      </div>
    </motion.div>
  )
}