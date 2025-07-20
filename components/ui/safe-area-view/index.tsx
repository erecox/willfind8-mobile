"use client";

import { View } from "react-native";

import { ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function SafeAreaView({
  children,
  className,
  allowBottom,
}: {
  children: ReactNode;
  allowBottom?: boolean;
  className?: string;
}) {
  const { top, bottom } = useSafeAreaInsets();
  return (
    <View
      className={`flex-1 bg-background-0 ${className}`}
      style={{
        paddingTop: top,
        flex: 1,
        paddingBottom: allowBottom ? bottom : 0,
      }}
    >
      {children}
    </View>
  );
}
