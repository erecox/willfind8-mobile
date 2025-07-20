import { ChevronLeftIcon, Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { router, Stack } from "expo-router";
import React from "react";

export default function AdsLayout() {
  return (
    <SafeAreaView allowBottom>
      <Stack
        screenOptions={{
          headerLeft(props) {
            return (
              <Pressable
                onPress={() => props.canGoBack && router.back()}
                className="flex flex-row items-center"
              >
                <Icon size="2xl" as={ChevronLeftIcon} />
                <Text size="lg">{props.label}</Text>
              </Pressable>
            );
          },
        }}
      >
        <Stack.Screen
          name="[id]"
          options={{ headerBackVisible: true, headerBackTitle: "Back" }}
        />
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
