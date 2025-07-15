
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  headers: {
    "x-appapitoken": process.env.EXPO_PUBLIC_APP_API_KEY,
  },
});

// Add a request interceptor to include the auth token in the headers
api.interceptors.request.use(
  async (config) => {
    // Try to retrieve the auth token from AsyncStorage
    const authToken = await SecureStore.getItemAsync("accessToken");
    // If token exists, add it as a Bearer token to the request headers
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors or other responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle response errors globally here if needed
    return Promise.reject(error);
  }
);

export default api;
