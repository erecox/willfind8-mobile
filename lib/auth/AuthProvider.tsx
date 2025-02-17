import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import api from "../apis/api";

// Define interfaces for user data and authentication extra data
interface UserData {
  id: number;
  name: string;
  username: string;
  country_code: string;
  language_code: string;
  user_type_id: number | null;
  gender_id: number;
  photo?: string | null;
  about?: string | null;
  auth_field: "email" | "phone" | "string";
  email: string;
  phone: string;
  phone_national: string;
  phone_country: string;
  phone_hidden: boolean;
  disable_comments?: boolean;
  ip_addr?: string;
  provider: string;
  provider_id: string;
  email_token: string | null;
  phone_token: string | null;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  accept_terms: boolean;
  accept_marketing_offers: boolean;
  time_zone: string | null;
  blocked: boolean;
  closed: boolean;
  last_activity: string | null;
  phone_intl: string;
  updated_at: string | null;
  original_updated_at: string | null;
  original_last_activity: string | null;
  created_at_formatted: string | null;
  photo_url: string | null;
  p_is_online?: boolean;
  country_flag_url?: string | null;
}

interface AuthExtraData {
  authToken: string;
  tokenType: string;
  isAdmin: boolean;
}

interface AuthContextProps {
  user: UserData | null;
  authToken: string | null;
  login: (userData: UserData, authToken: string) => void;
  updateUser: (userData: UserData) => void;
  logout: () => void;
  refreshUserData: () => Promise<void>;
  isAuthenticated: boolean;
  refreshing: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Utility functions for SecureStore
const setSecureItem = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

const getSecureItem = async (key: string) => {
  return await SecureStore.getItemAsync(key);
};

const deleteSecureItem = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};

// AuthProvider component that will wrap your app and provide authentication state
const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // On initial load, try to get user data and token from SecureStore
  useEffect(() => {
    const loadAuthData = async () => {
      const storedUser = await getSecureItem("user");
      const storedToken = await getSecureItem("authToken");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setAuthToken(storedToken);
      }
    };

    loadAuthData();
  }, []);

  // Handle login by setting user data and token
  const login = async (userData: UserData, token: string) => {
    setUser(userData);
    setAuthToken(token);
    await setSecureItem("user", JSON.stringify(userData));
    await setSecureItem("authToken", token);
  };

  const updateUser = async (userData: UserData) => {
    setUser(userData);
    await setSecureItem("user", JSON.stringify(userData));
  };

  // Handle logout by clearing user data and token
  const logout = async () => {
    await Promise.all([
      deleteSecureItem("user"),
      deleteSecureItem("authToken"),
      deleteSecureItem("pushToken"),
    ]);
    setAuthToken(null);
    setUser(null);
  };

  // Refresh user data
  const refreshUserData = async (
    embed: string = "country,userType,gender,countPostsViews,countPosts,countSavedPosts,countSavedPosts"
  ) => {
    if (!authToken || !user || refreshing) return;

    setRefreshing(true);
    try {
      const { data: responseData } = await api.get(`/api/users/${user.id}`, {
        params: { embed },
      });
      const { success, message, result } = responseData;
      if (!success) {
        console.error(responseData || "refreshUserData: No message");
        logout();
      } else {
        const updatedUser: UserData = result;
        setUser(updatedUser);
        // Persist the updated user data
        await setSecureItem("user", JSON.stringify(updatedUser));
      }
    } catch (err: any) {
      console.error("Error refreshing user data:", err.response);
    } finally {
      setRefreshing(false);
    }
  };

  // Check if the user is authenticated
  const isAuthenticated = !!authToken;

  return (
    <AuthContext.Provider
      value={{
        user,
        authToken,
        login,
        logout,
        updateUser,
        refreshUserData,
        isAuthenticated,
        refreshing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
