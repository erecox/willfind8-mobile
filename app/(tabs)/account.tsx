import React, { useState } from "react";
import { ScrollView } from "@/components/ui/scroll-view";
import { Box } from "@/components/ui/box";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { useAuthStore } from "@/hooks/useAuth";
import {
  BellIcon,
  CheckCircleIcon,
  InfoIcon,
  SettingsIcon,
  StarIcon,
  EditIcon,
  Icon
} from "@/components/ui/icon";
import {
  BriefcaseBusinessIcon,
  CreditCardIcon,
  DeleteIcon,
  FileChartPieIcon,
  HeartHandshakeIcon,
  LogOutIcon,
  MessagesSquareIcon,
  ShieldQuestion,
  ViewIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  CalendarIcon,
  BadgeCheckIcon,
  ShieldIcon
} from "lucide-react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Divider } from "@/components/ui/divider";
import { ActionBox } from "@/components/custom/action-box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Center } from "@/components/ui/center";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Redirect, router } from "expo-router";
import { Alert, TouchableOpacity } from "react-native";
import { DeleteAccountAlert } from "@/components/modals/delete-account-alert";
import moment from "moment";

export default function AccountScreen() {
  const { user, logout } = useAuthStore();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  if (!user) return <Redirect href={'/(auth)/login'} />;

  const handleEditProfile = () => router.push('/(account)/edit-profile');
  const handleSecuritySettings = () => router.push('/(account)/signin-and-security');
  const handleMyAdsPress = () => router.push('/(account)/my-ads');
  const handleMessagesPress = () => router.push('/(account)/messages');
  const handleReviewPress = () => router.push('/(account)/reviews');
  const handleNotificationsPress = () => router.push('/(account)/notifications');
  const handleFollowingPress = () => router.push('/(account)/following');
  const handleRecentlyViewPress = () => router.push('/(account)/recently-viewed');
  const handleBusinessInfoPress = () => router.push('/(account)/business-information');
  const handlePaymentSettingPress = () => router.push('/(account)/payment-settings');
  const handleTermsPress = () => router.push('/(account)/terms');
  const handleAboutUsPress = () => router.push('/(account)/about-us');
  const handleFaqPress = () => router.push('/(account)/faq');
  const handleCustomerSupportPress = () => router.push('/(account)/customer-support');
  const handleDeleteAccount = () => setShowDeleteAlert(true);

  const handleLogout = () => Alert.alert(
    "Confirm Logout",
    "Are you sure you want to log out of your account?",
    [
      { text: "Yes, Logout", style: "destructive", onPress: logout },
      { text: "Cancel", style: "default" }
    ]
  );

  const getVerificationStatus = () => {
    if (user.isVerified) return { text: "Verified", color: "success" };
    if (user.emailVerified || user.phoneVerified) return { text: "Partially Verified", color: "warning" };
    return { text: "Unverified", color: "error" };
  };

  const verificationStatus = getVerificationStatus();

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="bg-background-50"
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Card className="mx-4 mt-4 p-6">
          <VStack space="lg">
            <HStack space="md" className="items-center">
              <Avatar size="xl">
                <AvatarFallbackText>
                  {`${user.firstName} ${user.lastName}`}
                </AvatarFallbackText>
                {user.avatar && (
                  <AvatarImage
                    source={{ uri: user.avatar }}
                    alt="Profile photo"
                  />
                )}
              </Avatar>

              <VStack className="flex-1" space="xs">
                <HStack className="items-center justify-between">
                  <Heading size="lg" className="flex-1">
                    {user.firstName} {user.lastName}
                  </Heading>
                  <TouchableOpacity onPress={handleEditProfile}>
                    <Box className="p-2 rounded-full bg-primary-50">
                      <Icon as={EditIcon} className="text-primary-600" />
                    </Box>
                  </TouchableOpacity>
                </HStack>

                <Text size="sm" className="text-typography-600">
                  @{user.username}
                </Text>

                <Badge
                  size="sm"
                  variant="solid"
                  action={verificationStatus.color as any}
                  className="self-start"
                >
                  <BadgeCheckIcon size={12} />
                  <BadgeText>{verificationStatus.text}</BadgeText>
                </Badge>
              </VStack>
            </HStack>

            {/* Contact Info */}
            <VStack space="sm">
              {user.email && (
                <HStack space="sm" className="items-center">
                  <Icon as={MailIcon} className="text-typography-500" />
                  <Text size="sm" className="text-typography-700">
                    {user.email}
                  </Text>
                  {user.emailVerified && (
                    <Icon as={CheckCircleIcon} className="text-success-600" />
                  )}
                </HStack>
              )}

              {user.phone && (
                <HStack space="sm" className="items-center">
                  <Icon as={PhoneIcon} className="text-typography-500" />
                  <Text size="sm" className="text-typography-700">
                    {user.phone}
                  </Text>
                  {user.phoneVerified && (
                    <Icon as={CheckCircleIcon} className="text-success-600" />
                  )}
                </HStack>
              )}

              <HStack space="sm" className="items-center">
                <Icon as={CalendarIcon} className="text-typography-500" />
                <Text size="sm" className="text-typography-700">
                  Joined {moment(user.createdAt).format('MMM YYYY')}
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </Card>

        {/* My Activity Section */}
        <VStack space="md" className="mx-4 mt-6">
          <Heading size="md" className="text-typography-900">
            My Activity
          </Heading>

          <Card>
            <VStack>
              <ActionBox
                onPress={handleMyAdsPress}
                as={FileChartPieIcon}
                title="My Ads"
                description="Manage your listings"
              />
              <Divider />
              <ActionBox
                onPress={handleMessagesPress}
                as={MessagesSquareIcon}
                title="Messages"
                description="Chat with buyers and sellers"
              />
              <Divider />
              <ActionBox
                onPress={handleReviewPress}
                as={StarIcon}
                title="Ratings & Reviews"
                description="View your feedback"
              />
              <Divider />
              <ActionBox
                onPress={handleFollowingPress}
                as={HeartHandshakeIcon}
                title="Followed Sellers"
                description="Sellers you're following"
              />
              <Divider />
              <ActionBox
                onPress={handleRecentlyViewPress}
                as={ViewIcon}
                title="Recently Viewed"
                description="Items you've browsed"
              />
              <Divider />
              <ActionBox
                onPress={handleNotificationsPress}
                as={BellIcon}
                title="Notifications"
                description="Manage your alerts"
              />
            </VStack>
          </Card>
        </VStack>

        {/* Account Settings Section */}
        <VStack space="md" className="mx-4 mt-6">
          <Heading size="md" className="text-typography-900">
            Account Settings
          </Heading>

          <Card>
            <VStack>
              <ActionBox
                onPress={handleEditProfile}
                as={UserIcon}
                title="Edit Profile"
                description="Update your personal information"
              />
              <Divider />
              <ActionBox
                onPress={handleSecuritySettings}
                as={ShieldIcon}
                title="Security & Privacy"
                description="Password, phone, and privacy settings"
              />
              <Divider />
              <ActionBox
                onPress={handleBusinessInfoPress}
                as={BriefcaseBusinessIcon}
                title="Business Information"
                description="Manage your business profile"
              />
              <Divider />
              <ActionBox
                onPress={handlePaymentSettingPress}
                as={CreditCardIcon}
                title="Payment Settings"
                description="Manage payment methods"
              />
            </VStack>
          </Card>
        </VStack>

        {/* Support & Legal Section */}
        <VStack space="md" className="mx-4 mt-6">
          <Heading size="md" className="text-typography-900">
            Support & Legal
          </Heading>

          <Card>
            <VStack>
              <ActionBox
                onPress={handleFaqPress}
                as={ShieldQuestion}
                title="FAQ"
                description="Frequently asked questions"
              />
              <Divider />
              <ActionBox
                onPress={handleCustomerSupportPress}
                as={MessagesSquareIcon}
                title="Customer Support"
                description="Get help from our team"
              />
              <Divider />
              <ActionBox
                onPress={handleTermsPress}
                as={CheckCircleIcon}
                title="Terms of Use"
                description="Read our terms and conditions"
              />
              <Divider />
              <ActionBox
                onPress={handleAboutUsPress}
                as={InfoIcon}
                title="About WillFind8"
                description="Learn more about our platform"
              />
            </VStack>
          </Card>
        </VStack>

        {/* Danger Zone */}
        <VStack space="md" className="mx-4 mt-6 mb-4">
          <Heading size="md" className="text-error-600">
            Danger Zone
          </Heading>

          <Card className="border-error-200">
            <VStack>
              <ActionBox
                onPress={handleDeleteAccount}
                as={DeleteIcon}
                title="Delete Account"
                description="Permanently delete your account"
              />
            </VStack>
          </Card>
        </VStack>

        {/* Logout Button */}
        <Box className="mx-4 mt-4">
          <Button
            onPress={handleLogout}
            variant="outline"
            action="secondary"
            size="lg"
            className="w-full"
          >
            <ButtonIcon as={LogOutIcon} />
            <ButtonText>Logout</ButtonText>
          </Button>
        </Box>
      </ScrollView>

      <DeleteAccountAlert
        showAlertDialog={showDeleteAlert}
        handleClose={() => setShowDeleteAlert(false)}
      />
    </SafeAreaView>
  );
}
