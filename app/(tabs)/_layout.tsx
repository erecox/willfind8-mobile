import React, { useState } from "react";
import { Tabs } from "@/components/layout/tabs";
import { FavouriteIcon, Icon } from "@/components/ui/icon";
import { Grid2X2Icon, Home, PlusSquareIcon, UserIcon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuthStore } from "@/hooks/useAuth";
import { AuthAlert } from "@/components/custom/auth-alert";

export default function TabsLayout() {
  const inserts = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [showAuthAlert, setAuthAlert] = useState(false);

  return (
    <>
      <Tabs safeAreaInsets={inserts}
        screenListeners={{
          tabPress: (e) => {
            if (e.target?.split("-")[0] === "add-ad") {
              e.preventDefault();
              router.push('/posts/edit-post');
            }
            if (e.target?.split("-")[0] !== "index" && !user) {
              e.preventDefault();
              return setAuthAlert(true);
            }
          },
        }}
        screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Icon as={Home} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="categories"
          options={{
            title: "Categories",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Icon as={Grid2X2Icon} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="add-ad"
          options={{
            title: "New Ad",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Icon as={PlusSquareIcon} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="favorites"
          options={{
            title: "Favorites",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Icon as={FavouriteIcon} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Icon as={UserIcon} color={color} />
            ),
          }}
        />
      </Tabs>
      <AuthAlert onClose={() => setAuthAlert(false)} showAlertDialog={showAuthAlert} />
    </>
  );
}