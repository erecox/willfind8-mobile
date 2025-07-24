import api from './api';
import { Chat, ChatMessage, CreateChatRequest, SendMessageRequest, PaginatedResponse } from '@/types';

export const chatService = {
  // Create a new chat
  createChat: async (data: CreateChatRequest): Promise<Chat> => {
    const response = await api.post<Chat>('/api/v1/chat', data);
    return response.data;
  },

  // Get user chats with pagination
  getUserChats: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Chat>> => {
    const response = await api.get<PaginatedResponse<Chat>>('/api/v1/chat', { params });
    return response.data;
  },

  // Get chat by ID
  getChatById: async (chatId: string): Promise<Chat> => {
    const response = await api.get<Chat>(`/api/v1/chat/${chatId}`);
    return response.data;
  },

  // Send message in chat
  sendMessage: async (chatId: string, data: SendMessageRequest): Promise<ChatMessage> => {
    const response = await api.post<ChatMessage>(`/api/v1/chat/${chatId}/messages`, data);
    return response.data;
  },

  // Get chat messages with pagination
  getChatMessages: async (chatId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ChatMessage>> => {
    const response = await api.get<PaginatedResponse<ChatMessage>>(`/api/v1/chat/${chatId}/messages`, { params });
    return response.data;
  },

  // Mark messages as read
  markMessagesAsRead: async (chatId: string): Promise<void> => {
    await api.patch(`/api/v1/chat/${chatId}/read`);
  },
};
