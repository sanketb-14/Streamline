import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Loader2, AlertCircle, VideoOff } from "lucide-react";
import VideoPlayer from "../WATCH_VIDEO/VideoPlayer";
import VideoDescription from "../WATCH_VIDEO/VideoDescription";
import VideoComments from "../WATCH_VIDEO/VideoComment";
import RelatedVideos from "../WATCH_VIDEO/RelatedVideo";
import { useVideo } from "../../hooks/useVideo";
import { useAuth } from "../../hooks/useAuth";

/**
 * WatchVideo Component - Main component for watching videos with related content and comments
 * 
 * Features:
 * - Video player with like/dislike functionality
 * - Video description section
 * - Comments section with add/like/dislike functionality
 * - Related videos sidebar
 * - Responsive layout (mobile/desktop)
 * - Loading, error, and empty states
 * - Animation transitions
 */
const WatchVideo = () => {
  const { videoId } = useParams();
  const {
    video,
    isLoadingVideo,
    videoError,
    comments,
    totalComments,
    relatedVideos,
    likeVideo,
    dislikeVideo,
    addComment,
    likeComment,
    dislikeComment,
    isLikingComment,
    isDislikingComment,
    isAddingComment,
    refreshVideo,
    refreshComments,
  } = useVideo(videoId);

  // Refresh data when videoId changes
  useEffect(() => {
    if (videoId) {
      refreshVideo();
      refreshComments();
    }
  }, [videoId, refreshVideo, refreshComments]);

  // Loading state with skeleton animation
  if (isLoadingVideo) {
    return (
      <div className="min-h-screen bg-base-100 text-base-content">
        <div className="max-w-[1920px] mx-auto p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main content skeleton */}
            <div className="w-full lg:w-3/4 space-y-6">
              <div className="w-full aspect-video bg-base-200 rounded-box animate-pulse" />
              <div className="space-y-4">
                <div className="h-8 bg-base-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-base-200 rounded w-1/2 animate-pulse" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-base-200 rounded-box animate-pulse" />
                ))}
              </div>
            </div>
            
            {/* Sidebar skeleton */}
            <div className="w-full lg:w-1/4 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-40 h-24 bg-base-200 rounded-box animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-base-200 rounded w-full animate-pulse" />
                    <div className="h-3 bg-base-200 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-base-200 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (videoError) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center max-w-md p-6 rounded-box bg-base-200">
          <AlertCircle className="w-12 h-12 mx-auto text-error mb-4" />
          <h2 className="text-xl font-bold mb-2">Failed to load video</h2>
          <p className="text-error-content mb-6">{videoError?.message}</p>
          <button
            onClick={refreshVideo}
            className="btn btn-primary gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Missing video state
  if (!video) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center max-w-md p-6 rounded-box bg-base-200">
          <VideoOff className="w-12 h-12 mx-auto text-warning mb-4" />
          <h2 className="text-xl font-bold mb-2">Video not found</h2>
          <p className="text-base-content/75 mb-6">
            The video you're looking for doesn't exist or has been removed.
          </p>
          <button className="btn btn-ghost">Go to Home</button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-base-100 text-base-content"
    >
      <div className="max-w-[1920px] mx-auto p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content - Video Player, Description, Comments */}
          <main className="w-full lg:w-3/4 space-y-6">
            <VideoPlayer
              video={video}
              likeVideo={likeVideo}
              dislikeVideo={dislikeVideo}
              isLiked={video.isLiked}
              isDisliked={video.isDisliked}
              isSubscribed={video.isSubscribed}
            />
            
            <VideoDescription video={video} />
            
            <VideoComments
              comments={comments}
              totalComments={totalComments}
              onAddComment={addComment}
              likeComment={likeComment}
              dislikeComment={dislikeComment}
              isLikingComment={isLikingComment}
              isDislikingComment={isDislikingComment}
              isAddingComment={isAddingComment}
            />
          </main>

          {/* Sidebar - Related Videos */}
          <aside className="w-full lg:w-1/4">
            <div className="sticky top-6 space-y-4">
              <h3 className="text-lg font-semibold px-2">Related Videos</h3>
              <RelatedVideos 
                videos={relatedVideos} 
                currentVideoId={videoId} 
              />
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
};

export default WatchVideo;