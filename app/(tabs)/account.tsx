import React, { useEffect, useState } from "react";
import { ScrollView } from "@/components/ui/scroll-view";
import { Box } from "@/components/ui/box";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { useAuthStore } from "@/hooks/useAuth";
import { CheckCircleIcon, InfoIcon, SettingsIcon, StarIcon } from "@/components/ui/icon";
import {
  BriefcaseBusinessIcon,
  CreditCardIcon,
  DeleteIcon,
  FileChartPieIcon,
  HeartHandshakeIcon,
  LogOutIcon,
  MessagesSquareIcon,
  ShieldQuestion,
  ViewIcon
} from "lucide-react-native";
import { VStack } from "@/components/ui/vstack";
import { Divider } from "@/components/ui/divider";
import { ActionBox } from "@/components/custom/action-box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Center } from "@/components/ui/center";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Redirect, router } from "expo-router";
import { Alert, TouchableOpacity } from "react-native";
import { DeleteAccountAlert } from "@/components/modals/delete-account-alert";

export default function AccountLayout() {
  const { user, logout } = useAuthStore();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  if (!user) return <Redirect href={'/(auth)/login'} />;

  const handleSettingPress = () => router.push('/settings');
  const handleMyAdsPress = () => router.push('/my-ads');
  const handleMessagesPress = () => router.push('/messages');
  const handleReviewPress = () => router.push('/reviews');
  const handleFollowingPress = () => router.push('/following');
  const handleRecentlyViewPress = () => router.push('/recently-viewed');
  const handleBusinessInfoPress = () => router.push('/business-information');
  const handlePaymentSettingPress = () => router.push('/payment-settings');
  const handleTermsPress = () => router.push('/terms');
  const handleAboutUsPress = () => router.push('/about-us');
  const handleFaqPress = () => router.push('/faq');
  const handleCustomerSupportPress = () => router.push('/customer-support');
  const handleDeleteAccount = () => setShowDeleteAlert(true);
  const handleLogoAlert = () => Alert.alert(
    "Are you sure?",
    "This will log you out of you account.",
    [
      { "text": "Yes, Logout", style: "destructive", onPress: logout },
      { "text": "Cancel", style: "default" }
    ]);

  return (
    <SafeAreaView>
      <ScrollView
        className={`bg-background-50`}
        contentContainerClassName="p-3 pb-6"
      >
        <Box className="p-5">
          <TouchableOpacity onPress={handleSettingPress} activeOpacity={.5}>
            <Center>
              <Avatar size="lg">
                <AvatarImage source={{ uri: 'https://gluestack.github.io/public-blog-video-assets/yoga.png', }}
                  alt="image" />
              </Avatar>
              <Heading size="md">{user?.name}</Heading>
              {user?.email && <Text size="sm" className="mb-4">{user?.email}</Text>}
              <Text className="text-xs font-normal text-typography-700" >Joined: May 15, 2023</Text>
            </Center>
          </TouchableOpacity>
        </Box>

        <Box className="rounded-lg mt-5 w-full self-center">
          <VStack>
            <ActionBox onPress={handleMyAdsPress} as={FileChartPieIcon} title="My Ads" />
            <Divider />
            <ActionBox onPress={handleMessagesPress} as={MessagesSquareIcon} title="Messages" />
            <Divider />
            <ActionBox onPress={handleReviewPress} as={StarIcon} title="Ratings & Reviews" />
            <Divider />
            <ActionBox onPress={handleFollowingPress} as={HeartHandshakeIcon} title="Followed Sellers" />
            <Divider />
            <ActionBox onPress={handleRecentlyViewPress} as={ViewIcon} title="Recently Viewed" />
          </VStack>
        </Box>

        <Box className="rounded-lg mt-5 w-full self-center">
          <VStack>
            <ActionBox onPress={handleSettingPress} as={SettingsIcon} title="Account Settings" />
            <Divider />
            <ActionBox onPress={handleBusinessInfoPress} as={BriefcaseBusinessIcon} title="Business Information" />
            <Divider />
            <ActionBox onPress={handlePaymentSettingPress} as={CreditCardIcon} title="Payment Settings" />
            <Divider />
            <ActionBox onPress={handleTermsPress} as={CheckCircleIcon} title="Terms of Use" />
            <Divider />
            <ActionBox onPress={handleAboutUsPress} as={InfoIcon} title="About Willfind8" />
          </VStack>
        </Box>

        <Box className="rounded-lg mt-5 w-full self-center">
          <VStack>
            <ActionBox onPress={handleFaqPress} as={ShieldQuestion} title="FAQ" />
            <Divider />
            <ActionBox onPress={handleCustomerSupportPress} as={MessagesSquareIcon} title="Customer Support" />
            <Divider />
            <ActionBox onPress={handleDeleteAccount} as={DeleteIcon} title="Delete Account" />
          </VStack>
        </Box>

        <Button onPress={handleLogoAlert} className="mt-5">
          <ButtonText>Logout</ButtonText>
          <ButtonIcon as={LogOutIcon} />
        </Button>
      </ScrollView>
      <DeleteAccountAlert showAlertDialog={showDeleteAlert} handleClose={() => setShowDeleteAlert(false)} />
    </SafeAreaView>
  );
}
