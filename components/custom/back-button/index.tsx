import React from "react";
import { Platform } from "react-native";
import { Pressable } from "@/components/ui/pressable";
import { router } from "expo-router";
import { ChevronLeftIcon, Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

export function BackButton(props: any) {
  return Platform.OS === "ios" ? (
    <Pressable
      onPress={() => props.canGoBack && router.back()}
      className="flex flex-row items-center -m-5"
    >
      <Icon size="2xl" as={ChevronLeftIcon} />
      <Text size="lg">Back</Text>
    </Pressable>
  ) : undefined;
}
