import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../Services/axios';
import { useAuth } from './useAuth';
import { toast } from 'react-hot-toast';

export const useChannel = (channelId) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();


    // Determine if we're viewing the current user's channel
    const isOwnChannel = user?.channel?._id === channelId;
    const targetChannelId = channelId || user?.channel?._id;

  
    

  // Get channel details query
  const getChannelQuery = useQuery({
    queryKey: ['channel', targetChannelId ],
    queryFn: async () => {
      if (!targetChannelId) {
        throw new Error('No channel ID provided');
      }

      try {
      
        
        const response = await axiosInstance.get(`/channel/${targetChannelId}`);
        // console.log("response channel" , response);
        
        return response.data.data.channel;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch channel details';
      }
    },
    enabled: !!targetChannelId,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  
  });

  // Update channel mutation
  const updateChannelMutation = useMutation({
    mutationFn: async (channelData) => {
      if (!isOwnChannel) {
        throw new Error('Cannot update another user\'s channel');
      }
       
      try {
        const response = await axiosInstance.patch(
          `/channel/${targetChannelId}`,
          channelData
        );
        return response.data.data.channel;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to update channel';
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['channel', targetChannelId], data);
      toast.success('Channel updated successfully!')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update channel');
    }
  });

  // Create channel mutation
  const createChannelMutation = useMutation({
   
    mutationFn: async (channelData) => {
      if (user?.channel) {
        throw new Error('User already has a channel');
      }
      try {
        const response = await axiosInstance.post('/channel', channelData);
        // console.log("response" , response);
        
        return response.data.data.channel;
      } catch (error) {
        if (error.response?.data?.message?.includes('already')) {
          throw new Error('User already has a channel');
        }
        throw error.response?.data?.message || 'Failed to create channel';
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['channel']);
    },
  });

  return {
    // Get channel methods
    channelData: getChannelQuery.data,
    isLoadingChannel: getChannelQuery.isLoading,
    channelError: getChannelQuery.error,
    getChannel: getChannelQuery.refetch,
    isFetchingChannel: getChannelQuery.isFetching,

    isOwnChannel,

    // Update channel methods
    updateChannel: isOwnChannel ? updateChannelMutation.mutate : null,
    isUpdatingChannel: updateChannelMutation.isPending,
    updateChannelError: updateChannelMutation.error,

    // Create channel methods
    createChannel:!user?.channel ? createChannelMutation.mutate : null,
    isCreatingChannel: createChannelMutation.isPending,
    createChannelError: createChannelMutation.error,
  };
};