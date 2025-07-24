import api from './api';
import { ApiCategory, ApiResponse } from '@/types';

export const categoryService = {
  // Get all categories with optional filtering
  getAll: async (params?: { 
    includeFields?: boolean; 
    parentId?: string; 
    isActive?: boolean 
  }): Promise<ApiCategory[]> => {
    const response = await api.get<ApiCategory[]>('/api/v1/categories', { params });
    return response.data;
  },

  // Get category by ID
  getById: async (id: string): Promise<ApiCategory> => {
    const response = await api.get<ApiCategory>(`/api/v1/categories/${id}`);
    return response.data;
  },

  // Get categories as tree structure
  getTree: async (): Promise<ApiCategory[]> => {
    const response = await api.get<ApiCategory[]>('/api/v1/categories/tree');
    return response.data;
  },

  // Get only parent categories (categories with no parent)
  getParents: async (): Promise<ApiCategory[]> => {
    const response = await api.get<ApiCategory[]>('/api/v1/categories/parents');
    return response.data;
  },

  // Get subcategories by parent ID
  getSubcategories: async (parentId: string): Promise<ApiCategory[]> => {
    const response = await api.get<ApiCategory[]>(`/api/v1/categories/subcategories/${parentId}`);
    return response.data;
  },

  // Create category (Admin only)
  create: async (data: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    parentId?: string;
    isActive?: boolean;
    sortOrder?: number;
  }): Promise<ApiCategory> => {
    const response = await api.post<ApiCategory>('/api/v1/categories', data);
    return response.data;
  },
};
