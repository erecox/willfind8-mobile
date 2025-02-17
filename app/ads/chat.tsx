// MessageScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { useRouteInfo } from "expo-router/build/hooks";
import MessageBubble from "@/components/ui/MessageBubble";
import ReplyInput from "@/components/ui/ReplyInput";
import api from "@/lib/apis/api";
import {
  Message,
  ThreadMessage,
  useThreadsStore,
} from "@/hooks/store/useFetchThreads";
import LoadingBar from "@/components/ui/cards/LoadingBar";
import { Image } from "expo-image";
import { useAuth } from "@/lib/auth/AuthProvider";

const chat = () => {
  const route = useRouteInfo();
  const { threadId } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadInfo, setThreadInfo] = useState<ThreadMessage | null>();
  const [loading, setLoading] = useState(false);
  const { threads } = useThreadsStore();
  const { user } = useAuth();

  useEffect(() => {
    fetchMessages();
    fetchThreadInfo();
  }, [threadId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/threads/${threadId}/messages`);
      setMessages(response.data.result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchThreadInfo = async () => {
    const id = parseInt(threadId.toString());
    setThreadInfo(threads.find((item) => item.id === id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          cachePolicy={"disk"}
          source={threadInfo?.post?.picture.url.small}
          style={styles.headerImage}
        />
        <Text style={styles.subject}>{threadInfo?.subject}</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={({ item }) => <MessageBubble message={item} isUserMessage={item.user_id===user?.id} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesContainer}
      />
      <KeyboardAvoidingView keyboardVerticalOffset={50} behavior="padding">
        <ReplyInput
          threadId={parseInt(threadId?.toString() || "")}
          onSend={fetchMessages}
        />
      </KeyboardAvoidingView>

      <LoadingBar loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#f1f1f1",
    backgroundColor: "#f9f9f9ef",
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  subject: {
    fontSize: 16,
  },
  messagesContainer: {
    padding: 15,
  },
});

export default chat;
