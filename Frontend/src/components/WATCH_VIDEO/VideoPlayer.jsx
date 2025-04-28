import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ThumbsUp,
  ThumbsDown,
  Share,
  Download,
  MoreHorizontal,
  Bell,
  Volume2,
  VolumeX,
  Maximize2,
  Play,
  Pause,
  Gauge,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useSubscribers } from "../../hooks/useSubscribers";

/**
 * VideoPlayer Component
 * 
 * A comprehensive video player with playback controls, subscription management,
 * and interactive features like likes/dislikes. Includes:
 * - Play/pause, volume, and playback speed controls
 * - Fullscreen mode
 * - Progress bar with seek functionality
 * - Channel subscription management
 * - Like/dislike functionality
 * - Keyboard shortcuts for playback control
 */
const VideoPlayer = ({
  video,                // Video data object
  likeVideo,            // Function to like video
  dislikeVideo,         // Function to dislike video
  isLiking,            // Loading state for like action
  isDisliking,         // Loading state for dislike action
  isLiked,             // Boolean if video is liked
  isDisliked,          // Boolean if video is disliked
  likeError,           // Error from like action
  dislikeError,        // Error from dislike action
}) => {
  // Refs for video element and player container
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  // State variables for player controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const hideControlsTimeout = useRef(null);


  
  // Subscription management hooks
  const {
    isSubscribed,
    subscribeToChannel,
    unsubscribeFromChannel,
    subscribers,
    subscribersCount,
    isSubscribing,
    isUnsubscribing
  } = useSubscribers(video.channel.id);

  /**
   * Handles channel subscription/unsubscription
   * Toggles between subscribed and unsubscribed states
   */
  const handleSubscribeClick = () => {
    try {
      if (isSubscribed) {
        unsubscribeFromChannel();
      } else {
        subscribeToChannel();
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(error.message || "Failed to update subscription");
    }
  };

  // Keyboard shortcuts for video control
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!videoRef.current) return;
      
      // Skip keyboard shortcuts if user is typing in a form element
      if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA" ||
        document.activeElement.isContentEditable
      ) {
        return;
      }

      // Handle various keyboard shortcuts
      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          handlePlayPause();
          break;
        case "f":
          handleFullscreenToggle();
          break;
        case "m":
          handleMuteToggle();
          break;
        case "arrowleft":
          e.preventDefault();
          videoRef.current.currentTime -= 10;
          break;
        case "arrowright":
          e.preventDefault();
          videoRef.current.currentTime += 10;
          break;
        case "arrowup":
          e.preventDefault();
          handleVolumeChange({ target: { value: Math.min(volume + 0.1, 1) } });
          break;
        case "arrowdown":
          e.preventDefault();
          handleVolumeChange({ target: { value: Math.max(volume - 0.1, 0) } });
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [volume]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  /**
   * Shows controls on mouse movement and hides them after timeout
   */
  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    if (isPlaying) {
      hideControlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  /**
   * Toggles between play and pause states
   */
  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  /**
   * Updates current time as video plays
   */
  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  /**
   * Initializes video duration when metadata is loaded
   */
  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
    setIsBuffering(false);
  };

  /**
   * Handles seeking to specific time in video
   */
  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  /**
   * Adjusts volume level
   */
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  /**
   * Toggles mute state
   */
  const handleMuteToggle = () => {
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
    if (!newMutedState && volume === 0) {
      handleVolumeChange({ target: { value: 0.5 } });
    }
  };

  /**
   * Changes playback speed
   */
  const handlePlaybackSpeedChange = (speed) => {
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  /**
   * Toggles fullscreen mode
   */
  const handleFullscreenToggle = () => {
    if (!isFullscreen) {
      playerRef.current.requestFullscreen().catch((error) => {
        console.error("Error entering fullscreen:", error);
      });
    } else {
      document.exitFullscreen().catch((error) => {
        console.error("Error exiting fullscreen:", error);
      });
    }
  };

  /**
   * Formats time in HH:MM:SS or MM:SS format
   */
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Show error toast if like/dislike fails
  if (likeError || dislikeError) {
    toast.error(likeError || dislikeError);
  }

  return (
    <div className="w-full mx-auto">
      {/* Video Player Container */}
      <div
        ref={playerRef}
        className="relative w-full aspect-video bg-base-100 rounded-lg overflow-hidden mb-4 group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full cursor-pointer"
          src={video.fileUrl}
          onClick={handlePlayPause}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
          playsInline
        />

        {/* Play Button Overlay (when paused) */}
        {!isPlaying && showControls && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 bg-black/50 rounded-full text-white"
              onClick={handlePlayPause}
            >
              <Play size={32} />
            </motion.button>
          </div>
        )}

        {/* Buffering Indicator */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Video Controls */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Progress Bar */}
          <div className="group/progress relative">
            <input
              type="range"
              className="w-full h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer"
              value={(currentTime / duration) * 100 || 0}
              onChange={handleSeek}
            />
            <div className="hidden group-hover/progress:block absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white">
              {formatTime(currentTime)}
            </div>
          </div>

          {/* Time Display */}
          <div className="flex justify-between text-gray-300 text-sm mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              {/* Play/Pause Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayPause}
                className="p-2 hover:bg-white/20 rounded-full text-white"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </motion.button>

              {/* Volume Control */}
              <div className="group/volume relative flex items-center">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMuteToggle}
                  className="p-2 hover:bg-white/20 rounded-full text-white"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX size={20} />
                  ) : (
                    <Volume2 size={20} />
                  )}
                </motion.button>

                <input
                  type="range"
                  className="w-0 group-hover/volume:w-20 transition-all duration-200 h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer"
                  value={isMuted ? 0 : volume * 100}
                  onChange={handleVolumeChange}
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Playback Speed Control */}
              <div className="relative group/speed">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-white/20 rounded-full flex items-center gap-1 text-white"
                >
                  <Gauge size={20} /> {playbackSpeed}x
                </motion.button>

                <div className="hidden group-hover/speed:block absolute bottom-full mb-2 bg-black/90 rounded-lg py-2">
                  {[0.5, 1, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handlePlaybackSpeedChange(speed)}
                      className={`block w-full px-4 py-1 text-left hover:bg-white/20 text-white ${
                        playbackSpeed === speed ? "text-blue-400" : ""
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Fullscreen Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleFullscreenToggle}
                className="p-2 hover:bg-white/20 rounded-full text-white"
              >
                <Maximize2 size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Metadata Section */}
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-base-content/80">{video.title}</h1>

        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Channel Info Section */}
          <div className="flex items-center gap-4">
            <Link to={`/channel/${video.channel.id}`}>
              <motion.div className="relative rounded-full overflow-hidden">
                <img
                  src={video.channelThumbnail}
                  alt={video.channel.name}
                  className="w-12 h-12 rounded-full border-4 border-accent object-cover shadow-lg"
                />
              </motion.div>
            </Link>

            <div>
              <Link to={`/channel/${video.channel.id}`}>
                <h3 className="font-medium text-base-content">{video.channel.name || "Channel"}</h3>
              </Link>
              <p className="text-sm text-base-content/80">
                {typeof subscribersCount === 'number' ? subscribersCount : 0} subscribers
              </p>
            </div>

            {/* Subscribe Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSubscribeClick}
              disabled={isSubscribing || isUnsubscribing}
              className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                isSubscribed ? "bg-base-200 text-base-content" : "bg-red-600 text-base-content"
              } ${
                isSubscribing || isUnsubscribing
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isSubscribed && <Bell size={16} />}
              {isSubscribing
                ? "Subscribing..."
                : isUnsubscribing
                ? "Unsubscribing..."
                : isSubscribed
                ? "Subscribed"
                : "Subscribe"}
            </motion.button>
          </div>

          {/* Video Actions Section */}
          <div className="flex items-center gap-2">
            {/* Like/Dislike Buttons */}
            <div className="bg-base-200/75 rounded-full flex items-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={likeVideo}
                disabled={isLiking || isDisliking}
                className={`px-4 py-2 flex items-center gap-2 border-r border-base-200 text-base-content
                  ${isLiked ? "text-blue-400" : ""}
                  ${
                    isLiking || isDisliking
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-base-200 rounded-full"
                  }
                `}
              >
                <ThumbsUp
                  size={20}
                  className={isLiking ? "animate-pulse" : ""}
                />
                {video.likes}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={dislikeVideo}
                disabled={isLiking || isDisliking}
                className={`px-4 py-2 flex items-center gap-2 text-base-content
                  ${isDisliked ? "text-blue-400" : ""}
                  ${
                    isLiking || isDisliking
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-base-200 rounded-full"
                  }
                `}
              >
                <ThumbsDown
                  size={20}
                  className={isDisliking ? "animate-pulse" : ""}
                />
              </motion.button>
            </div>

            {/* Share Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-base-200/75 rounded-full flex items-center gap-2 text-base-content hover:bg-base-200"
            >
              <Share size={20} /> Share
            </motion.button>

            {/* Download Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-base-200/75 rounded-full flex items-center gap-2 text-base-content hover:bg-base-200"
            >
              <Download size={20} /> Download
            </motion.button>

            {/* More Options Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-base-200/80 rounded-full text-base-content hover:bg-base-200"
            >
              <MoreHorizontal size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;