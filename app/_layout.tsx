import React from "react";
import "@/styles/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import useThemeMode from "@/hooks/useThemeMode";
import { LoaderProvider } from "@/hooks/useLoading";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Flag } from "lucide-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

GoogleSignin.configure({
  webClientId: "181055438274-h74907ar84b959aq09it4f95pkse0318.apps.googleusercontent.com",
  scopes: ["profile", "email"],
  iosClientId: '181055438274-243ie9q3uj0f8igug6h73pusnmrg0t6c.apps.googleusercontent.com'
});

export default function RootLayout() {
  const { themeMode } = useThemeMode();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider>
        <LoaderProvider>
          <Stack screenOptions={{ animation: "slide_from_right", headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(account)" />
            <Stack.Screen name="(search)" />
            <Stack.Screen name="(ads)" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </LoaderProvider>
      </GluestackUIProvider>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
