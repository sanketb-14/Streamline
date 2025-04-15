import { motion } from "framer-motion"
import { Play, Eye, Clock } from 'lucide-react'

const VideoCard = ({ video }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <img
          src={`http://localhost:4000${video.thumbnail}`}
          alt={video.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-base-100 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 rounded-full bg-base-100/20 backdrop-blur-sm flex items-center justify-center"
          >
            <Play className="w-6 h-6 text-base-content fill-current" />
          </motion.div>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <h3 className="font-medium line-clamp-2">{video.title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{video.views} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>3:24</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default VideoCard

