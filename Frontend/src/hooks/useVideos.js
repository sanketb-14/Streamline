// src/hooks/useVideos.js
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../Services/axios";

export const useVideos = () => {
  const [searchParams] = useSearchParams();

  // Extract and format query parameters
  const queryParams = {
    tags: searchParams.get('tags'),
    search: searchParams.get('search'),
    sort: searchParams.get('sort'),
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '12'),
    dateRange: searchParams.get('dateRange'),
    viewsRange: searchParams.get('viewsRange'),
    fields: searchParams.get('fields')
  };

  // Format view range for the API
  const formatViewRange = (viewRange) => {
    if (!viewRange) return null;
    
    const [min, max] = viewRange.split(',').map(val => {
        const num = parseInt(val);
        return isNaN(num) ? '' : num;
    });
    
    return `${min},${max}`;
};

const formatDateRange = (dateRange) => {
  if (!dateRange) return null;
  
  const [start, end] = dateRange.split(',');
  if (!start && !end) return null;
  
  return [
      start ? new Date(start).toISOString() : '',
      end ? new Date(end).toISOString() : ''
  ].join(',');
};


  // Build query string with proper formatting
  const buildQueryString = () => {
    const params = new URLSearchParams();
    
    // Handle basic parameters
    if (queryParams.tags) params.append('tags', queryParams.tags);
    if (queryParams.search) params.append('search', queryParams.search);
    if (queryParams.sort) params.append('sort', queryParams.sort);
    if (queryParams.page) params.append('page', queryParams.page.toString());
    if (queryParams.limit) params.append('limit', queryParams.limit.toString());
    if (queryParams.dateRange) params.append('dateRange', queryParams.dateRange);
    if (queryParams.fields) params.append('fields', queryParams.fields);
    
    // Handle view range formatting
    if (queryParams.viewsRange) {
      const formattedRange = formatViewRange(queryParams.viewsRange);
      if (formattedRange) {
          params.append('viewsRange', formattedRange);
      }
  } 

  if (queryParams.dateRange) {
    const formattedRange = formatDateRange(queryParams.dateRange);
    if (formattedRange) {
        params.append('dateRange', formattedRange);
    }
}
    return params.toString();
  };

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['videos', queryParams],
    queryFn: async () => {
      try {
        const queryString = buildQueryString();
        const response = await axiosInstance.get(`/videos?${queryString}`);
        
        return {
          videos: response.data.data.videos,
          total: response.data.total,
          currentPage: queryParams.page,
          totalPages: Math.ceil(response.data.total / queryParams.limit)
        };
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch videos';
        throw new Error(errorMessage);
      }
    },
    retry: 1,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  return {
    videos: data?.videos || [],
    total: data?.total || 0,
    currentPage: data?.currentPage || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    isError,
    error: error?.message || null,
    refetch
  };
};