import { create } from "zustand";
import api from "@/lib/apis/api"; // Adjust the path as needed
import { Post } from "./useFetchPosts";
import { User } from "./useFetchAuth";

interface Meta {
  current_page: number;
  last_page: number;
}

interface ResponseData {
  success: boolean;
  message: string | null;
  result: {
    data: ThreadMessage[];
    meta: Meta;
  };
}

export interface Recipient {
  id: number;
  thread_id: number;
  user_id: number;
  last_read: string | null;
  is_important: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  created_at_formatted: string;
}

export interface Message {
  id: number;
  thread_id: number;
  user_id: number;
  body: string;
  filename: string | null;
  deleted_by: null;
  deleted_at: null;
  created_at: string;
  updated_at: string;
  created_at_formatted: string;
  p_recipient: Recipient;
}

// Interfaces for Messsage Data
export interface ThreadMessage {
  id: number;
  post_id: number;
  subject: string;
  updated_at: string;
  p_is_unread: boolean;
  p_creator: User;
  p_is_important: boolean;
  post?: Post;
  latest_message: LatestMessage;
}

interface LatestMessage {
  id: number;
  thread_id: number;
  user_id: number;
  body: string;
  created_at: string;
  updated_at: string;
  created_at_formatted: string;
}

interface Creator {
  id: number;
  name: string;
  email: string;
  username: string;
  photo_url: string | null;
}

// Zustand Store Interface
interface ThreadsState {
  threads: ThreadMessage[]; // Store all thread data
  unreadIds: Set<number>;
  importantIds: Set<number>;
  startedIds: Set<number>;
  meta: Meta | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  currentPage: number;
  fetchThreads: (
    filter?: "unread" | "important" | "started",
    page?: number,
    embed?: string | "user,post,messages,participants"
  ) => Promise<void>;
  toggleFilter: (
    threadId: number,
    filterType: "unread" | "important" | "started",
    status: boolean
  ) => void;
}

// Zustand Store
export const useThreadsStore = create<ThreadsState>((set, get) => ({
  threads: [],
  unreadIds: new Set(),
  importantIds: new Set(),
  startedIds: new Set(),
  meta: null,
  isLoading: false,
  isLoadingMore: false,
  hasMore: true,
  error: null,
  currentPage: 1,

  fetchThreads: async (
    filter?: "unread" | "important" | "started",
    page: number | null = null,
    embed = "user,post,messages,participants"
  ) => {
    const { currentPage, hasMore } = get();
    const nextPage = page || currentPage;

    // Prevent fetching if no more pages
    if (!hasMore) return;

    set({
      isLoading: nextPage === 1,
      isLoadingMore: nextPage > 1,
      error: null,
    });

    try {
      const response = await api.get<ResponseData>(`/api/threads`, {
        params: { page, embed, filter },
      });
      const { success, result, message } = response.data;

      if (success) {
        const { data, meta } = result;

        set((state) => {
          // Update thread list
          const updatedThreads =
            nextPage === 1 ? data : [...state.threads, ...data];

          // Track IDs for the selected filter
          const filterIds =
            filter === "unread"
              ? new Set(
                  data
                    .filter((thread) => thread.p_is_unread)
                    .map((thread) => thread.id)
                )
              : filter === "important"
              ? new Set(
                  data
                    .filter((thread) => thread.p_is_important)
                    .map((thread) => thread.id)
                )
              : new Set(
                  data
                    .filter((thread) => thread.p_creator)
                    .map((thread) => thread.id)
                );

          return {
            threads: updatedThreads,
            unreadIds: filter === "unread" ? filterIds : state.unreadIds,
            importantIds:
              filter === "important" ? filterIds : state.importantIds,
            startedIds: filter === "started" ? filterIds : state.startedIds,
            meta,
            isLoading: false,
            isLoadingMore: false,
            hasMore: nextPage < meta.last_page,
            currentPage: nextPage + 1,
          };
        });
      } else {
        throw new Error(message || "Failed to fetch threads");
      }
    } catch (error: any) {
      set({
        error: error.message || "An unexpected error occurred",
        isLoading: false,
        isLoadingMore: false,
      });
    }
  },

  toggleFilter: (threadId, filterType, status) => {
    set((state) => {
      const filterSet =
        filterType === "unread"
          ? state.unreadIds
          : filterType === "important"
          ? state.importantIds
          : state.startedIds;

      const newFilterSet = new Set(filterSet);

      if (status) {
        newFilterSet.add(threadId);
      } else {
        newFilterSet.delete(threadId);
      }

      return {
        [`${filterType}Ids`]: newFilterSet,
      };
    });
  },
}));
