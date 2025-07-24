import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as SecureStorage from "expo-secure-store";
import { ApiUser, LoginRequest, RegisterRequest } from "@/types";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { authService } from "@/utils/authService";

type AuthState = {
  user: ApiUser | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: ApiUser | null) => void;
  clearUser: () => void;
  setAccessToken: (token: string | null) => void;
  clearAccessToken: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  loginAsync: (credentials: LoginRequest) => Promise<void>;
  registerAsync: (userData: RegisterRequest) => Promise<void>;
  refreshTokenAsync: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      accessToken: null,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setAccessToken: (token) => set({ accessToken: token }),
      clearAccessToken: () => set({ accessToken: null }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      
      loginAsync: async (credentials: LoginRequest) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.login(credentials);
          
          // Store token in secure storage
          await SecureStorage.setItemAsync("accessToken", response.access_token);
          
          set({ 
            user: response.user, 
            accessToken: response.access_token, 
            isLoggedIn: true,
            isLoading: false 
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Login failed';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      registerAsync: async (userData: RegisterRequest) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.register(userData);
          
          // Store token in secure storage
          await SecureStorage.setItemAsync("accessToken", response.access_token);
          
          set({ 
            user: response.user, 
            accessToken: response.access_token, 
            isLoggedIn: true,
            isLoading: false 
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      refreshTokenAsync: async () => {
        try {
          const response = await authService.refreshToken();
          
          // Store new token in secure storage
          await SecureStorage.setItemAsync("accessToken", response.access_token);
          
          set({ 
            user: response.user, 
            accessToken: response.access_token, 
            isLoggedIn: true 
          });
        } catch (error: any) {
          // If refresh fails, logout user
          await get().logout();
          throw error;
        }
      },

      logout: async () => {
        try {
          // Clear secure storage
          await SecureStorage.deleteItemAsync("accessToken");
          
          // Sign out from Google if applicable
          try {
            await GoogleSignin.signOut();
          } catch (error) {
            // Ignore Google sign out errors
          }
          
          set({ 
            user: null, 
            accessToken: null, 
            isLoggedIn: false,
            error: null 
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
      }
    }),
    {
      name: "login-user-storage",
      storage: {
        getItem: async (name: string) => {
          const value = await SecureStorage.getItemAsync(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name: string, value: any) => {
          return await SecureStorage.setItemAsync(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await SecureStorage.deleteItemAsync(name);
        },
      },
    }
  )
);
