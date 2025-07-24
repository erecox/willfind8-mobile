import api from './api';
import { ApiResponse } from '@/types';

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

export const uploadService = {
  // Upload single file
  uploadSingle: async (file: FormData, folder?: string): Promise<UploadResponse> => {
    if (folder) {
      file.append('folder', folder);
    }
    const response = await api.post<UploadResponse>('/api/v1/upload/single', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload multiple files (max 10)
  uploadMultiple: async (files: FormData, folder?: string): Promise<UploadResponse[]> => {
    if (folder) {
      files.append('folder', folder);
    }
    const response = await api.post<UploadResponse[]>('/api/v1/upload/multiple', files, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload ad images (max 5)
  uploadAdImages: async (images: FormData): Promise<UploadResponse[]> => {
    const response = await api.post<UploadResponse[]>('/api/v1/upload/ad-images', images, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload user avatar
  uploadAvatar: async (avatar: FormData): Promise<UploadResponse> => {
    const response = await api.post<UploadResponse>('/api/v1/upload/avatar', avatar, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload documents (max 3)
  uploadDocuments: async (documents: FormData): Promise<UploadResponse[]> => {
    const response = await api.post<UploadResponse[]>('/api/v1/upload/documents', documents, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
