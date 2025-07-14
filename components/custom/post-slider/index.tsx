import { StyleSheet, View } from "react-native";
import { Button, Icon, lightColors, Text, Chip } from "@rneui/themed";
import React, { useState } from "react";
import { Post, User } from "@/store/types";
import { Feather } from "@expo/vector-icons";

export default function PostSlider({
  post,
  user,
  onImagePress,
  onCallPress,
  onChatPress
}: {
  post: Post;
  user?: User;
  onImagePress: (index: number) => void;
  onCallPress: () => void;
  onChatPress: () => void;
}) {
  const [showPhone, setShowphone] = useState(false);

  return (
    <View style={styles.container}>
      <ImageSlider
        count_pictures={post.count_pictures}
        onPress={(index) => onImagePress(index)}
        pictures={
          post.pictures ? post.pictures : post.picture ? [post.picture] : []
        }
      />
      {/*Post Active Status */}
      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          top: 10,
          start: 10,
        }}
      >
        {user?.id === post.user_id ? (
          <Chip
            size="sm"
            color={post.reviewed_at ? "success" : "warning"}
            title={post.reviewed_at ? "Active" : "Pending Review"}
          />
        ) : null}
      </View>
      {/* Location and Date */}
      <View style={styles.locationContainer}>
        <Text style={styles.location}>
          <Icon name="map-marker" type="font-awesome" color="#888" size={12} />{" "}
          {post.city?.name}
        </Text>
        <Text style={styles.date}><Feather name="clock" />{" "}{post.created_at_formatted}</Text>
      </View>

      {/* Post Details */}
      <View style={styles.infoContainer}>
        <Text numberOfLines={3} style={styles.title}>
          {post.title}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.price}>{post.price_formatted}</Text>
          <Text style={{ fontSize: 12, color: "#888" }}><Feather name="eye" />{" "}{post.visits} views</Text>
        </View>
        <View style={styles.actions}>
          <Button
            containerStyle={{ width: "50%" }}
            type="outline"
            icon={{ name: "chat-bubble-outline", color: lightColors.primary }}
            radius={15}
            size="sm"
            title={"Make an Offer"}
            titleStyle={{ fontWeight: "600" }}
            onPress={onChatPress}
          />
          <Button
            onPress={showPhone ? () => onCallPress() : () => setShowphone(true)}
            color={lightColors.primary}
            icon={{ name: showPhone ? "wifi-calling" : "call", color: "white" }}
            title={showPhone ? post.phone : "Call"}
            radius={15}
            size="sm"
            containerStyle={{ flex: 1 }}
          />
        </View>
      </View>
    </View>
  );
}
