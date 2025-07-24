
export type ThemeMode = "light" | "dark";

// Enums from Prisma Schema
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}

export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK'
}

export enum AdCondition {
  NEW = 'NEW',
  LIKE_NEW = 'LIKE_NEW',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR'
}

export enum AdStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED'
}

export enum CategoryFieldType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  SELECT = 'SELECT',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  TEXTAREA = 'TEXTAREA',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN'
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  LOCATION = 'LOCATION',
  SYSTEM = 'SYSTEM'
}

export enum InteractionType {
  VIEW = 'VIEW',
  CLICK = 'CLICK',
  CONTACT_REVEAL = 'CONTACT_REVEAL',
  PHONE_CLICK = 'PHONE_CLICK',
  EMAIL_CLICK = 'EMAIL_CLICK',
  SHARE = 'SHARE'
}

export enum NotificationType {
  AD_INTERACTION = 'AD_INTERACTION',
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  PROMOTION = 'PROMOTION',
  SYSTEM = 'SYSTEM',
  SELLER_REVIEW = 'SELLER_REVIEW',
  AD_COMMENT = 'AD_COMMENT'
}

// Core API Types matching Prisma Schema
export interface ApiUser {
  id: string;
  email?: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  isVerified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: UserRole;
  provider: AuthProvider;
  providerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  parent?: ApiCategory;
  children?: ApiCategory[];
  fields?: CategoryField[];
}

export interface CategoryField {
  id: string;
  categoryId: string;
  name: string;
  label: string;
  type: CategoryFieldType;
  isRequired: boolean;
  options?: any; // JSON field from Prisma
  validation?: any; // JSON field from Prisma
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiAd {
  id: string;
  title: string;
  description: string;
  price?: number;
  currency: string;
  condition?: AdCondition;
  images: string[];
  videos: string[];
  status: AdStatus;
  isPromoted: boolean;
  promotionEnds?: string;
  views: number;
  userId: string;
  categoryId: string;
  cityId?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  contactPhone?: string;
  contactEmail?: string;
  isNegotiable: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: ApiUser;
  category?: ApiCategory;
  city?: City;
  fieldValues?: AdFieldValue[];
  savedBy?: SavedAd[];
}

export interface AdFieldValue {
  id: string;
  adId: string;
  categoryFieldId: string;
  value: string;
  createdAt: string;
  categoryField?: CategoryField;
}

export interface SavedAd {
  id: string;
  userId: string;
  adId: string;
  createdAt: string;
  user?: ApiUser;
  ad?: ApiAd;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  states?: State[];
}

export interface State {
  id: string;
  name: string;
  code?: string;
  countryId: string;
  createdAt: string;
  country?: Country;
  cities?: City[];
}

export interface City {
  id: string;
  name: string;
  stateId: string;
  createdAt: string;
  state?: State;
}

export interface Chat {
  id: string;
  senderId: string;
  receiverId: string;
  adId?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: ApiUser;
  receiver?: ApiUser;
  messages?: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: MessageType;
  attachments: string[];
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  sender?: ApiUser;
  receiver?: ApiUser;
  chat?: Chat;
}

export interface AdComment {
  id: string;
  adId: string;
  userId: string;
  content: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  ad?: ApiAd;
  user?: ApiUser;
  parent?: AdComment;
  replies?: AdComment[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: any; // JSON field
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  user?: ApiUser;
}

// Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email?: string;
  phone?: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CreateAdRequest {
  title: string;
  description: string;
  price?: number;
  currency?: string;
  condition?: AdCondition;
  categoryId: string;
  cityId?: string;
  images?: string[];
  videos?: string[];
  address?: string;
  latitude?: number;
  longitude?: number;
  contactPhone?: string;
  contactEmail?: string;
  isNegotiable?: boolean;
  fieldValues?: Array<{
    categoryFieldId: string;
    value: string;
  }>;
}

export interface UpdateAdRequest {
  title?: string;
  description?: string;
  price?: number;
  condition?: AdCondition;
  isNegotiable?: boolean;
  images?: string[];
  videos?: string[];
  address?: string;
  latitude?: number;
  longitude?: number;
  contactPhone?: string;
  contactEmail?: string;
  fieldValues?: Array<{
    categoryFieldId: string;
    value: string;
  }>;
}

export interface AuthResponse {
  access_token: string;
  user: ApiUser;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateChatRequest {
  participantId: string;
  adId?: string;
  initialMessage?: string;
}

export interface SendMessageRequest {
  content: string;
  type?: MessageType;
  attachments?: string[];
}

export interface CreateCommentRequest {
  adId: string;
  content: string;
  parentId?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
}

// Legacy types for backward compatibility (will be gradually replaced)
export type Picture = {
  thumbnail: string;
  full: string;
}

export type Product = ApiAd; // Alias for backward compatibility
export type Category = ApiCategory; // Alias for backward compatibility
export type User = ApiUser; // Alias for backward compatibility

export type AccountProvider = AuthProvider; // Alias for backward compatibility

export type Suggestion = {
  id: string;
  keyword: string;
  product_id: number;
  category_id: number;
  category_field_id: number;
  is_recent?: boolean;
};

export type Field = CategoryFieldType; // Alias for backward compatibility

export type ProductSpec = {
  id: number,
  name: string,
  field: Field,
  value: string | string[] | number;
};

export type Comment = AdComment; // Alias for backward compatibility

export type Thread = {
  id: number,
  product_id: number;
  user_id: number;
  body: string;
  replies: Comment[];
  user_name: string,
  avatar_url?: string,
}
