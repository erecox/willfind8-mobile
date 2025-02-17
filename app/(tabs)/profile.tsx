// app/tabs/profile.js
import ProfileHeader from "@/components/ui/ProfileHeader";
import SettingOption from "@/components/ui/SettingOption";
import { useAuth } from "@/lib/auth/AuthProvider";
import { router, useFocusEffect } from "expo-router";
import React from "react";
import { useCallback, useEffect } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import { useNotificationStore } from "@/hooks/store/useFetchNotifications";

export default function ProfileScreen() {
  const { logout, user, refreshUserData } = useAuth();
  const { items, updateBadgeCount } = useNotificationStore();

  useFocusEffect(
    useCallback(() => {
      refreshUserData();
    }, [])
  );

  useEffect(() => {
    if (!user) router.push("/(tabs)");
  }, [user, router]);

  useFocusEffect(
    useCallback(() => {
      handleClearBadgeCount();
    }, [])
  );
  const handleClearBadgeCount = async () => {
    await Notifications.setBadgeCountAsync(0);
    updateBadgeCount();
  };
  // Handler functions for each option
  const handleMyListingPress = () =>
    router.push({ pathname: "/(user)/mylisting" });

  const handlePersonalInfoPress = () =>
    router.push({ pathname: "/(user)/personal-info" });

  const handleBusinessInfoPress = () =>
    router.push({ pathname: "/(user)/business-info" });

  const handleNotificationPress = () => {
    handleClearBadgeCount();
    router.push({ pathname: "/(user)/notifications" });
  };

  const handleSignInSecurityPress = () =>
    router.push({ pathname: "/(user)/signin-security" });

  const handleDeleteAccountPress = () =>
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?",
      [
        {
          text: "Yes",
          style: "destructive",
          onPress: () => router.push({ pathname: "/(user)/close-account" }),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  const handleTermsOfUsePress = () => router.push("/pages/terms");
  const handlePrivacyPolicyPress = () => router.push("/pages/privacy");
  const handleFAQPress = () => router.push("/pages/faq");

  const handleLogoutPress = () =>
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Yes,Logout", style: "destructive", onPress: logout },
      { text: "Cancel", style: "cancel" },
    ]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView style={styles.container}>
        <ProfileHeader
          name={user?.name}
          email={user?.email}
          avatarUrl={user?.photo_url}
          onPress={handlePersonalInfoPress}
          joined={user?.created_at_formatted}
        />
        {/* Settings Options */}
        <SettingOption
          title="My Listings"
          icon="post-add"
          onPress={handleMyListingPress}
        />
        <SettingOption
          title="Notifications"
          icon="notifications"
          onPress={handleNotificationPress}
          badgeCount={
            items.filter((item) => item.status === "delivered").length
          }
        />

        {/* Divider for separating account management */}
        <View style={styles.divider} />

        <SettingOption
          title="Personal Info"
          icon="person"
          onPress={handlePersonalInfoPress}
        />

        <SettingOption
          title="Sign In & Security"
          icon="lock"
          onPress={handleSignInSecurityPress}
        />
        <SettingOption
          title="Close Account"
          icon="delete"
          onPress={handleDeleteAccountPress}
        />

        {/* Divider for separating account management */}
        <View style={styles.divider} />

        <SettingOption
          title="Terms of Use"
          icon="description"
          onPress={handleTermsOfUsePress}
        />
        <SettingOption
          title="Privacy Policy"
          icon="policy"
          onPress={handlePrivacyPolicyPress}
        />
        <SettingOption title="FAQ" icon="info" onPress={handleFAQPress} />

        <SettingOption
          title="Logout"
          icon="logout"
          onPress={handleLogoutPress}
        />
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  divider: {
    marginVertical: 16,
  },
});
