import { motion } from "framer-motion"
import { Play, Eye, Clock, Calendar, ThumbsUp, MessageCircle, Share2, MoreVertical, Edit2, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { Link } from "react-router-dom"
import { useVideo } from "../../hooks/useVideo"
import { useState } from "react"
import EditVideoModal from "./EditVideoModel"

const VideoCard = ({ video, onEdit, onDelete, isOwner }) => {
  const [showActions, setShowActions] = useState(false);
   
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative rounded-xl overflow-hidden shadow-lg bg-gradient-to-bl from-base-100 to-base-300"
    >
      {isOwner && (
        <div className="absolute top-2 right-2 z-10">
          <button 
            onClick={() => setShowActions(!showActions)}
            className="p-2 bg-black/50 rounded-full hover:bg-black/70"
          >
            <MoreVertical className="w-5 h-5 text-white" />
          </button>
          
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 mt-2 w-48 bg-base-100 rounded-md shadow-lg"
            >
              <button
                onClick={() => {
                  setShowActions(false);
                  onEdit(video);
                }}
                className="w-full text-left px-4 py-2 hover:bg-base-200 flex items-center"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => {
                  setShowActions(false);
                  onDelete(video._id);
                }}
                className="w-full text-left px-4 py-2 hover:bg-base-200 text-red-500 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* Thumbnail with gradient overlay */}
      <div className="relative aspect-video overflow-hidden">
        <Link to={`/watch/${video._id}`}>
          <motion.img
            src={`http://localhost:4000/public/${video.thumbnail}`}
            alt={video.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.div 
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
              >
                <Play className="w-8 h-8 text-white fill-current" />
              </motion.div>
            </motion.div>
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg text-primary font-semibold line-clamp-1 mb-2">
          {video.title}
        </h3>
        <p className="text-base-content/75 text-sm line-clamp-2 mb-4">
          {video.description}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm text-secondary">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-accent" />
            <span>{video.views} views</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            <span>{video.duration || '3:45'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            <span>{format(new Date(), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-accent" />
            <span>{video.likes || '24'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mt-4 pt-4 border-t"
        >
          <button className="flex items-center gap-2 text-sm text-secondary hover:text-blue-600 transition-colors">
            <MessageCircle className="w-4 h-4" />
            Comment
          </button>
          <button className="flex items-center gap-2 text-sm text-secondary hover:text-blue-600 transition-colors">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function MyVideo({ myVideos }) {
  const [editingVideo, setEditingVideo] = useState(null)
  const { updateVideo, deleteVideo, isUpdatingVideo, isDeletingVideo } = useVideo()

  const handleEditVideo = async (updateData) => {
    try {
      await updateVideo({ 
        videoId: editingVideo._id, 
        updateData 
      });
      setEditingVideo(null);
    } catch (error) {
      console.error("Failed to update video:", error);
    }
  };
  
  const handleDeleteVideo = async (videoId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await deleteVideo(videoId);
      } catch (error) {
        console.error("Failed to delete video:", error);
      }
    }
  };

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold mb-8 text-accent"
        >
          My Videos
        </motion.h1>

        {editingVideo && (
          <EditVideoModal
            video={editingVideo}
            onClose={() => setEditingVideo(null)}
            onSave={handleEditVideo}
            isUpdating={isUpdatingVideo}
          />
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {myVideos.map((video, index) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <VideoCard
                key={video._id}
                video={video}
                isOwner={true}
                onEdit={setEditingVideo}
                onDelete={handleDeleteVideo}
              />
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {myVideos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Play className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">No Videos Yet</h3>
            <p className="text-gray-500">Start uploading your videos to see them here.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}