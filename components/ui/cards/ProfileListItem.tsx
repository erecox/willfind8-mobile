import { Avatar, Icon, lightColors, ListItem, Text } from "@rneui/themed";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import CustomAvatar from "../CustomAvatar";
import moment from "moment";
import React from "react";

export default function ProfileListItem({
  name,
  title,
  message,
  imageUrl,
  date,
  onPress,
  titleStyle,
  titleStyle2,
  isRead,
}: {
  name?: string;
  title: string;
  message?: string;
  imageUrl?: string | null;
  date?: string;
  onPress?: (e: any) => void;
  titleStyle?: StyleProp<TextStyle>;
  titleStyle2?: StyleProp<TextStyle>;
  isRead?: boolean;
}) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <ListItem
        containerStyle={[!isRead && { backgroundColor: "#0808080f" }]}
        bottomDivider
      >
        <CustomAvatar rounded source={imageUrl} size={40} />
        <ListItem.Content>
          {name && (
            <ListItem.Title
              style={[{ fontSize: 14, fontWeight: "600" }, titleStyle]}
            >
              {name}
            </ListItem.Title>
          )}
          {date && <Text style={styles.date}>{moment(date).fromNow()}</Text>}
          {title && (
            <ListItem.Title
              style={[{ color: lightColors.primary }, titleStyle2]}
            >
              {title}
            </ListItem.Title>
          )}
          <ListItem.Subtitle
            style={{ color: lightColors.grey2, fontSize: 14 }}
            numberOfLines={1}
          >
            {message}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  date: {
    position: "absolute",
    end: 0,
    top: 0,
    fontSize: 12,
  },
  icon: {
    position: "absolute",
    end: 16,
    top: 16,
  },
});
