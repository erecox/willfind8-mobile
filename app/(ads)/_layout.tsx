import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Stack } from "expo-router";
import React from "react";

export default function AdsLayout() {

    return (
        <SafeAreaView>
            <Stack>
                <Stack.Screen name="[id]" />
                <Stack.Screen name="edit" />
                <Stack.Screen name="new" />
                <Stack.Screen name="fullscreen" options={{
                    headerShown: false,
                    presentation: 'fullScreenModal',
                    animation: "fade_from_bottom"
                }} />
            </Stack>
        </SafeAreaView>
    )
}