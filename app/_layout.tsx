import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import React, { useRef } from "react";

import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { useEffect, useState } from "react";
import usePostStore from "@/hooks/store/useFetchPosts";
import useCategoryStore from "@/hooks/store/useFetchCategories";
import { AuthModalProvider } from "@/lib/auth/AuthModelProvider";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import ReportSellerProvider from "@/components/inputs/ReportSellerModal";
import * as Notifications from "expo-notifications";
import { useNotificationStore } from "@/hooks/store/useFetchNotifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { fetchCategories } = useCategoryStore();
  const {
    fetchLatestPosts,
    fetchLoggedInUserPosts,
    fetchLoggedInUserPendingPosts,
    fetchLoggedInUserArchivedPosts,
  } = usePostStore();
  const { fetchLatestNotifications } = useNotificationStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await fetchCategories({ perPage: 20 });
      await fetchLatestPosts({op: "latest", perPage: 10 });
      setLoading(false);
    };

    loadData();
  }, [fetchCategories, fetchLatestPosts]);

  useEffect(() => {
    fetchLatestNotifications()
      .catch(() => {
        console.log("Failed to fetch notifications");
      })
      .finally(() => {
        fetchLoggedInUserPosts().catch(() => {
          console.log("Failed to fetch logged in user posts");
        });
        fetchLoggedInUserPendingPosts().catch(() => {
          console.log("Failed to fetch logged in user pending posts");
        });
        fetchLoggedInUserArchivedPosts().catch(() => {
          console.log("Failed to fetch logged in user archived posts");
        });
      });
  }, []);
  // Display loading screen while fonts or data are loading
  if (loading || !loaded) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ActionSheetProvider>
        <AuthModalProvider>
          <AuthProvider>
            <ReportSellerProvider>
              <Stack>
                <Stack.Screen
                  name="(tabs)"
                  options={{ title: "", headerShown: false }}
                />
                <Stack.Screen
                  name="(auth)"
                  options={{ headerShown: false, title: "" }}
                />
                <Stack.Screen
                  name="ads/add"
                  options={{ animation: "slide_from_bottom" }}
                />
                <Stack.Screen
                  name="ads/update"
                  getId={({ params }) => params?.id}
                  options={{ animation: "slide_from_bottom" }}
                />
                <Stack.Screen
                  name="ads/details"
                  options={{ title: "Loading..." }}
                  getId={({ params }) => params?.id}
                />

                <Stack.Screen
                  name="ads/details2"
                  getId={({ params }) => params?.id}
                />
                <Stack.Screen
                  name="ads/seller"
                  getId={({ params }) => params?.id}
                  options={{ title: "", headerShown: true }}
                />
                <Stack.Screen
                  name="ads/fullscreen"
                  options={{ headerShown: false, animation: "fade" }}
                />
                <Stack.Screen
                  name="ads/chat"
                  getId={({ params }) => params?.id}
                  options={{ headerTitle: "" }}
                />
                <Stack.Screen
                  name="search/search"
                  options={{ headerShown: false, title: "Search" }}
                />
                <Stack.Screen
                  name="search/categories"
                  options={{ headerTitle: "Categories", presentation: "modal" }}
                  getId={({ params }) => params?.parentId}
                />
                <Stack.Screen
                  name="search/categories_menu"
                  options={{
                    headerTitle: "All Categories",
                    presentation: "modal",
                  }}
                  getId={({ params }) => new Date().toISOString()}
                />
                <Stack.Screen
                  name="search/results"
                  options={{ headerShown: false }}
                  getId={({ params }) => params?.category_id}
                />
                <Stack.Screen
                  name="search/cities"
                  options={{ presentation: "modal", headerTitle: "Location" }}
                />
                <Stack.Screen
                  name="search/cities_menu"
                  options={{ presentation: "modal", headerTitle: "Location" }}
                />
                <Stack.Screen
                  name="search/filters"
                  options={{
                    presentation: "fullScreenModal",
                    headerTitle: "Filter",
                  }}
                />
                <Stack.Screen
                  name="(user)/business-info"
                  options={{ title: "Business Information" }}
                />
                <Stack.Screen
                  name="(user)/close-account"
                  options={{ title: "Close Account" }}
                />
                <Stack.Screen
                  name="(user)/mylisting"
                  options={{ title: "My Listing" }}
                />
                <Stack.Screen
                  name="(user)/notifications"
                  options={{ title: "Notifications" }}
                />
                <Stack.Screen
                  name="(user)/personal-info"
                  options={{ title: "Personal Information" }}
                />
                <Stack.Screen
                  name="(user)/signin-security"
                  options={{ title: "SignIn & Security" }}
                />

                <Stack.Screen
                  name="(user)/email"
                  options={{ title: "Change Email" }}
                />
                <Stack.Screen
                  name="(user)/phone"
                  options={{ title: "Change Phone Number" }}
                />
                <Stack.Screen
                  name="(user)/change-password"
                  options={{ title: "Change Password" }}
                />
                <Stack.Screen name="pages/terms" />
                <Stack.Screen name="+not-found" />
              </Stack>
            </ReportSellerProvider>
          </AuthProvider>
        </AuthModalProvider>
      </ActionSheetProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
