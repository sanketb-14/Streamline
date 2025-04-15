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

const VideoPlayer = ({
  video,
  likeVideo,
  dislikeVideo,
  isLiking,
  isDisliking,
  isLiked,
  isDisliked,
  likeError,
  dislikeError,
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
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

  const {
    isSubscribed,

    subscribeToChannel,
    unsubscribeFromChannel,
    subscribers,
    subscribersCount,
    isSubscribing,
    isUnsubscribing
  } = useSubscribers(video.channel.id);

  // console.log("watch video", isSubscribed, video);

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

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!videoRef.current) return;

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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

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

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
    setIsBuffering(false);
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleMuteToggle = () => {
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
    if (!newMutedState && volume === 0) {
      handleVolumeChange({ target: { value: 0.5 } });
    }
  };

  const handlePlaybackSpeedChange = (speed) => {
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

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

  if (likeError || dislikeError) {
    toast.error(likeError || dislikeError);
  }

  return (
    <div className="w-full mx-auto">
      <div
        ref={playerRef}
        className="relative w-full aspect-video bg-base-100 rounded-lg overflow-hidden mb-4 group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          className="w-full h-full cursor-pointer"
          src={video.filePath}
          onClick={handlePlayPause}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
          playsInline
        />

        {!isPlaying && showControls && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-100/20">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 bg-base-200/50 rounded-full"
              onClick={handlePlayPause}
            >
              <Play size={32} className="text-base-content" />
            </motion.button>
          </div>
        )}

        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <div
          className={`absolute bottom-0 left-0 right-0 bg-base-100-to-t from-base-200 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="group/progress relative">
            <input
              type="range"
              className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer"
              value={(currentTime / duration) * 100 || 0}
              onChange={handleSeek}
            />
            <div className="hidden group-hover/progress:block absolute -top-8 left-1/2 transform -translate-x-1/2 bg-base-100/80 px-2 py-1 rounded text-xs">
              {formatTime(currentTime)}
            </div>
          </div>

          <div className="flex justify-between text-base-content/50 text-sm mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayPause}
                className="p-2 hover:bg-base-200 rounded-full"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </motion.button>

              <div className="group/volume relative flex items-center">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMuteToggle}
                  className="p-2 hover:bg-base-200 rounded-full"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX size={20} />
                  ) : (
                    <Volume2 size={20} />
                  )}
                </motion.button>

                <input
                  type="range"
                  className="w-0 group-hover/volume:w-20 transition-all duration-200 h-1 bg-base-200 rounded-lg appearance-none cursor-pointer"
                  value={isMuted ? 0 : volume * 100}
                  onChange={handleVolumeChange}
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative group/speed">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-base-200 rounded-full flex items-center gap-1"
                >
                  <Gauge size={20} /> {playbackSpeed}x
                </motion.button>

                <div className="hidden group-hover/speed:block absolute bottom-full mb-2 bg-base-200/90 rounded-lg py-2">
                  {[0.5, 1, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handlePlaybackSpeedChange(speed)}
                      className={`block w-full px-4 py-1 text-left hover:bg-base-300 ${
                        playbackSpeed === speed ? "text-blue-500" : ""
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleFullscreenToggle}
                className="p-2 hover:bg-base-200 rounded-full"
              >
                <Maximize2 size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-xl font-bold">{video.title}</h1>

        <div className="flex flex-wrap items-center justify-between gap-4">
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
                <h3 className="font-medium">{video.channel.name || "Channel"}</h3>
              </Link>
              <p className="text-sm text-base-content/50">
              {typeof subscribersCount === 'number' ? subscribersCount : 0} subscribers
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSubscribeClick}
              disabled={isSubscribing || isUnsubscribing}
              className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                isSubscribed ? "bg-base-200" : "bg-red-600 text-white"
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

          <div className="flex items-center gap-2">
            <div className="bg-base-200 rounded-full flex items-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={likeVideo}
                disabled={isLiking || isDisliking}
                className={`px-4 py-2 flex items-center gap-2 border-r border-base-200 
                  ${isLiked ? "text-blue-500" : ""}
                  ${
                    isLiking || isDisliking
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-base-300 rounded-full"
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
                className={`px-4 py-2 flex items-center gap-2
            ${isDisliked ? "text-blue-500" : ""}
            ${
              isLiking || isDisliking
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-base-300 rounded-full"
            }
          `}
              >
                <ThumbsDown
                  size={20}
                  className={isDisliking ? "animate-pulse" : ""}
                />
              </motion.button>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-base-200 rounded-full flex items-center gap-2"
            >
              <Share size={20} /> Share
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-base-200 rounded-full flex items-center gap-2"
            >
              <Download size={20} /> Download
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-base-200 rounded-full"
            >
              <MoreHorizontal size={20} />
            </motion.button>
          </div>
        </div>

        <div className="bg-base-200 rounded-lg p-4">
          <p className="text-sm text-base-content/75">{video.description}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
