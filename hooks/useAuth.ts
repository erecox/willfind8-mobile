import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as SecureStorage from "expo-secure-store";
import { User } from "@/types";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setAccessToken: (token: string | null) => void;
  clearAccessToken: () => void;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      accessToken: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setAccessToken: (token) => set({ accessToken: token }),
      clearAccessToken: () => set({ accessToken: null }),
      login: (user, accessToken) => set({ user, accessToken, isLoggedIn: !!(user && accessToken) }),
      logout: async () => {
        set({ user: null, accessToken: null, isLoggedIn: false });
        await GoogleSignin.signOut();
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