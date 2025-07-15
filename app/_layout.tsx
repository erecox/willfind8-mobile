import React from "react";
import "@/styles/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import useThemeMode from "@/hooks/useThemeMode";
import { LoaderProvider } from "@/hooks/useLoading";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/utils/query-client';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  scopes: ["profile", "email"],
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient} >
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
      </QueryClientProvider>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
