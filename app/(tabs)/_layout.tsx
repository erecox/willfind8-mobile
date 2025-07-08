import React from "react";
import { Tabs } from "@/components/layout/tabs";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home", headerShown: false,
                    tabBarIcon: ({ color }) => <IconSymbol name="house.fill" color={color} />,
                }}

            />
            <Tabs.Screen name="categories" options={{
                title: "Categories", headerShown: false,
                tabBarIcon: ({ color }) => <IconSymbol name="square.grid.2x2.fill" color={color} />,
            }} />
            <Tabs.Screen name="add-ad" options={{
                title: "New Ad", headerShown: false,
                tabBarIcon: ({ color }) => <IconSymbol name="plus.app.fill" color={color} />,
            }} />

                        <Tabs.Screen name="messages" options={{
                title: "Messages", headerShown: false,
                tabBarIcon: ({ color }) => <IconSymbol name="message.fill" color={color} />,
            }} />

                        <Tabs.Screen name="account" options={{
                title: "Account", headerShown: false,
                tabBarIcon: ({ color }) => <IconSymbol name="person.fill" color={color} />,
            }} />
        </Tabs>
    );
}