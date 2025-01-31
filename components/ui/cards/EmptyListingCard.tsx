import { lightColors, Text } from "@rneui/themed";
import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { View } from "react-native";

export function EmptyListingCard({
  placeholder = "No listings",
  style,
}: {
  placeholder?: string;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.placeholder}>{placeholder}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 50,
    alignItems: "center",
  },
  placeholder: {
    color: lightColors.grey3,
  },
});
