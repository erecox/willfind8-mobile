// MessageBubble.tsx
import { Message } from "@/hooks/store/useFetchThreads";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MessageBubble = ({
  message,
  isUserMessage,
}: {
  message: Message;
  isUserMessage: boolean;
}) => {
  return (
    <View
      style={[
        styles.container,
        isUserMessage ? styles.userContainer : styles.otherContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUserMessage ? styles.userBubble : styles.otherBubble,
        ]}
      >
        <Text style={isUserMessage ? styles.userText : styles.otherText}>
          {message.body}
        </Text>
      </View>
      <Text style={styles.time}>{message.created_at_formatted}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  userContainer: {
    alignItems: "flex-end",
  },
  otherContainer: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 15,
  },
  userBubble: {
    backgroundColor: "#0084ff",
  },
  otherBubble: {
    backgroundColor: "#e5e5ea",
  },
  userText: {
    color: "white",
  },
  otherText: {
    color: "black",
  },
  time: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    margin: 2,
  },
});

export default MessageBubble;
