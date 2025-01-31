import { lightColors, Tab, TabView, Text } from "@rneui/themed";
import { router, Tabs, useFocusEffect } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  NativeSyntheticEvent,
  StyleSheet,
  TextInputChangeEventData,
  View,
} from "react-native";
import ProfileListItem from "@/components/ui/cards/ProfileListItem";
import { Thread, useThreadsStore } from "@/hooks/store/useFetchThreads";
import { EmptyListingCard } from "@/components/ui/cards/EmptyListingCard";
import { useAuth } from "@/lib/auth/AuthProvider";
import React from "react";

export default function MessagesScreen() {
  const [index, setIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    threads,
    unreadIds,
    importantIds,
    isLoading,
    hasMore,
    fetchThreads,
    isLoadingMore,
  } = useThreadsStore();

  const { refreshUserData } = useAuth();

  useFocusEffect(
    useCallback(() => {
      refreshUserData();
    }, [refreshUserData])
  );

  useEffect(() => {
    if (index === 0) {
      fetchThreads(); // Fetch all threads for All Messages tab
    } else if (index === 1) {
      fetchThreads("unread"); // Fetch unread threads for Unread tab
    } else if (index === 2) {
      fetchThreads("important"); // Fetch important threads for Important tab
    }
  }, [index, fetchThreads]);

  const handleMessageClicked = (thread: Thread) => {
    router.push({
      pathname: "/ads/chat",
      params: { id: thread.id, postId: thread.post_id },
    });
  };

  const renderItem = ({ item }: { item: Thread }) => {
    return (
      <ProfileListItem
        title={item.subject}
        imageUrl={item.p_creator.photo_url}
        name={item.p_creator.name}
        message={item.latest_message?.body}
        date={item.updated_at}
        onPress={() => handleMessageClicked(item)}
      />
    );
  };

  const renderFooter = () => {
    if (isLoading) {
      return (
        <View style={{ paddingVertical: 20, justifyContent: "center" }}>
          <ActivityIndicator animating />
        </View>
      );
    }

    if (!hasMore) {
      return <EmptyListingCard placeholder="No more messages" />;
    }

    return null;
  };

  const loadMore = () => {
    if (hasMore && !isLoadingMore) {
      fetchThreads();
    }
  };

  const filterThreads = (filter: "all" | "unread" | "important") => {
    let filteredThreads = threads;

    // Filter by unread or important if applicable
    if (filter === "unread") {
      filteredThreads = threads.filter((thread) => unreadIds.has(thread.id));
    } else if (filter === "important") {
      filteredThreads = threads.filter((thread) => importantIds.has(thread.id));
    }

    // Filter by search query if there's one
    if (searchQuery) {
      filteredThreads = filteredThreads.filter(
        (thread) =>
          thread.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          thread.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredThreads;
  };

  const handleSearchChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    setSearchQuery(e.nativeEvent.text);
  };

  const isSearching = searchQuery.length > 0;

  return (
    <View style={styles.container}>
      <Tabs.Screen
        options={{
          headerTitle: "Messages",
          headerSearchBarOptions: {
            placeholder: "Search message",
            onChangeText: handleSearchChange,
          },
        }}
      />

      {/* If searching, hide the tabs and display the list of threads */}
      {isSearching ? (
        <FlatList
          data={filterThreads("all")}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <Tab
            value={index}
            onChange={(e) => setIndex(e)}
            indicatorStyle={{
              height: 3,
              backgroundColor: lightColors.primary,
            }}
            variant="default"
            containerStyle={{ backgroundColor: lightColors.background }}
          >
            <Tab.Item
              title="All Messages"
              titleStyle={{ fontSize: 12, color: "black" }}
              icon={{
                name: "mail-open",
                type: "ionicon",
                color: lightColors.primary,
              }}
            />
            <Tab.Item
              title="Unread"
              titleStyle={{ fontSize: 12, color: "black" }}
              icon={{
                name: "mail",
                type: "ionicon",
                color: lightColors.primary,
              }}
            />
            <Tab.Item
              title="Important"
              titleStyle={{ fontSize: 12, color: "black" }}
              icon={{
                name: "star",
                type: "ionicon",
                color: lightColors.primary,
              }}
            />
          </Tab>

          <TabView value={index} onChange={setIndex} animationType="spring">
            <TabView.Item style={{ width: "100%" }}>
              <FlatList
                data={filterThreads("all")}
                keyExtractor={(item) => item?.id?.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
              />
            </TabView.Item>

            <TabView.Item style={{ width: "100%" }}>
              <FlatList
                data={filterThreads("unread")}
                contentContainerStyle={styles.list}
                keyExtractor={(item) => item?.id?.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                ListEmptyComponent={
                  <Text style={styles.noResultsText}>No unread threads</Text>
                }
                ListFooterComponent={() => <View style={styles.footerSpace} />}
              />
            </TabView.Item>

            <TabView.Item style={{ width: "100%" }}>
              <FlatList
                data={filterThreads("important")}
                contentContainerStyle={styles.list}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                ListEmptyComponent={
                  <Text style={styles.noResultsText}>No important threads</Text>
                }
                ListFooterComponent={() => <View style={styles.footerSpace} />}
              />
            </TabView.Item>
          </TabView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 0,
  },
  list: {
    margin: 12,
    flex: 1,
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
