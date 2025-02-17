// ReplyInput.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "@/lib/apis/api";
import { Button, Icon, Text } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";

const ReplyInput = ({
  threadId,
  onSend,
}: {
  threadId: number;
  onSend: Function;
}) => {
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<any>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled) {
      setAttachment(result.assets[0]);
    }
  };

  const sendMessage = async () => {
    if (!message) return;

    const data = {
      message,
      attachment,
    };

    try {
      setMessage("");
      setAttachment(null);
      const response = await api.put(`/api/threads/${threadId}`, {
        body: data.message,
        filename: data.attachment && {
          uri: data.attachment.uri,
          name: data.attachment.fileName || "image.jpg",
          type: attachment.mimeType || "image/jpeg",
        },
      });

      setMessage("");
      setAttachment(null);
      onSend();
    } catch (error) {
      setAttachment(data.attachment);
      setMessage(data.message);
      console.error(error.response.data);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {attachment && (
          <View style={styles.attachmentsContainer}>
            <View>
              <Image
                key={attachment.uri}
                source={{ uri: attachment.uri }}
                style={styles.previewImage}
              />
              <View style={{ position: "absolute", top: -10, end: -10 }}>
                <Icon
                  name="close"
                  color={"red"}
                  style={{ backgroundColor: "white", borderRadius: 15 }}
                  type="fontawesome"
                  onPress={() => setAttachment(null)}
                />
              </View>
            </View>
          </View>
        )}

        <View style={styles.inputContainer}>
          {false && (
            <TouchableOpacity onPress={pickImage}>
              <Text style={styles.attachButton}>📎</Text>
            </TouchableOpacity>
          )}

          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            multiline
          />

          <Button
            type="clear"
            disabled={message.length === 0}
            onPress={sendMessage}
            titleStyle={{ fontWeight: "600" }}
            title={"Send"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
  },
  attachButton: {
    fontSize: 20,
    padding: 8,
  },
  sendButton: {
    fontWeight: "bold",
    color: "#0084ff",
    padding: 8,
  },
  attachmentsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  previewImage: {
    width: 50,
    height: 50,
    margin: 2,
    borderRadius: 4,
  },
});

export default ReplyInput;
