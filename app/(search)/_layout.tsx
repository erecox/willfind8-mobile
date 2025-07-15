import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
    return (
        <SafeAreaView>
            <Stack screenOptions={{ headerShown: false }} >
                <Stack.Screen name="search" options={{ animation: 'fade_from_bottom', presentation:"fullScreenModal" }} />
                <Stack.Screen name="results" />
                <Stack.Screen name="filters" />
            </Stack>
        </SafeAreaView>

    )
}