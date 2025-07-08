'use client';
import React from 'react';
import { Tabs as ExpTabs } from 'expo-router';
import { Platform, useColorScheme } from 'react-native';
import { HapticTab } from '@/components/ui/haptic-tab';

// fallback theme tokens
const tokens = {
  light: {
    background: '#ffffff',
    border: '#e2e8f0',
    primary: '#3b82f6',
    muted: '#6b7280',
  },
  dark: {
    background: '#1f2937',
    border: '#374151',
    primary: '#60a5fa',
    muted: '#9ca3af',
  },
};

// Extend ExpTabs
const TabsBase = React.forwardRef<
  React.ElementRef<typeof ExpTabs>,
  React.ComponentProps<typeof ExpTabs>
>(function Tabs(props, ref) {
  const scheme = useColorScheme();
  const theme = tokens[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <ExpTabs
      ref={ref}
      {...props}
      screenOptions={{
        tabBarShowLabel: true,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {
            backgroundColor: theme.background,
            borderTopWidth: 1,
            borderColor: theme.border,
          },
        }),
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted,
        ...props.screenOptions,
      }}
    />
  );
});

// Attach static properties (Screen, Group, Slot)
const Tabs = Object.assign(TabsBase, {
  Screen: ExpTabs.Screen,
});


export { Tabs }