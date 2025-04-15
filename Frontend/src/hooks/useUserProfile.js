import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../Services/axios';

export const useUserProfile = () => {
  const queryClient = useQueryClient();

  const updateMeMutation = useMutation({
    mutationFn: async (userData) => {
      try {
        // Configure axios to handle multipart/form-data
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
        
        const response = await axiosInstance.patch('/users/updateMe', userData, config);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to update profile. Please try again.';
      }
    },
    onSuccess: (responseData) => {
      // Update the user data in the cache
      queryClient.setQueryData(['user'], (oldData) => {
        return {
          ...oldData,
          ...responseData.data.user
        };
      });
    },
  });

  return {
    updateMe: updateMeMutation.mutate,
    isUpdatingProfile: updateMeMutation.isPending,
    updateMeError: updateMeMutation.error,
  };
};