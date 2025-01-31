import React, { useEffect, useRef } from "react";
import { Button, lightColors } from "@rneui/themed";
import { router, Stack } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { View } from "react-native";

import PostCardLandscape from "@/components/ui/cards/PostCardLandscape";
import DescriptionCard from "@/components/ui/cards/DescriptionCard";
import ChatWithSellerCard from "@/components/ui/cards/ChatWithSellerCard";
import SellerAdsList from "@/components/ui/lists/SellerAdsList";
import { useRouteInfo } from "expo-router/build/hooks";
import PostSlider from "@/components/ui/cards/PostSlider";
import { EmptyListingCard } from "@/components/ui/cards/EmptyListingCard";
import usePostStore from "@/hooks/store/useFetchPosts";
import PostSepecCard from "@/components/ui/cards/PostSepecCard";
import LoadingBar from "@/components/ui/cards/LoadingBar";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useAuthModal } from "@/lib/auth/AuthModelProvider";
import SavedButton from "@/components/ui/cards/SavedButton";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Alert } from "react-native";
import { useReportSeller } from "@/components/inputs/ReportSellerModal";

export default function DetailsLayout() {
  const route = useRouteInfo();
  const { user } = useAuth();
  const { openSheet, closeSheet } = useReportSeller();
  const { showLoginModal } = useAuthModal();
  const { id } = route.params;
  const postId = parseInt(id?.toString());
  const {
    items,
    relatedPosts,
    loadingStates,
    pagination,
    error,
    fetchRelatedPosts,
    fetchPost,
    fetchSellerPosts,
    addToSavedPost,
    sellerPosts,
    extras,
  } = usePostStore();
  const post = items[postId];

  const userPosts = sellerPosts[post?.user_id]?.map((id) => items[id]);
  const rPosts = relatedPosts[postId]?.map((id) => items[id]);
  const sepecs = useRef<
    Array<{ id: number; name: string; value: string; type: string }>
  >([]);

  useEffect(() => {
    fetchRelatedPosts(postId, {
      sort: "created_at",
      op: "similar",
      perPage: 10,
    });
  }, [fetchRelatedPosts]);

  useEffect(() => {
    fetchPost(postId, { detailed: 1 });
  }, [fetchPost]);

  useEffect(() => {
    const sps = [];
    for (const id in post?.extra?.fieldsValues) {
      const field = post.extra.fieldsValues[id];
      sps.push(field);
    }
    sepecs.current = sps;
  }, [post]);

  useEffect(() => {
    if (post && post.user)
      fetchSellerPosts(post.user?.id, {
        sort: "created_at",
        op: "latest",
        perPage: 5,
      });
  }, [fetchSellerPosts]);

  const loadMore = () => {
    if (pagination.related.hasMore && !loadingStates.fetchRelated)
      fetchRelatedPosts(postId, {
        sort: "created_at",
        op: "search",
        perPage: 10,
      });
  };

  const handleToggleSaved = (postId: number) => {
    if (user) addToSavedPost(postId, user);
    else showLoginModal();
  };

  const { showActionSheetWithOptions } = useActionSheet();
  const openMenu = () => {
    const options = [
      "Report this seller",
      "Hide ads from this seller",
      "Cancel",
    ];
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
            Alert.alert(
              "Are you sure?",
              "You would not be seeing ads from this seller.",
              [
                { text: "Yes", style: "destructive" },
                { text: "Cancel", style: "cancel" },
              ]
            );
            break;

          case destructiveButtonIndex:
            openSheet();
            break;

          case cancelButtonIndex:
          // Canceled
        }
      }
    );
  };

  if (!post) return null;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: post?.title,
          headerRight: () => (
            <View style={{ flexDirection: "row" }}>
              <SavedButton
                active={
                  !!user &&
                  post.savedByLoggedUser &&
                  !!post.savedByLoggedUser.find(
                    (save) => save.user_id == user.id
                  )
                }
                onPress={() => handleToggleSaved(postId)}
              />
              <Button
                onPress={openMenu}
                type="clear"
                buttonStyle={{ paddingHorizontal: 4 }}
                icon={{ name: "more-horiz" }}
              />
            </View>
          ),
        }}
      />

      <FlatList
        contentContainerStyle={{
          gap: 8,
          paddingBottom: 20,
        }} // Adds padding to account for sticky search bar and header
        style={styles.container}
        ListHeaderComponent={
          <View style={{ gap: 10 }}>
            <PostSlider
              onImagePress={(index) => {
                router.push({
                  pathname: "../ads/fullscreen",
                  params: { imageIndex: index, postId },
                });
              }}
              {...post}
            />
            <PostSepecCard list={sepecs.current} />
            <DescriptionCard htmlContent={post?.description} />
            <ChatWithSellerCard />
            <SellerAdsList
              extra={extras.seller}
              post={post}
              userPosts={userPosts}
            />
          </View>
        }
        ListEmptyComponent={
          loadingStates.fetchRelated ? null : EmptyListingCard
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: any) => {
          return (
            <PostCardLandscape
              size={"100%"}
              post={item}
              style={{ paddingHorizontal: 10 }}
              onPress={() =>
                router.push({
                  pathname: "../ads/details",
                  params: { id: item.id },
                })
              }
            />
          );
        }}
        keyExtractor={(item: any) => item.id}
        data={rPosts}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingStates.fetchRelated ? (
            <View style={{ paddingVertical: 30 }}>
              <ActivityIndicator size="small" />
            </View>
          ) : error ? (
            <View style={{ paddingVertical: 50 }}>
              <Button
                onPress={() => {
                  loadMore();
                }}
                type="clear"
                title={"Try again"}
                icon={{ name: "replay" }}
              />
            </View>
          ) : null
        }
        initialNumToRender={10}
        removeClippedSubviews
      />
      <LoadingBar
        style={{ position: "absolute", top: 0, zIndex: 100 }}
        loading={loadingStates.fetchPost}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stickySearchArea: {
    justifyContent: "center",
    backgroundColor: lightColors.primary,
    zIndex: 1, // Ensure the search bar stays visible after header fades out
  },
});
