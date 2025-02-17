import { Linking, StyleSheet, View } from "react-native";
import ImageSlider from "../ImageSlider";
import { Button, Icon, lightColors, Text, Chip } from "@rneui/themed";
import { useState } from "react";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useAuthModal } from "@/lib/auth/AuthModelProvider";
import React from "react";
import { Post } from "@/hooks/store/useFetchPosts";

export default function PostSlider({
  post,
  onImagePress,
}: {
  post: Post;
  onImagePress: (index: number) => void;
}) {
  const [viewPhone, setViewPhone] = useState(false);
  const { user } = useAuth();
  const { showLoginModal } = useAuthModal();

  const handleCall = async () => {
    if (!user) return showLoginModal();

    await Linking.openURL(`tel:${post.phone}`);
  };
  const handleChat = () => {
    if (!user) return showLoginModal();
    router.push({ pathname: "/ads/chat", params: { postId: post.id } });
  };

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
        <Text style={styles.date}>{post.created_at_formatted}</Text>
      </View>

      {/* Post Details */}
      <View style={styles.infoContainer}>
        <Text numberOfLines={3} style={styles.title}>
          {post.title}
        </Text>
        <Text style={styles.price}>{post.price_formatted}</Text>

        <View style={styles.actions}>
          <Button
            type="outline"
            icon={{ name: "chat-bubble-outline", color: lightColors.primary }}
            radius={15}
            size="sm"
            title={"Make an Offer"}
            titleStyle={{ fontWeight: "600" }}
            containerStyle={{ width: "50%" }}
            onPress={handleChat}
          />
          <Button
            onPress={viewPhone ? () => handleCall() : () => setViewPhone(true)}
            color={lightColors.primary}
            icon={{ name: viewPhone ? "wifi-calling" : "call", color: "white" }}
            title={viewPhone ? post.phone : "Call"}
            radius={15}
            size="sm"
            containerStyle={{ width: "50%" }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  infoContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  price: {
    fontSize: 16,
    color: "#4682b4",
    fontWeight: "600",
    marginVertical: 10,
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  location: {
    fontSize: 12,
    color: "#444",
    fontWeight: "600",
    marginLeft: 4,
  },
  date: {
    fontSize: 12,
    color: "#444",
    fontWeight: "600",
    marginLeft: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 10,
  },
});
