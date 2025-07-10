import React from "react";
import "@/styles/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import useThemeMode from "@/hooks/useThemeMode";
import { LoaderProvider } from "@/hooks/useLoading";

export default function RootLayout() {
  const { themeMode } = useThemeMode();

  return (
    <>
      <GluestackUIProvider>
        <LoaderProvider>
          <Stack screenOptions={{ animation: "slide_from_right" }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
            <Stack.Screen name="(account)" options={{ headerShown: false }} />
          </Stack> 
        </LoaderProvider>
      </GluestackUIProvider>
      <StatusBar />
    </>
  );
}
