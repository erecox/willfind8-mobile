import api from './api';
import { LoginRequest, RegisterRequest, AuthResponse, ApiUser, ApiResponse } from '@/types';

export const authService = {
  // Register a new user
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/v1/auth/register', data);
    return response.data;
  },

  // Login user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/v1/auth/login', data);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<ApiUser> => {
    const response = await api.get<ApiUser>('/api/v1/auth/profile');
    return response.data;
  },

  // Refresh access token
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/v1/auth/refresh');
    return response.data;
  },

  // Request password reset
  forgotPassword: async (email: string): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>('/api/v1/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (token: string, password: string): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>('/api/v1/auth/reset-password', { 
      token, 
      password 
    });
    return response.data;
  },
};
