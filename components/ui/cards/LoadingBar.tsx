import { lightColors, LinearProgress } from "@rneui/themed";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

export default function LoadingBar({
  loading,
  style,
}: {
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { width } = useWindowDimensions();
  return (
    loading && (
      <View style={[styles.container, style]}>
        <LinearProgress
          variant="indeterminate"
          color="primary"
          trackColor={lightColors.grey5}
          style={{ width: width }}
        />
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    flex: 1,
  },
});
