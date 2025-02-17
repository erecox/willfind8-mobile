import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Badge } from "@rneui/themed";
import SimplePostCard from "../cards/SimplePostCard";
import { Image } from "expo-image";
import usePostStore, { Extra, Post } from "@/hooks/store/useFetchPosts";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useAuthModal } from "@/lib/auth/AuthModelProvider";

export default function SellerAdsList({
  post,
  userPosts,
  extra,
}: {
  post: Post;
  userPosts?: Array<Post>;
  extra?: Extra | null;
}) {
  const placeholder = require("@/assets/images/Loading_icon.gif");
  const { user } = useAuth();
  const { showLoginModal } = useAuthModal();

  const handleProfileClick = () => {
    if (!user) return showLoginModal();
    router.push({
      pathname: "../ads/seller",
      params: { id: post.id },
    });
  };

  if (!post) return;
  return (
    <View style={styles.container}>
      {/* Seller Info Section */}
      <TouchableOpacity
        onPress={handleProfileClick}
        style={styles.sellerInfoContainer}
      >
        <Image
          source={{ uri: post.user_photo_url }}
          style={styles.avatar}
          cachePolicy="disk" // Cache on disk for persistent storage
          placeholder={placeholder} // Optional placeholder image while loading
          contentFit="cover" // Ensures image fits properly in the avatar
        />
        <View style={styles.sellerDetails}>
          <Text style={styles.sellerName}>{post?.contact_name}</Text>
          {extra && (
            <View style={styles.sellerStats}>
              <Badge
                value={`${extra.count[0] ?? 0} active ads`}
                badgeStyle={styles.badge}
                textStyle={styles.badgeText}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Ads List Section */}
      {userPosts && (
        <FlatList
          data={userPosts.slice(0, 5)}
          horizontal
          contentContainerStyle={{ gap: 2 }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <SimplePostCard
              count_pictures={item.count_pictures}
              picture={item.picture}
              title={item.title}
              price_formatted={item.price_formatted}
              city={item.city}
              onPress={() => {
                router.push({
                  pathname: "/ads/details",
                  params: { id: item.id },
                });
              }}
            />
          )}
          showsHorizontalScrollIndicator={false}
          style={styles.adsList}
          ListFooterComponent={
            userPosts.length > 0 ? (
              <TouchableOpacity
                onPress={handleProfileClick}
                style={styles.seeAllButton}
              >
                <Text style={styles.seeAllText}>
                  See all seller's ads ({extra?.count[0] ?? 0}) ➔
                </Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  sellerInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "white",
    marginRight: 12,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sellerStats: {
    flexDirection: "row",
    marginTop: 4,
  },
  badge: {
    backgroundColor: "#e0e0e0",
    height: 24,
    padding: 4,
    marginRight: 8,
    borderRadius: 12,
  },
  badgeText: {
    color: "#606060",
    fontSize: 12,
  },
  adsList: {
    margin: 8,
  },
  seeAllButton: {
    marginTop: 12,
    padding: 10,
    alignItems: "center",
    maxWidth: 120,
    backgroundColor: "#e8f5e9",
    borderRadius: 8,
  },
  seeAllText: {
    color: "#1b5e20",
    fontSize: 16,
  },
});
