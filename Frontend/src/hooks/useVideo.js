import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../Services/axios";
import { useAuth } from "./useAuth";
import toast from "react-hot-toast";



const baseURL = import.meta.env.VITE_BACKEND_DATA_URL;

export const useVideo = (videoId) => {
  const queryClient = useQueryClient();
  const {user} = useAuth()

  // Get video details query
  const getVideoQuery = useQuery({
    queryKey: ["video", videoId],
    queryFn: async () => {
      if (!videoId) {
        throw new Error("No video ID provided");
      }

      try {
        const response = await axiosInstance.get(`/videos/${videoId}`);
        const video = response.data.data.video;
       

        // Transform video data to match UI requirements
        return {
          ...video,
          filePath:video.fileUrl,
          videoId: video._id,
          channelName: video.channel.name,
          channelThumbnail: video.channel.owner.photo,
          subscribers: `${(video.channel.subscribers.length || 0).toLocaleString()}`,
          likes: `${(video.likes?.length || 0).toLocaleString()}`,
          views: `${(video?.views || 0).toLocaleString()}`,
          uploadDate: video.timeAgo,

          isSubscribed: video.channel.subscribers?.includes(user?._id),
          isLiked: video.likes?.includes(user?._id),
          isDisliked: video.dislikes?.includes(user?._id),
        };
      } catch (error) {
       
        throw error.response?.data?.message || "Failed to fetch video details";
      }
    },
    enabled: !!videoId,
    refetchOnMount: true,
  });

  // Get related videos query
  const getRelatedVideosQuery = useQuery({
    queryKey: ["relatedVideos", videoId],
    queryFn: async () => {
      if (!videoId) return [];
      try {
        const response = await axiosInstance.get(`/videos/trending`);
     
        
        
        return response.data.data.videos.map((video) => 
          
          ({
          thumbnail: video.thumbnail ,
          
          
          title: video.title,
          channelName: video.channel.name,
          views: `${(video.views || 0).toLocaleString()} views`,
          uploadDate: video.timeAgo,
          _id: video.id,
        }));
      } catch (error) {
        console.error("Failed to fetch related videos:", error);
        return [];
      }
    },
    enabled: !!videoId,
  });

  // Get video comments query with pagination
// Get video comments query with pagination
const getCommentsQuery = useQuery({
  queryKey: ["videoComments", videoId],
  queryFn: async () => {
    if (!videoId) return { comments: [], total: 0 };
    try {
      const response = await axiosInstance.get(`/videos/${videoId}/comments`);
      const comments = response.data.data.comments.map((comment) => ({
        _id: comment._id,
        userAvatar: comment.user.photo,
        userName: comment.user.fullName,
        timestamp: new Date(comment.createdAt).toLocaleDateString(),
        content: comment.content,
        likes: comment.likes.length,
        isLiked: comment.likes.includes(user?._id),
        isDisliked: comment.dislikes.includes(user?._id),
        isOwner: comment.user._id === user?._id,
      }));
      return {
        comments,
        total: response.data.total,
      };
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch comments";
    }
  },
  enabled: !!videoId,
});

  // Like video mutation
  const likeVideoMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("Authentication required");
      }
      if (!videoId) {
        throw new Error("Video ID is required");
      }
      
      const response = await axiosInstance.post(`/videos/${videoId}/like`);
      
      return response.data.data;
    },
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(["video", videoId]);
      
      // Snapshot the previous value
      const previousVideo = queryClient.getQueryData(["video", videoId]);
      
      // Optimistically update the video
      queryClient.setQueryData(["video", videoId], (old) => ({
        ...old,
        isLiked: !old.isLiked,
        isDisliked: false,
        likes: old.isLiked 
          ? `${(parseInt(old.likes.replace(/,/g, "")) - 1).toLocaleString()}`
          : `${(parseInt(old.likes.replace(/,/g, "")) + 1).toLocaleString()}`
      }));
      
      return { previousVideo };
    },
    onError: (error, _, context) => {
      // Revert to the previous state on error
      queryClient.setQueryData(["video", videoId], context.previousVideo);
      
      const errorMessage = error.response?.data?.message || 
        (error.message === "Authentication required" 
          ? "Please sign in to like videos"
          : "Failed to update like status");
      
      toast.error(errorMessage);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["video", videoId], (oldData) => ({
        ...oldData,
        likes: `${data.likes.toLocaleString()}`,
        isLiked: data.isLiked,
        isDisliked: false,
      }));
      toast.success(data.isLiked ? "Video liked!" : "Like removed");
    }
  });

    // Enhanced dislike video mutation
    const dislikeVideoMutation = useMutation({
      mutationFn: async () => {
        if (!user) {
          throw new Error("Authentication required");
        }
        if (!videoId) {
          throw new Error("Video ID is required");
        }
        
        const response = await axiosInstance.post(`/videos/${videoId}/dislike`);
        return response.data.data;
      },
      onMutate: async () => {
        await queryClient.cancelQueries(["video", videoId]);
        const previousVideo = queryClient.getQueryData(["video", videoId]);
        
        queryClient.setQueryData(["video", videoId], (old) => ({
          ...old,
          isDisliked: !old.isDisliked,
          isLiked: false,
          // If removing a like due to dislike, decrease likes count
          likes: old.isLiked 
            ? `${(parseInt(old.likes.replace(/,/g, "")) - 1).toLocaleString()}`
            : old.likes
        }));
        
        return { previousVideo };
      },
      onError: (error, _, context) => {
        queryClient.setQueryData(["video", videoId], context.previousVideo);
        
        const errorMessage = error.response?.data?.message || 
          (error.message === "Authentication required" 
            ? "Please sign in to dislike videos"
            : "Failed to update dislike status");
        
        toast.error(errorMessage);
      },
      onSuccess: (data) => {
        queryClient.setQueryData(["video", videoId], (oldData) => ({
          ...oldData,
          likes: `${data.likes.toLocaleString()}`,
          isLiked: false,
          isDisliked: data.isDisliked,
        }));
        toast.success(data.isDisliked ? "Video disliked" : "Dislike removed");
      }
    });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (content) => {
      if (!user) throw new Error("Must be logged in to comment");
      const response = await axiosInstance.post(`/videos/${videoId}/comments`, {
        content,
      });
      const comment = response.data.data.comment;
      return {
        _id: comment._id,
        userAvatar: user.photo,
        userName: user.fullName,
        timestamp: "Just now",
        content: comment.content,
        likes: 0,
        isLiked: false,
        isDisliked: false,
        isOwner: true,
      };
    },
    onSuccess: (newComment) => {
      queryClient.setQueryData(["videoComments", videoId], (oldData) => ({
        ...oldData,
        comments: [newComment, ...(oldData?.comments || [])],
        total: (oldData?.total || 0) + 1,
      }));
      toast.success("Comment added successfully");
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      if (!user) throw new Error("Must be logged in to delete comments");
      await axiosInstance.delete(`/videos/comments/${commentId}`);
      return commentId;
    },
    onSuccess: (commentId) => {
      queryClient.setQueryData(["videoComments", videoId], (oldData) => ({
        ...oldData,
        comments: oldData.comments.filter(
          (comment) => comment._id !== commentId
        ),
        total: oldData.total - 1,
      }));
      toast.success("Comment deleted successfully");
    },
  });

  // Comment interactions mutations
  const likeCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      if (!user) throw new Error("Must be logged in to like comments");
      const response = await axiosInstance.post(
        `/videos/comments/${commentId}/like`
      );
      return { commentId, ...response.data.data };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["videoComments", videoId], (oldData) => ({
        ...oldData,
        comments: oldData.comments.map((comment) =>
          comment._id === data.commentId
            ? {
                ...comment,
                likes: data.likes,
                isLiked: data.isLiked,
                isDisliked: false,
              }
            : comment
        ),
      }));
    },
  });

  const dislikeCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      if (!user) throw new Error("Must be logged in to dislike comments");
      const response = await axiosInstance.post(
        `/videos/comments/${commentId}/dislike`
      );
      return { commentId, ...response.data.data };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["videoComments", videoId], (oldData) => ({
        ...oldData,
        comments: oldData.comments.map((comment) =>
          comment._id === data.commentId
            ? {
                ...comment,
                likes: data.likes,
                isLiked: false,
                isDisliked: data.isDisliked,
              }
            : comment
        ),
      }));
    },
  });

  const updateVideoMutation = useMutation({
    mutationFn: async ({ videoId:id, updateData }) => {
      if (!user) throw new Error("Authentication required");
      console.log();
      
      const response = await axiosInstance.patch(`/videos/${id}`, {
        title: updateData.title,
        description: updateData.description,
        tags: updateData.tags || []
      } );
      console.log(response.data.data);
      
      return response.data.data.video;
    },
    onSuccess: (updatedVideo) => {
      queryClient.invalidateQueries(["video", updatedVideo._id]);
      toast.success("Video updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update video");
    }
  });
  
  const deleteVideoMutation = useMutation({
    mutationFn: async (id) => {
      if (!user) throw new Error("Authentication required");
      await axiosInstance.delete(`/videos/${id}`);
      return videoId;
    },
    onSuccess: (deletedVideoId) => {
      queryClient.invalidateQueries(["videos"]); // Invalidate videos list
      toast.success("Video deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete video");
    }
  });

  return {
    // Video data and methods
    video: getVideoQuery.data,
    isLoadingVideo: getVideoQuery.isLoading,
    videoError: getVideoQuery.error,
    refreshVideo: getVideoQuery.refetch,

    // Related videos
    relatedVideos: getRelatedVideosQuery.data,
    isLoadingRelatedVideos: getRelatedVideosQuery.isLoading,

    // Comments data and methods
    comments: getCommentsQuery.data?.comments || [],
    totalComments: getCommentsQuery.data?.total || 0,
    isLoadingComments: getCommentsQuery.isLoading,
    commentsError: getCommentsQuery.error,
    refreshComments: getCommentsQuery.refetch,

    // Video interactions
    likeVideo:  () => {
      try {
        likeVideoMutation.mutate();
      } catch (error) {
        console.error("Error in likeVideo:", error);
      }
    },
    dislikeVideo: () => {
      try {
        dislikeVideoMutation.mutate();
      } catch (error) {
        console.error("Error in dislikeVideo:", error);
      }
    },
    isLiking: likeVideoMutation.isPending,
    isDisliking: dislikeVideoMutation.isPending,
    likeError: likeVideoMutation.error,
    dislikeError: dislikeVideoMutation.error,

    // Comment interactions
    addComment: addCommentMutation.mutate,
    deleteComment: deleteCommentMutation.mutate,
    likeComment: likeCommentMutation.mutate,
    dislikeComment: dislikeCommentMutation.mutate,
    isAddingComment: addCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending,
    isLikingComment: likeCommentMutation.isPending,
    isDislikingComment: dislikeCommentMutation.isPending,

    //video interactions
    updateVideo: updateVideoMutation.mutateAsync,
    deleteVideo: deleteVideoMutation.mutateAsync,
    isUpdatingVideo: updateVideoMutation.isPending,
    isDeletingVideo: deleteVideoMutation.isPending,
  };
};
