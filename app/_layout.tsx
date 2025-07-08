import React from "react";
import "@/styles/global.css";
import { Stack, useRouter } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Icon, ChevronLeftIcon, SunIcon, MoonIcon } from "@/components/ui/icon";
import { StyleSheet, Platform } from "react-native";
import { Fab } from "@/components/ui/fab";
import { Pressable } from "@/components/ui/pressable";
import { StatusBar } from "expo-status-bar";
import useThemeMode from "@/hooks/useThemeMode";

export default function RootLayout() {
  const { themeMode, toggleThemeMode } = useThemeMode();

  const styles = StyleSheet.create({
    header: {
      backgroundColor: themeMode === "light" ? "#fff" : "#000",
      borderBottomColor: themeMode === "light" ? "#E6E6E6" : "#414141",
      borderBottomWidth: 1,
    },
  });

  return (
    <>
      <StatusBar style="auto" />
      <GluestackUIProvider mode={themeMode}>
        <Stack screenOptions={{ animation: "slide_from_right" }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />

        </Stack>

        <Fab
          className="bottom-[100px] sm:right-10 right-6 p-4 z-0"
          onPress={toggleThemeMode}
        >
          <Icon
            as={themeMode === "light" ? SunIcon : MoonIcon}
            className="text-typography-0"
          />
        </Fab>
      </GluestackUIProvider>
    </>
  );
}
