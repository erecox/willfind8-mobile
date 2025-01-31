import { useEffect } from "react";
import usePostStore from "@/hooks/store/useFetchPosts";
import { useRouteInfo } from "expo-router/build/hooks";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import FeedbackChat from "@/components/ui/lists/FeedbackChat";
import { Message, useThreadsStore } from "@/hooks/store/useFetchThreads";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function ChatScreen() {
  const route = useRouteInfo();
  const { authToken } = useAuth();
  const postId = parseInt(route.params?.postId?.toString());
  const threadId = parseInt(route.params?.id?.toString());

  const { items } = usePostStore();
  const { threads, fetchThreads } = useThreadsStore();
  const thread = threads.find((thread) => thread.id === threadId);
  const post = items[postId]??thread?.post;
  const messages: Message[] = thread ? [thread.latest_message] : [];

  if (!post) return;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerTitle: post?.contact_name }} />
      <FeedbackChat
      
        thread={thread}
        data={messages.map((message) => ({
          id: message.id,
          text: message.body,
          date: message.updated_at,
        }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
