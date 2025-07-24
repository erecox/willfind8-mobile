import api from './api';
import { ApiAd, CreateAdRequest, UpdateAdRequest, PaginatedResponse, AdStatus, AdCondition } from '@/types';

export const adService = {
  // Create a new ad
  create: async (data: CreateAdRequest): Promise<ApiAd> => {
    const response = await api.post<ApiAd>('/api/v1/ads', data);
    return response.data;
  },

  // Get all ads with filtering and pagination
  getAll: async (params?: {
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
  }): Promise<PaginatedResponse<ApiAd>> => {
    const response = await api.get<PaginatedResponse<ApiAd>>('/api/v1/ads', { params });
    return response.data;
  },

  // Get ad by ID
  getById: async (id: string): Promise<ApiAd> => {
    const response = await api.get<ApiAd>(`/api/v1/ads/${id}`);
    return response.data;
  },

  // Update an existing ad
  update: async (id: string, data: UpdateAdRequest): Promise<ApiAd> => {
    const response = await api.patch<ApiAd>(`/api/v1/ads/${id}`, data);
    return response.data;
  },

  // Delete an ad (soft delete)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/ads/${id}`);
  },

  // Get current user's ads
  getMyAds: async (params?: {
    page?: number;
    limit?: number;
    status?: AdStatus;
  }): Promise<PaginatedResponse<ApiAd>> => {
    const response = await api.get<PaginatedResponse<ApiAd>>('/api/v1/ads/my-ads', { params });
    return response.data;
  },

  // Get user's saved/bookmarked ads
  getSavedAds: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ApiAd>> => {
    const response = await api.get<PaginatedResponse<ApiAd>>('/api/v1/ads/saved', { params });
    return response.data;
  },

  // Save ad to favorites
  saveAd: async (adId: string): Promise<void> => {
    await api.post(`/api/v1/ads/${adId}/save`);
  },

  // Remove ad from favorites
  unsaveAd: async (adId: string): Promise<void> => {
    await api.delete(`/api/v1/ads/${adId}/save`);
  },
};
