import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../Services/axios';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';
import { useChannel } from './useChannel';

export const useSubscribers = (channelId) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Add null check for channelId
  const safeChannelId = channelId || '';
  
  // Get channel data with fallback for null
  const { channelData, getChannel } = useChannel(safeChannelId);
  
  // Safely extract subscribers with multiple fallbacks
  const subscribers = Array.isArray(channelData?.subscribers) 
    ? channelData.subscribers 
    : [];
  
  // Safely get subscribersCount with fallbacks
  const subscribersCount = 
    (channelData?.statistics?.totalSubscribers) || 
    (channelData?.subscribersCount) || 
    subscribers.length || 
    0; // Ensure we default to 0 if all else fails
  
  // Safe check for user being subscribed
  const isSubscribed = Boolean(
    user && 
    user._id && 
    subscribers.length > 0 &&
    subscribers.some(subscriber => {
      // Handle null/undefined subscriber
      if (!subscriber) return false;
      
      // Handle object subscriber
      if (typeof subscriber === 'object' && subscriber !== null) {
        return subscriber._id === user._id;
      }
      
      // Handle string subscriber
      return subscriber === user._id;
    })
  );
  
  // Subscribe to a channel
  const subscribeChannelMutation = useMutation({
    mutationFn: async () => {
      // Validate required data
      if (!user || !user._id) {
        throw new Error('You must be logged in to subscribe');
      }
      
      if (!safeChannelId) {
        throw new Error('Channel ID is required');
      }
      
      // Perform the server request
      const response = await axiosInstance.post(`/channel/${safeChannelId}/subscribe`);
      return response.data.data.channel;
    },
    onMutate: async () => {
      // Prevent mutation if missing essential data
      if (!user?._id || !safeChannelId || !channelData) {
        return { previousData: null };
      }
      
      // Capture the current state for potential rollback
      const previousData = queryClient.getQueryData(['channel', safeChannelId]);
      
      // Skip optimistic update if no previous data
      if (!previousData) return { previousData: null };
      
      // Optimistically update the UI
      if (!isSubscribed) {
        const updatedData = {
          ...previousData,
          subscribers: [...subscribers, user._id],
          statistics: {
            ...(previousData.statistics || {}),
            totalSubscribers: subscribersCount + 1
          },
          subscribersCount: (previousData.subscribersCount || subscribers.length) + 1
        };
        
        queryClient.setQueryData(['channel', safeChannelId], updatedData);
      }
      
      return { previousData };
    },
    onSuccess: () => {
      // Refetch to ensure consistency with server - only if channelId is valid
      if (safeChannelId) {
        getChannel();
      }
      toast.success('Subscribed to channel successfully');
    },
    onError: (error, _, context) => {
      // Revert to the previous state on error
      if (context?.previousData) {
        queryClient.setQueryData(['channel', safeChannelId], context.previousData);
      }
      toast.error(error.message || 'Failed to subscribe to channel');
      
      // Force refetch to ensure data consistency - only if channelId is valid
      if (safeChannelId) {
        getChannel();
      }
    }
  });

  // Unsubscribe from a channel
  const unsubscribeChannelMutation = useMutation({
    mutationFn: async () => {
      // Validate required data
      if (!user || !user._id) {
        throw new Error('You must be logged in to unsubscribe');
      }
      
      if (!safeChannelId) {
        throw new Error('Channel ID is required');
      }
      
      // Perform the server request
      const response = await axiosInstance.delete(`/channel/${safeChannelId}/subscribe`);
      return response.data.data.channel;
    },
    onMutate: async () => {
      // Prevent mutation if missing essential data
      if (!user?._id || !safeChannelId || !channelData) {
        return { previousData: null };
      }
      
      // Capture the current state for potential rollback
      const previousData = queryClient.getQueryData(['channel', safeChannelId]);
      
      // Skip optimistic update if no previous data
      if (!previousData) return { previousData: null };
      
      // Optimistically update the UI
      if (isSubscribed) {
        const updatedSubscribers = subscribers.filter(subscriber => {
          if (!subscriber) return false;
          
          const id = typeof subscriber === 'object' ? subscriber._id : subscriber;
          return id !== user._id;
        });
        
        const updatedData = {
          ...previousData,
          subscribers: updatedSubscribers,
          statistics: {
            ...(previousData.statistics || {}),
            totalSubscribers: Math.max(0, subscribersCount - 1)
          },
          subscribersCount: Math.max(0, (previousData.subscribersCount || subscribers.length) - 1)
        };
        
        queryClient.setQueryData(['channel', safeChannelId], updatedData);
      }
      
      return { previousData };
    },
    onSuccess: () => {
      // Refetch to ensure consistency with server - only if channelId is valid
      if (safeChannelId) {
        getChannel();
      }
      toast.success('Unsubscribed from channel successfully');
    },
    onError: (error, _, context) => {
      // Revert to the previous state on error
      if (context?.previousData) {
        queryClient.setQueryData(['channel', safeChannelId], context.previousData);
      }
      toast.error(error.message || 'Failed to unsubscribe from channel');
      
      // Force refetch to ensure data consistency - only if channelId is valid
      if (safeChannelId) {
        getChannel();
      }
    }
  });

  return {
    isSubscribed,
    subscribers,
    subscribersCount,
    subscribeToChannel: subscribeChannelMutation.mutate,
    isSubscribing: subscribeChannelMutation.isPending,
    subscribeError: subscribeChannelMutation.error,
    unsubscribeFromChannel: unsubscribeChannelMutation.mutate,
    isUnsubscribing: unsubscribeChannelMutation.isPending,
    unsubscribeError: unsubscribeChannelMutation.error,
  };
};