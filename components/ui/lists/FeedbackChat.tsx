import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Icons for like button
import { lightColors } from "@rneui/base";
import { Button, Text } from "@rneui/themed";
import ChatCard, { Message } from "@/components/ui/cards/ChatCard";
import TextInput from "@/components/inputs/TextInput";
import { Thread } from "@/hooks/store/useFetchThreads";
import { useAuth } from "@/lib/auth/AuthProvider";

const FeedbackChat = ({
  data,
  thread,
  onViewAll,
}: {
  onViewAll?: (e?: any) => void;
  data: Array<Message>;
  thread?: Thread;
}) => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<Array<Message>>(data);
  const sendMessage = (text: string) => {
    if (!text) return;

    if (thread) {
      // add message to thread
      // start an new thread
      const last = result[result.length - 1];

      setResult([
        ...result,
        {
          id: (last ? last.id : 0) + 1,
          text,
          sender: user?.name,
          date: new Date().toISOString(),
        },
      ]);
    } else {
      // start an new thread
      const last = result[result.length - 1];

      setResult([
        {
          id: (last ? last.id : 0) + 1,
          text,
          sender: user?.name,
          date: new Date().toISOString(),
        },
        ...result,
      ]);
    }
    setMessage("");
    Keyboard.dismiss();
  };
  const renderMessage = ({ item }: { item: any }) => <ChatCard item={item} />;

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.listContainer}
        inverted
        ListHeaderComponent={
          null && (
            <View style={styles.header}>
              <Text style={styles.headerText}>{data.length} Feedbacks</Text>

              <TouchableOpacity
                onPress={onViewAll}
                style={styles.viewAllButton}
              >
                <Text style={styles.viewAllText}>View all</Text>
                <FontAwesome
                  name="chevron-right"
                  size={14}
                  color={lightColors.primary}
                />
              </TouchableOpacity>
            </View>
          )
        }
        data={result}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />

      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={70}>
        <TextInput
          placeholder="Write your message here"
          value={message}
          onChangeText={setMessage}
          style={{ height: "auto", minHeight: 50 }}
          multiline
          containerStyle={{ height: "auto" }}
          inputContainer={{ height: "auto", maxHeight: 100 }}
          rightIcon={
            <Button
              icon={{ name: "send", color: lightColors.primary }}
              size={"sm"}
              color={lightColors.white}
              onPress={() => sendMessage(message)}
            />
          }
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 10,
  },
  messageContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#E0F7FA",
    borderRadius: 15,
    padding: 10,
    overflow: "hidden",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
  },
  senderText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
    backgroundColor: "#B3E5FC",
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  messageText: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    marginTop: 5,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  actionText: {
    fontSize: 13,
    color: "#888",
  },
  readMoreText: {
    color: "#0288D1",
    fontSize: 13,
    marginTop: 2,
  },
  repliesContainer: {
    paddingLeft: 50,
    marginTop: 10,
  },
  replyRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  replyContent: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 10,
    marginBottom: 10,
    justifyContent: "space-between",
  },
  headerText: {
    color: lightColors.primary,
    padding: 4,
  },
  viewAllButton: {
    flexDirection: "row",
    gap: 4,
    alignItems: "baseline",
    padding: 4,
  },
  viewAllText: {
    fontSize: 16,
    color: lightColors.primary,
  },
});

export default FeedbackChat;
