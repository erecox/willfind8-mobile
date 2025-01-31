import { EmptyListingCard } from "@/components/ui/cards/EmptyListingCard";
import ProfileListItem from "@/components/ui/cards/ProfileListItem";
import {
  Notification,
  useNotificationStore,
} from "@/hooks/store/useFetchNotifications";
import api from "@/lib/apis/api";
import { Text } from "@rneui/themed";
import { Stack } from "expo-router";
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

  const handleItemPress = async (notif: Notification) => {
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
    } else {
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
