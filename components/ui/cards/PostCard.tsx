import React, { memo } from "react";
import {
  View,
  StyleSheet,
  DimensionValue,
  TouchableOpacity,
  GestureResponderEvent,
  ViewStyle,
} from "react-native";
import { Text, Icon, lightColors } from "@rneui/themed";
import { Image } from "expo-image";
import { CountLabel } from "./CountLabel";
import SavedButton from "./SavedButton";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Post } from "@/hooks/store/useFetchPosts";

const PostCard = ({
  post,
  size = "100%",
  onPress,
  toggleSaved,
  style,
}: {
  post: Post;
  size?: DimensionValue;
  onPress?: (event: GestureResponderEvent) => void;
  toggleSaved?: (id: number) => void;
  style?: ViewStyle;
}): React.JSX.Element => {
  const placeholder = require("@/assets/images/Loading_icon.gif");
  const { user } = useAuth();

  return (
    <TouchableOpacity activeOpacity={0.75} style={style} onPress={onPress}>
      <View style={[styles.card, { width: size }]}>
        {/* Post Image */}
        <Image
          style={styles.image}
          contentFit="fill"
          source={post.picture.url.medium}
          cachePolicy="memory"
          placeholder={placeholder}
          placeholderContentFit="contain"
        />

        {/* Count Label */}
        <CountLabel
          total={post.count_pictures}
          style={styles.countLabel}
          variant="dark"
        />

        <View style={styles.infoContainer}>
          {/* Post Details */}
          <Text numberOfLines={2} style={styles.title}>
            {post.title}
          </Text>

          <View style={styles.priceSection}>
            <Text style={styles.price_formatted}>{post.price_formatted}</Text>
            <SavedButton
              active={
                !!user &&
                post.savedByLoggedUser &&
                !!post.savedByLoggedUser.find((save) => save.user_id == user.id)
              }
              onPress={() => toggleSaved && toggleSaved(post.id)}
            />
          </View>

          {post.city && (
            <View style={styles.locationContainer}>
              <Icon
                name="map-marker"
                type="font-awesome"
                color="#888"
                size={12}
              />
              <Text style={styles.location}>{post.city.name}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(PostCard);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 0,
    overflow: "hidden",
    borderWidth: 0,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    backgroundColor: lightColors.white,
    shadowRadius: 3,
  },
  image: {
    minHeight: 150,
    width: "100%",
  },
  infoContainer: {
    padding: 8,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "400",
    color: "#333",
  },
  priceSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  price_formatted: {
    fontSize: 16,
    color: "#4682b4",
    fontWeight: "600",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  location: {
    fontSize: 12,
    color: "#444",
    fontWeight: "400",
    marginLeft: 4,
  },
  countLabel: {
    position: "absolute",
    top: 8,
    left: 8,
  },
});
