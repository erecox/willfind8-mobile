import { BackButton } from "@/components/custom/back-button";
import { ChevronLeftIcon, Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { router, Stack } from "expo-router";
import React from "react";
import { Platform } from "react-native";

export default function AdsLayout() {
  return (
    <SafeAreaView allowBottom>
      <Stack
        screenOptions={{
          headerLeft: BackButton,
        }}
      >
        <Stack.Screen name="[id]" />
        <Stack.Screen name="edit" />
        <Stack.Screen name="new" />
        <Stack.Screen
          name="fullscreen"
          options={{
            headerShown: false,
            presentation: "fullScreenModal",
            animation: "fade_from_bottom",
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
