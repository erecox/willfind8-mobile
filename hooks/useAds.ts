import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { adService } from '@/utils/adService';
import { Ad, AdCondition, AdStatus } from '@/types';

// Hook for fetching all ads with pagination
export const useAds = (params?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  cityId?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: AdCondition;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['ads', params],
    queryFn: () => adService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for infinite scrolling ads
export const useInfiniteAds = (params?: {
  limit?: number;
  categoryId?: string;
  cityId?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: AdCondition;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useInfiniteQuery({
    queryKey: ['ads-infinite', params],
    queryFn: ({ pageParam = 1 }) => 
      adService.getAll({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.pagination) {
        return undefined;
      }
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for fetching a single ad
export const useAd = (id: string) => {
  return useQuery({
    queryKey: ['ad', id],
    queryFn: () => adService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for fetching user's ads
export const useMyAds = (params?: {
  page?: number;
  limit?: number;
  status?: AdStatus;
}) => {
  return useQuery({
    queryKey: ['my-ads', params],
    queryFn: () => adService.getMyAds(params),
    staleTime: 2 * 60 * 1000, // 2 minutes for user's own data
    gcTime: 5 * 60 * 1000,
  });
};

// Hook for fetching saved ads
export const useSavedAds = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['saved-ads', params],
    queryFn: () => adService.getSavedAds(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
