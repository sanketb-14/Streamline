import { motion } from "framer-motion"
import VideoList from "../VIDEOLIST/VideoList"
import TagFilter from "../VIDEOLIST/TogFilter"
import VideoFilter from "../VIDEOLIST/VideoFilterBar"

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-base-100 text-base-content"
    >
      <div className="container mx-auto px-4 py-6">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold mb-6"
        >
          Discover Videos
        </motion.h1>
        {/* <TagFilter />
         */}
         <VideoFilter/>
        <VideoList />
      </div>
    </motion.div>
  )
}

