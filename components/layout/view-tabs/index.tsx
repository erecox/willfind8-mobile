'use client';
import React from 'react';
import { Tab as RnuiTab, TabView as RnuiTabView } from "@rneui/base";
import useThemeMode from '@/hooks/useThemeMode';
import { darkColors, lightColors } from './colors';

// Extend RnuiTab
const TabBase = React.forwardRef<
  React.ComponentRef<typeof RnuiTab>,
  React.ComponentProps<typeof RnuiTab>
>(function Tab(props, ref) {
  const { themeMode } = useThemeMode();
  const colors = themeMode === 'dark' ? darkColors : lightColors;
  return (
    <RnuiTab {...props} />
  );
});


const TabViewBase = React.forwardRef<
  React.ComponentRef<typeof RnuiTabView>,
  React.ComponentProps<typeof RnuiTabView>
>(function TabView(props, ref) {
  const { themeMode } = useThemeMode();
  const colors = themeMode === 'dark' ? darkColors : lightColors;
  return (
    <RnuiTabView {...props} />
  );
});

const Tab = Object.assign(TabBase, { Item: RnuiTab.Item });
const TabView = Object.assign(TabViewBase, { Item: RnuiTabView.Item });

export { Tab, TabView }