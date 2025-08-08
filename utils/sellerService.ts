import api from './api';
import { 
  SellerProfile, 
  CreateSellerProfileRequest, 
  UpdateSellerProfileRequest,
  SellerVerificationRequest,
  SellerVerification,
  SellerReview,
  PaginatedResponse
} from '@/types';

export const sellerService = {
  // Get seller profile
  getSellerProfile: async (): Promise<SellerProfile> => {
    const response = await api.get<SellerProfile>('/api/v1/seller/profile');
    return response.data;
  },

  // Create seller profile
  createSellerProfile: async (data: CreateSellerProfileRequest): Promise<SellerProfile> => {
    const response = await api.post<SellerProfile>('/api/v1/seller/profile', data);
    return response.data;
  },

  // Update seller profile
  updateSellerProfile: async (data: UpdateSellerProfileRequest): Promise<SellerProfile> => {
    const response = await api.patch<SellerProfile>('/api/v1/seller/profile', data);
    return response.data;
  },

  // Delete seller profile
  deleteSellerProfile: async (): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>('/api/v1/seller/profile');
    return response.data;
  },

  // Submit seller verification
  submitVerification: async (data: SellerVerificationRequest): Promise<SellerVerification> => {
    const response = await api.post<SellerVerification>('/api/v1/seller/verification', data);
    return response.data;
  },

  // Get seller verification status
  getVerificationStatus: async (): Promise<SellerVerification> => {
    const response = await api.get<SellerVerification>('/api/v1/seller/verification');
    return response.data;
  },

  // Get seller reviews
  getSellerReviews: async (page = 1, limit = 10): Promise<PaginatedResponse<SellerReview>> => {
    const response = await api.get<PaginatedResponse<SellerReview>>(`/api/v1/seller/reviews?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get seller statistics
  getSellerStats: async (): Promise<{
    totalAds: number;
    activeAds: number;
    totalViews: number;
    totalMessages: number;
    averageRating: number;
    totalReviews: number;
  }> => {
    const response = await api.get('/api/v1/seller/stats');
    return response.data;
  },

  // Upload document images
  uploadDocumentImages: async (files: File[]): Promise<Array<{ url: string; thumbnail: string }>> => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`documents`, file);
    });

    const response = await api.post('/api/v1/seller/upload/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload address proof images
  uploadAddressProofImages: async (files: File[]): Promise<Array<{ url: string; thumbnail: string }>> => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`addressProof`, file);
    });

    const response = await api.post('/api/v1/seller/upload/address-proof', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload face photo
  uploadFacePhoto: async (file: File): Promise<{ url: string; thumbnail: string }> => {
    const formData = new FormData();
    formData.append('facePhoto', file);

    const response = await api.post('/api/v1/seller/upload/face-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
