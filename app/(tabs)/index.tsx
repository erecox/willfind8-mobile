import {
  View,
  StyleSheet,
  Animated,
  useWindowDimensions,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Button, Text } from "@rneui/themed";
import { useEffect, useRef, useState } from "react";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";

import CategoryGrid from "@/components/ui/lists/CategoryGrid";
import PostCardLandscape from "@/components/ui/cards/PostCardLandscape";
import SearchBar from "@/components/inputs/SearchBar";
import { EmptyListingCard } from "@/components/ui/cards/EmptyListingCard";
import usePostStore from "@/hooks/store/useFetchPosts";
import useCategoryStore from "@/hooks/store/useFetchCategories";
import { useFilterStore } from "@/hooks/store/filterStore";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useAuthModal } from "@/lib/auth/AuthModelProvider";
import React from "react";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { user } = useAuth();
  const { showLoginModal } = useAuthModal();

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<FlatList>(null); // Ref for the FlatList
  const scrollOffsetRef = useRef(0);

  const translateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -150],
    extrapolate: "clamp",
  });

  const {
    fetchCategories,
    loading: catLoading,
    categories,
    error: catError,
    categoryIds,
  } = useCategoryStore((state) => state);
  const [refreshing, setRefreshing] = useState(false);
  const {
    loadingStates,
    error: postError,
    items: PostsMap,
    latestPostIds,
    addToSavedPost,
    fetchLatestPosts,
    resetLatestPosts,
    pagination,
  } = usePostStore((state) => state);
  const { setDefaultFilters } = useFilterStore();
  const lastPressRef = useRef<number | null>(null);
  const DOUBLE_PRESS_DELAY = 300; // Double press threshold in milliseconds
  const navigation = useNavigation();
  const [homeScrollOffset, setHomeScrollOffset] = useState<number | undefined>(
    0
  );
  const loadMorePost = async () => {
    if (!pagination.latest.hasMore) return;
    await fetchLatestPosts({ perPage: 10 });
  };

  const handlePostClick = (item: any) =>
    router.push({ pathname: "../ads/details", params: { id: item.id } });

  const handleToggleSaved = (postId: number) => {
    if (!user) return showLoginModal();
    addToSavedPost(postId, user);
  };

  useEffect(() => {
    const unsubscribeBlur = navigation.addListener("blur", () => {
      setHomeScrollOffset(scrollOffsetRef.current);
    });
    return () => {
      unsubscribeBlur();
    };
  }, [navigation, setHomeScrollOffset]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", () => {
      const now = Date.now();
      if (
        lastPressRef.current &&
        now - lastPressRef.current < DOUBLE_PRESS_DELAY
      ) {
        scrollRef.current?.scrollToOffset({ animated: true, offset: 0 }); // Scroll to the top
      }
      lastPressRef.current = now;
    });

    return unsubscribe; // Clean up the event listener
  }, [navigation]);

  // Restore scroll position on focus
  useFocusEffect(
    React.useCallback(() => {
      if (scrollRef.current && homeScrollOffset !== undefined) {
        scrollRef.current.scrollToOffset({
          offset: homeScrollOffset,
          animated: false,
        });
      }
    }, [homeScrollOffset])
  );

  return (
    <>
      <Animated.View
        style={[styles.stickySearchArea, { transform: [{ translateY }] }]}
      >
        <TouchableOpacity
          onPress={() => {
            setDefaultFilters();
            router.push("../search/search");
          }}
          style={{ width: "100%" }}
        >
          <SearchBar
            search=""
            onPress={() => {
              setDefaultFilters();
              router.push("../search/search");
            }}
            placeholder="What are you looking for?"
            disabled
          />
        </TouchableOpacity>
      </Animated.View>
      <AnimatedFlatList
        ref={scrollRef}
        contentContainerStyle={{
          gap: 8,
          paddingBottom: 8,
          paddingTop: 60,
        }}
        style={styles.container}
        ListHeaderComponent={
          <>
            <CategoryGrid
              size={width / 3}
              error={catError}
              loading={catLoading}
              retry={() => fetchCategories({ perPage: 20 })}
              categories={categoryIds.map((id) => categories[id])}
            />
            <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
              <Text style={{ fontWeight: "600" }}>Latest</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          loadingStates.fetchLatest || postError ? null : EmptyListingCard
        }
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
            listener: (event) => {
              const offset = event.nativeEvent.contentOffset.y;
              scrollOffsetRef.current = offset;
            },
          }
        )}
        renderItem={({ item }: { item: any }) => (
          <PostCardLandscape
            onPress={() => handlePostClick(item)}
            toggleSaved={(id) => handleToggleSaved(id)}
            size={width - 8}
            post={item}
          />
        )}
        keyExtractor={(item: any) => item?.id?.toString()}
        data={latestPostIds.map((id) => PostsMap[id])}
        onEndReached={loadMorePost}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          fetchCategories({ perPage: 20 });
          resetLatestPosts();
          fetchLatestPosts({ page: 1, perPage: 10 }).finally(() =>
            setRefreshing(false)
          );
        }}
        ListFooterComponent={
          loadingStates.fetchLatest ? (
            <ActivityIndicator size="small" />
          ) : postError ? (
            <View style={{ paddingVertical: 50 }}>
              <Button
                onPress={() => {
                  resetLatestPosts();
                  fetchLatestPosts({
                    page: 1,
                  }).finally(() => setRefreshing(false));
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stickySearchArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});
