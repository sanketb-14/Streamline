import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Eye, ThumbsUp, Clock } from 'lucide-react'

export default function VideoCard({ video, index }) {

  
  

  

  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        to={`/watch/${video.id}`}
        className="block bg-base-100 rounded-xl overflow-hidden hover:bg-base-200 transition-colors"
      >
        <motion.div 
          className="aspect-video relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "tween", duration: 0.2 }}
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover rounded-xl"
          />
          <div className="absolute bottom-2 right-2 bg-base-100/75 text-base-content px-2 py-1 rounded text-xs">
            {video.timeAgo}
          </div>
        </motion.div>
        
        <div className="p-3">
          <div className="flex gap-3">
            <motion.img
              whileHover={{ scale: 1.1 }}
              src={video.channel.owner.photo}
              alt={video.channel.owner.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-medium text-base-content line-clamp-2">{video.title}</h3>
               {/* Channel name as a separate clickable element */}
            <span 
              onClick={(e) => {
                e.preventDefault(); // Prevent video link navigation
                window.location.href = `/channel/${video.channel.id}`;
              }}
              className="hover:text-info cursor-pointer text-base-content/60"
            >
              {video.channel.name}
            </span>
              
            </div>
          </div>
          
          <div className="flex gap-4 mt-2 text-xs text-base-content/80">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-primary/50" />
              {video.views}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3 text-primary/50" />
              {video.likes}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-primary/50" />
              {video.timeAgo}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

