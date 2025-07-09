import React from "react";
import { Tabs } from "@/components/layout/tabs";
import { Icon } from "@/components/ui/icon";
import { Grid2X2Icon, GripIcon, Home, MessagesSquareIcon, PlusSquareIcon, UserIcon } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon as={Home} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon as={Grid2X2Icon} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="add-ad"
        options={{
          title: "New Ad",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon as={PlusSquareIcon} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon as={MessagesSquareIcon} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon as={UserIcon} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
