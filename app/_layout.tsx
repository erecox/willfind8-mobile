import React from "react";
import "@/styles/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import useThemeMode from "@/hooks/useThemeMode";
import { LoaderProvider } from "@/hooks/useLoading";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: "181055438274-h74907ar84b959aq09it4f95pkse0318.apps.googleusercontent.com",
  scopes: ["profile", "email"],
  iosClientId: '181055438274-243ie9q3uj0f8igug6h73pusnmrg0t6c.apps.googleusercontent.com'
});

export default function RootLayout() {
  const { themeMode } = useThemeMode();

  return (
    <>
      <GluestackUIProvider>
        <LoaderProvider>
          <Stack screenOptions={{ animation: "slide_from_right" }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(account)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          </Stack>
        </LoaderProvider>
      </GluestackUIProvider>
      <StatusBar style="auto" />
    </>
  );
}
