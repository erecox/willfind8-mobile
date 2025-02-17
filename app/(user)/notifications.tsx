import { EmptyListingCard } from "@/components/ui/cards/EmptyListingCard";
import ProfileListItem from "@/components/ui/cards/ProfileListItem";
import {
  Notification,
  useNotificationStore,
} from "@/hooks/store/useFetchNotifications";
import api from "@/lib/apis/api";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Button, Icon, Text } from "@rneui/themed";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  SafeAreaView,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  ActivityIndicator,
  View,
} from "react-native";

const Notifications = () => {
  const [searchText, setSearchText] = useState("");
  const [filterdResult, setFilteredResult] = useState<any>();

  const placeholder = require("@/assets/images/willfind8-logo.png");

  const {
    fetchLatestNotifications,
    fetchMoreNotifications,
    loadingStates,
    deleteAllNotifications,
    setState,
    hasMore,
    items,
  } = useNotificationStore();

  const handleFetch = () => {
    if (hasMore) fetchLatestNotifications();
  };
  const handleRefresh = () => {
    fetchMoreNotifications();
  };
  const handleSearch = (
    text: NativeSyntheticEvent<TextInputFocusEventData>
  ) => {
    const search = text.nativeEvent.text;
    setSearchText(search);
    setFilteredResult(
      items.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.body.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  const { showActionSheetWithOptions } = useActionSheet();
  const openMenu = () => {
    const options = ["Mark All as Read", "Clear All", "Cancel"];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex: any) => {
        switch (selectedIndex) {
          case 0:
            handleMarkAllAsRead();
            break;

          case destructiveButtonIndex:
            if (!loadingStates.fetchLatest) deleteAllNotifications();
            break;

          case cancelButtonIndex:
          // Canceled
        }
      }
    );
  };
  const handleMarkAllAsRead = () => {
    const oldItems = items;
    const newItems = items.map((item) => ({ ...item, status: "read" }));
    setState({ items: newItems });
    api
      .get(`/api/expo/notifications/markAllAsRead`)
      .then((response) => {
        const { success, message } = response.data;
        if (success) {
          const newItems = items.map((item) => ({ ...item, status: "read" }));
          setState({ items: newItems });
        } else {
          setState({ items: oldItems });
        }
      })
      .catch((reason) => {
        console.error(reason);
        setState({ items: oldItems });
      });
  };

  const handleItemPress = (notif: Notification) => {
    const indexItem = items.findIndex((item) => item.id == notif.id);

    if (notif.status === "delivered") {
      items[indexItem].status = "read";
      setState({ items });
      api
        .get(`/api/expo/notifications/markAsRead/${notif.id}`)
        .then((response) => {
          const { success, message } = response.data;
          if (success) {
            items[indexItem].status = "read";
            console.log("message", message);
            setState({ items });
          }
        })
        .catch((reason) => {
          items[indexItem].status = "delivered";
          setState({ items });
        });
    }

    if (notif.data?.post) {
      router.push({
        pathname: "/ads/details",
        params: { id: notif.data?.post?.id },
      });
    }
  };

  const renderItem = ({ item }: { item: Notification }) => {
    return (
      <ProfileListItem
        title={item.title}
        message={item.body}
        imageUrl={
          item.data?.post ? item.data.post?.user_photo_url : placeholder
        }
        postThumbnail={item.data?.post ? item.data.post.picture.url : null}
        isRead={item.status === "read"}
        titleStyle2={{ color: "black" }}
        onPress={() => handleItemPress(item)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: "Search message",
            onChangeText: handleSearch,
          },
          headerRight: () => <Icon onPress={openMenu} name="more-vert" />,
        }}
      />
      {searchText ? (
        <FlatList
          style={styles.list}
          data={filterdResult}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={renderItem}
          onEndReached={handleFetch}
          onRefresh={handleFetch}
          refreshing={loadingStates.fetchLatest}
          ListEmptyComponent={
            <EmptyListingCard placeholder="No notification messages" />
          }
        />
      ) : (
        <FlatList
          style={styles.list}
          data={items}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={renderItem}
          onEndReached={handleFetch}
          onRefresh={handleRefresh}
          refreshing={loadingStates.fetchLatest}
          ListEmptyComponent={
            <EmptyListingCard placeholder="No notification messages" />
          }
          ListFooterComponent={
            loadingStates.fetchLatest ? (
              <View style={{ justifyContent: "center", paddingVertical: 20 }}>
                <ActivityIndicator animating />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  body: {
    fontSize: 14,
  },
});

export default Notifications;
