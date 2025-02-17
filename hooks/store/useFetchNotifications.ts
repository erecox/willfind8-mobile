import { create } from "zustand";
import { Post } from "./useFetchPosts";
import { User } from "./useFetchUsers";
import api from "@/lib/apis/api";
import * as Notifications from "expo-notifications";
import { mergeBy, mergeById } from "./mergeUtils";

export interface Notification {
  id: number;
  title: string;
  subtitle: string | null;
  body: string;
  status: "pending" | "delivered" | "read" | "failed";
  data?: {
    user?: User | null;
    post?: Post;
    type: "post_notification" | "user_notification";
  };
}
interface Params {
  page?: number;
  embed?: string;
  sort?: "created_at" | "-created_at";
  perPage?: number;
}

interface ApiResponse<T> {
  success: boolean;
  result: T & {
    current_page: number;
    data: T;
    last_page: number;
    total: number;
  };
  message: string;
  ids: number[];
}

interface NotificationStore {
  items: Notification[];
  page: number;
  badgeCount: number;
  hasMore: boolean;
  loadingStates: {
    fetchLatest: boolean;
  };
  error: string | null;
  fetchLatestNotifications: (params?: Params) => Promise<void>;
  fetchMoreNotifications: () => void;
  deleteAllNotifications: () => void;
  updateBadgeCount: () => void;
  clearError: () => void;
  setState: (state: any) => void;
}

interface NotificationStoreWithAbort extends NotificationStore {
  abortController: AbortController | null;
  abortRequests: () => void;
}

export const useNotificationStore = create<NotificationStoreWithAbort>(
  (set: any, get: any) => ({
    items: [],
    badgeCount: 0,
    hasMore: true,
    page: 1,
    loadingStates: {
      fetchLatest: false,
    },
    error: null,
    abortController: null,
    fetchLatestNotifications: async (params?: Params) => {
      const { fetchLatest } = get().loadingStates;
      if (fetchLatest) return;

      set({ loadingStates: { fetchLatest: true }, error: null });

      const controller = new AbortController();
      get().abortController = controller;
      const page = get().page;
      try {
        const response = await api.get<ApiResponse<Notification[]>>(
          "/api/expo/notifications",
          {
            signal: controller.signal,
            params: { page, perPage: 10, ...params },
          }
        );
        const data = response.data;

        if (data.success) {
          const items = data.result.data;
          const hasMore = data.result.current_page < data.result.last_page;
          const oldItems = get().items;
          set({
            items: mergeBy(oldItems, items, (a, b) => a.id === b.id),
            page: page + 1,
            hasMore,
            loadingStates: { fetchLatest: false },
          });
        } else {
          set({ error: data.message, loadingStates: { fetchLatest: false } });
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          set({
            error: error.message,
            loadingStates: { fetchLatest: false },
            hasMore: false,
          });
        }
      }
    },
    fetchMoreNotifications: () => {
      const { hasMore, page } = get();
      const pageNum = page === 1 ? page : page - 1;

      set({ hasMore: true, page: hasMore ? page : pageNum });
      get().fetchLatestNotifications();
    },
    clearError: () => set({ error: null }),
    setState: (state: any) => set(state),
    deleteAllNotifications: () => {
      set({ loadingStates: { fetchLatest: true }, error: null });
      api
        .delete(`/api/expo/notifications/all`)
        .then((response) => {
          const { success, message } = response.data;
          if (success) {
            set({
              items: [],
              page: 1,
              loadingStates: { fetchLatest: false },
              error: null,
            });
          }
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            set({
              error: error.message,
              loadingStates: { fetchLatest: false },
            });
          }
        });
    },
    updateBadgeCount: () => {
      Notifications.getBadgeCountAsync()
        .then((badge) => {
          set({ badgeCount: badge });
        })
        .catch((err) => {
         set({ badgeCount: 0 });
        });
    },
    abortRequests: () => {
      if (get().abortController) {
        get().abortController.abort();
        set({ abortController: null });
      }
    },
  })
);
