import React, { memo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  ViewStyle,
  DimensionValue,
  Linking,
} from "react-native";
import { Card, Text, Icon, ButtonGroup, lightColors } from "@rneui/themed";
import { Image } from "expo-image";
import { CountLabel } from "./CountLabel";
import SavedButton from "./SavedButton";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useAuthModal } from "@/lib/auth/AuthModelProvider";
import { router } from "expo-router";
import { Post } from "@/hooks/store/useFetchPosts";
import DeleteButton from "./DeleteButton";
import { useActionSheet } from "@expo/react-native-action-sheet";

const PostCardLandscape = ({
  post,
  size = "100%",
  onPress,
  style,
  toggleSaved,
  deleteSaved,
  showMenu,
  hideSave,
  deletePost,
}: {
  post: Post;
  size: DimensionValue;
  onPress: (event?: GestureResponderEvent) => void;
  toggleSaved?: (id: number) => void;
  deleteSaved?: (id: number) => void;
  deletePost?: (id: number) => void;
  hideSave?: boolean;
  onDelete?: (id: number) => void;
  style?: ViewStyle;
  showMenu?: boolean;
}): React.JSX.Element => {
  const placeholder = require("@/assets/images/Loading_icon.gif");
  const { isAuthenticated, user } = useAuth();
  const { showLoginModal } = useAuthModal();

  const handleButtons = async (index: number) => {
    if (!isAuthenticated) return showLoginModal();
    if (index === 0) {
      await Linking.openURL(`tel:${post?.phone}`);
    } else if (index === 1) {
      router.push({ pathname: "/ads/chat", params: { postId: post?.id } });
    }
  };

  const { showActionSheetWithOptions } = useActionSheet();
  const openMenu = () => {
    const options = ["Delete", "Disable", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex: any) => {
        switch (selectedIndex) {
          case 1:
            // Save
            break;

          case destructiveButtonIndex:
            // Delete
            if (deletePost) deletePost(post.id);
            break;

          case cancelButtonIndex:
          // Canceled
        }
      }
    );
  };

  return (
    <TouchableOpacity activeOpacity={0.75} style={style} onPress={onPress}>
      <Card
        wrapperStyle={{
          flexDirection: "row",
          padding: 0,
          paddingStart: 0,
          paddingEnd: 0,
        }}
        containerStyle={[styles.card, { width: size }]}
      >
        {/* Post Image */}
        <Image
          style={[styles.image, { width: "40%" }]}
          contentFit="cover"
          source={post?.picture?.url?.medium}
          cachePolicy={"memory"}
          placeholder={placeholder}
          placeholderContentFit="contain"
        />
        {/* Count Label */}
        <CountLabel
          total={post?.count_pictures}
          style={styles.countLabel}
          variant={"dark"}
        />
        <View style={{ flex: 1 }}>
          {/* Post Details */}
          <View style={styles.infoContainer}>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                justifyContent: "space-between",
              }}
            >
              <Text numberOfLines={2} style={styles.title}>
                {post?.title}
              </Text>
              {showMenu && (
                <Icon name="more-horiz" size={28} onPress={openMenu} />
              )}
            </View>
            <View style={styles.priceSection}>
              <Text style={styles.price_formatted}>{post?.price_formatted}</Text>

              {hideSave ? (
                <DeleteButton
                  onPress={() => deleteSaved && deleteSaved(post?.id)}
                />
              ) : (
                <SavedButton
                  active={
                    !!user &&
                    post?.savedByLoggedUser &&
                    !!post?.savedByLoggedUser.find(
                      (save) => save.user_id == user.id
                    )
                  }
                  onPress={() => toggleSaved && toggleSaved(post.id)}
                />
              )}
            </View>
            <View style={styles.locationContainer}>
              <Icon
                name="map-marker"
                type="font-awesome"
                color="#888"
                size={12}
              />
              <Text style={styles.location}>{post?.city?.name}</Text>
            </View>
          </View>
          <ButtonGroup
            containerStyle={{ borderColor: lightColors.warning }}
            buttonStyle={{
              borderColor: lightColors.warning,
              borderWidth: 0,
            }}
            innerBorderStyle={{ width: 0 }}
            selectedButtonStyle={{
              backgroundColor: lightColors.warning,
              borderWidth: 0,
            }}
            selectedIndex={0}
            buttons={[
              <Icon name="call" color={lightColors.white} />,
              <Icon name="chat" color={lightColors.warning} />,
            ]}
            onPress={handleButtons}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default memo(PostCardLandscape);

const styles = StyleSheet.create({
  card: {
    padding: 0,
    margin: 0,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 0,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  image: {
    height: 150,
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
  },
  price_formatted: {
    fontSize: 16,
    color: "#4682b4",
    fontWeight: "600",
    marginVertical: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
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
