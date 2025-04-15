import { motion } from "framer-motion"

const VideoSkeleton = () => (
  <div className="w-full">
    <div className="aspect-video bg-base-300 rounded-xl animate-pulse" />
    <div className="flex gap-3 mt-3">
      <div className="w-10 h-10 rounded-full bg-base-200 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-base-300 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-base-300 rounded animate-pulse w-1/2" />
        <div className="h-3 bg-base-300 rounded animate-pulse w-1/4" />
      </div>
    </div>
  </div>
)

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <VideoSkeleton key={i} />
      ))}
    </div>
  )
}

