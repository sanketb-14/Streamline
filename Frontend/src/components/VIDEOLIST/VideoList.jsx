import { useVideos } from "../../hooks/useVideos"
import LoadingSkeleton from "./LoadingSkeleton"
import VideoCard from "./VideoCard"
import { AlertCircle } from 'lucide-react'

export default function VideoList() {
  const { videos, isLoading, isError, error, refetch } = useVideos()

  if (isLoading) return <LoadingSkeleton />

  if (isError) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        <AlertCircle className="w-5 h-5 mr-2" />
        <span>Error loading videos: {error}</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos?.map((video, index) => (
        <VideoCard key={video.id} video={video} index={index} />
      ))}
    </div>
  )
}

