'use client';
import React from 'react';
import { Tabs as ExpTabs } from 'expo-router';
import { HapticTab } from '@/components/ui/haptic-tab';
import useThemeMode from '@/hooks/useThemeMode';
import { darkColors, lightColors } from './colors';

// Extend ExpTabs
const TabsBase = React.forwardRef<
  React.ComponentRef<typeof ExpTabs>,
  React.ComponentProps<typeof ExpTabs>
>(function Tabs(props, ref) {
  const { themeMode } = useThemeMode();
  const colors = themeMode === 'dark' ? darkColors : lightColors;
  return (
    <ExpTabs
      ref={ref}
      {...props}
      screenOptions={{
        tabBarShowLabel: true,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.background,
        },
        tabBarActiveTintColor: colors.primary,
      }}
    />
  );
});

// Attach static properties (Screen, Group, Slot)
const Tabs = Object.assign(TabsBase, {
  Screen: ExpTabs.Screen,
});


export { Tabs }