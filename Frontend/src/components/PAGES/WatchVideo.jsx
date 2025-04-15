import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import VideoPlayer from "../WATCH_VIDEO/VideoPlayer";
import VideoDescription from "../WATCH_VIDEO/VideoDescription";
import VideoComments from "../WATCH_VIDEO/VideoComment";
import RelatedVideos from "../WATCH_VIDEO/RelatedVideo";
import { useVideo } from "../../hooks/useVideo";
import { Loader, Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

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
          <div className="flex flex-col lg:flex-row lg:space-x-6">
            <div className="flex-grow lg:w-3/4">
              <div className="w-full aspect-video bg-base-200 rounded-lg animate-pulse" />
              <div className="mt-4 space-y-4">
                <div className="h-8 bg-base-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-vase-200 rounded w-1/2 animate-pulse" />
              </div>
            </div>
            <div className="lg:w-1/4 mt-6 lg:mt-0">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-base-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (videoError) {
    return (
      <div className="min-h-screen bg-base-100 text-base-content flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl mb-4">Failed to load video</h2>
          <p className="text-accent mb-4">{videoError?.message}</p>
          <button
            onClick={() => refreshVideo()}
            className="px-4 py-2 bg-primary/75 rounded-lg hover:bg-primary transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Missing video state
  if (!video) {
    return (
      <div className="min-h-screen bg-base-100 text-base-content flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl mb-2">Video not found</h2>
          <p className="text-base-content/75">
            The video you're looking for doesn't exist or has been removed.
          </p>
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
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          {/* Main Content */}
          <div className="flex-grow lg:w-3/4 w-full">
            <VideoPlayer
              video={video}
              likeVideo={likeVideo}
              dislikeVideo={dislikeVideo}
              isLiked={video.isLiked}
              isDisliked={video.isDisliked}
              isSubscribed={video.isSubscribed}
            />
            <VideoDescription video={video} className="mt-6" />

            <VideoComments
              comments={comments}
              totalComments={totalComments}
              onAddComment={addComment}
              likeComment={likeComment}
              dislikeComment={dislikeComment}
              isLikingComment={isLikingComment}
              isDislikingComment={isDislikingComment}
              isAddingComment={isAddingComment}
              className="mt-6"
            />
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4 mt-6 lg:mt-0">
            <RelatedVideos videos={relatedVideos} currentVideoId={videoId} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WatchVideo;
