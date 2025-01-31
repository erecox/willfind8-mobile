// components/ProfileHeader.js
import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Button, lightColors, Text } from "@rneui/themed";
import CustomAvatar from "./CustomAvatar";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";

const ProfileHeader = ({
  name,
  email,
  phone,
  avatarUrl,
  onPress,
  joined,
  showButtons,
  location,
  style,
}: {
  name?: string;
  email?: string;
  phone?: string;
  joined?: string | null;
  location?: string;
  avatarUrl?: string | null;
  showButtons?: boolean;
  onPress?: (e: any) => void;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.headerContainer, style]}
    >
      <CustomAvatar
        size={100}
        rounded
        source={{
          uri: avatarUrl || null,
        }}
        containerStyle={styles.avatar}
      />
      <View style={{ marginTop: 10 }}>
        <Text h4>{name || ""}</Text>
        <Text selectable style={{ color: lightColors.grey1 }}>
          {email || ""}
        </Text>
        {location && (
          <Text style={{ fontSize: 12 }}>
            <Ionicons name="location" /> {location || ""}
          </Text>
        )}
        {showButtons && (
          <View style={styles.buttons}>
            <Button
              type="outline"
              size="lg"
              radius={5}
              icon={{ name: "chat", color: lightColors.primary }}
              title={"Chat"}
              containerStyle={{ flex: 1 }}
            />

            {phone && (
              <Button
                size="lg"
                radius={5}
                icon={{ name: "call", color: "white" }}
                title={"Call"}
                containerStyle={{ flex: 1 }}
              />
            )}
          </View>
        )}
      </View>
      <Text style={styles.date}>
        Joined {joined || moment(joined).fromNow()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  avatar: {
    marginRight: 15,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
    width: "100%",
  },
  date: {
    position: "absolute",
    end: 15,
    top: 10,
    fontSize: 12,
    fontWeight: "400",
    color: lightColors.grey3,
  },
});

export default ProfileHeader;
