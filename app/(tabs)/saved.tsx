import { EmptyListingCard } from "@/components/ui/cards/EmptyListingCard";
import LoadingBar from "@/components/ui/cards/LoadingBar";
import PostCardLandscape from "@/components/ui/cards/PostCardLandscape";
import usePostStore, { Post } from "@/hooks/store/useFetchPosts";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { Button, Text } from "@rneui/themed";
import { router, Tabs, useFocusEffect } from "expo-router";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { FlatList, StyleSheet, View } from "react-native";

export default function SavedScreen() {
  const { width } = useWindowDimensions();
  const { refreshUserData, user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      refreshUserData();
    }, [refreshUserData])
  );

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const {
    loadingStates,
    error: postError,
    items,
    pagination,
    savedPostIds,
    fetchSavedPosts,
    resetSavedPosts,
    addToSavedPost,
  } = usePostStore((state) => state);
  const savedPosts = savedPostIds.map((id) => items[id]);
  const [searchResults, setSearchResults] = useState<Array<Post>>();

  useEffect(() => {
    setSearchResults(savedPosts);
  }, [items]);

  const loadMorePost = () => {
    if (!loadingStates.fetchSaved && pagination.saved.hasMore)
      fetchSavedPosts({ sort: "created_at", perPage: 10 });
  };

  const removeSaved = (postId: number) => {
    if (user && !loadingStates.savePost)
      addToSavedPost(postId, user).finally(() => {
        resetSavedPosts();
        fetchSavedPosts({ page: 1, sort: "created_at", perPage: 10 });
      });
  };

  // Function to handle search
  const handleSearch = (e: any) => {
    const query = e.nativeEvent.text;
    if (query) {
      setSearchResults(
        savedPosts.filter((post) =>
          post.title.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setSearchResults(savedPosts);
    }
  };

  const handlePostClick = (item: any) =>
    router.push({ pathname: "../ads/details", params: { id: item.id } });

  return (
    <View style={styles.container}>
      <Tabs.Screen
        options={{
          headerTitle: "Saved Ads",
          headerRight: ({ tintColor, pressColor, pressOpacity }) => (
            <TouchableOpacity
              style={{ padding: 8 }}
              activeOpacity={pressOpacity}
            >
              <Ionicons
                name="ellipsis-horizontal"
                size={28}
                color={tintColor}
              />
            </TouchableOpacity>
          ),

          headerSearchBarOptions: {
            placeholder: "Search message",
            onChangeText: (text: any) => handleSearch(text),
          },
        }}
      />

      {/* Display Search Results */}
      <FlatList
        data={searchResults}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loadingStates.fetchSaved || postError ? null : EmptyListingCard
        }
        renderItem={({ item }: { item: any }) => (
          <PostCardLandscape
            onPress={() => handlePostClick(item)}
            deleteSaved={removeSaved}
            size={width - 8}
            post={item}
            hideSave
          />
        )}
        keyExtractor={(item: any) => item?.id?.toString()}
        onEndReached={loadMorePost}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          resetSavedPosts();
          fetchSavedPosts({ page: 1, perPage: 10 }).finally(() =>
            setRefreshing(false)
          );
        }}
        ListFooterComponent={
          loadingStates.fetchSaved ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size="small" />
            </View>
          ) : postError ? (
            <View style={{ paddingVertical: 50 }}>
              <Text>{postError}</Text>
              <Button
                onPress={() => {
                  loadMorePost();
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
        loading={loadingStates.savePost}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  list: {
    gap: 8,
    paddingBottom: 8,
  },
  footerSpace: {
    padding: 20,
  },
  resultItem: {
    padding: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  resultText: {
    fontSize: 16,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});
