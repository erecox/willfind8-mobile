import api from './api';
import { ApiUser, UpdateProfileRequest } from '@/types';

export const userService = {
  // Get current user profile
  getProfile: async (): Promise<ApiUser> => {
    const response = await api.get<ApiUser>('/api/v1/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileRequest): Promise<ApiUser> => {
    const response = await api.patch<ApiUser>('/api/v1/users/profile', data);
    return response.data;
  },

  // Get public user profile by ID
  getUserById: async (userId: string): Promise<ApiUser> => {
    const response = await api.get<ApiUser>(`/api/v1/users/${userId}`);
    return response.data;
  },
};
