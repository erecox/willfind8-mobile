import React, { useState } from "react";
import { ScrollView } from "@/components/ui/scroll-view";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useAuthStore } from "@/hooks/useAuth";
import { userService } from "@/utils/userService";
import { Redirect } from "expo-router";
import { 
  ShieldCheckIcon, 
  MailIcon, 
  PhoneIcon, 
  KeyIcon, 
  EditIcon} from "lucide-react-native";
import { ChangeEmailModal } from "@/components/modals/change-email";
import { ChangePhoneModal } from "@/components/modals/change-phone";
import { ChangePasswordModal } from "@/components/modals/change-password";
import { VerificationModal } from "@/components/modals/verification";
import { VerificationStatus } from "@/components/custom/verification-status";

export default function SigninAndSecurityScreen() {
  const { user, refreshUser } = useAuthStore();
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showChangePhone, setShowChangePhone] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [showVerifyPhone, setShowVerifyPhone] = useState(false);

  if (!user) return <Redirect href={'/(auth)/login'} />;

  const handleVerifyEmail = async () => {
    if (user?.email && !user.emailVerified) {
      try {
        await userService.requestEmailVerification();
        setShowVerifyEmail(true);
      } catch (error: any) {
        // Handle error if needed
        console.error('Failed to request email verification:', error);
        setShowVerifyEmail(true); // Still show modal for user to try
      }
    }
  };

  const handleVerifyPhone = async () => {
    if (user?.phone && !user.phoneVerified) {
      try {
        await userService.requestPhoneVerification();
        setShowVerifyPhone(true);
      } catch (error: any) {
        // Handle error if needed
        console.error('Failed to request phone verification:', error);
        setShowVerifyPhone(true); // Still show modal for user to try
      }
    }
  };

  const handleEmailVerificationSuccess = async () => {
    setShowVerifyEmail(false);
    await refreshUser();
  };

  const handlePhoneVerificationSuccess = async () => {
    setShowVerifyPhone(false);
    await refreshUser();
  };

  return (
    <>
      <ScrollView
        className="bg-background-50"
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Security Overview */}
        <Card className="mx-4 mt-4 p-6">
          <VStack space="md">
            <HStack className="items-center" space="md">
              <Icon as={ShieldCheckIcon} className="text-primary-600" size="lg" />
              <VStack className="flex-1">
                <Heading size="md" className="text-typography-900">
                  Account Security
                </Heading>
                <Text size="sm" className="text-typography-600">
                  Manage your login credentials and security settings
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </Card>

        {/* Email Settings */}
        <Card className="mx-4 mt-4 p-6">
          <VStack space="lg">
            <HStack className="items-center justify-between">
              <HStack className="items-center flex-1" space="md">
                <Icon as={MailIcon} className="text-typography-600" size="md" />
                <VStack className="flex-1">
                  <Text className="font-medium text-typography-900">Email Address</Text>
                  <Text size="sm" className="text-typography-600">
                    {user.email || 'No email provided'}
                  </Text>
                </VStack>
              </HStack>
              <VStack className="items-end" space="sm">
                <VerificationStatus isVerified={user.emailVerified} />
                <HStack space="xs">
                  {!user.emailVerified && user.email && (
                    <Button
                      variant="outline"
                      size="sm"
                      onPress={handleVerifyEmail}
                    >
                      <ButtonText>Verify</ButtonText>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => setShowChangeEmail(true)}
                  >
                    <ButtonIcon as={EditIcon} />
                    <ButtonText>Change</ButtonText>
                  </Button>
                </HStack>
              </VStack>
            </HStack>

            {!user.emailVerified && user.email && (
              <Box className="bg-warning-50 p-3 rounded-md">
                <Text size="sm" className="text-warning-800">
                  Your email address is not verified. Verify it to secure your account and receive important notifications.
                </Text>
              </Box>
            )}
          </VStack>
        </Card>

        {/* Phone Settings */}
        <Card className="mx-4 mt-4 p-6">
          <VStack space="lg">
            <HStack className="items-center justify-between">
              <HStack className="items-center flex-1" space="md">
                <Icon as={PhoneIcon} className="text-typography-600" size="md" />
                <VStack className="flex-1">
                  <Text className="font-medium text-typography-900">Phone Number</Text>
                  <Text size="sm" className="text-typography-600">
                    {user.phone || 'No phone number provided'}
                  </Text>
                </VStack>
              </HStack>
              <VStack className="items-end" space="sm">
                <VerificationStatus isVerified={user.phoneVerified} />
                <HStack space="xs">
                  {!user.phoneVerified && user.phone && (
                    <Button
                      variant="outline"
                      size="sm"
                      onPress={handleVerifyPhone}
                    >
                      <ButtonText>Verify</ButtonText>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => setShowChangePhone(true)}
                  >
                    <ButtonIcon as={EditIcon} />
                    <ButtonText>Change</ButtonText>
                  </Button>
                </HStack>
              </VStack>
            </HStack>

            {!user.phoneVerified && user.phone && (
              <Box className="bg-warning-50 p-3 rounded-md">
                <Text size="sm" className="text-warning-800">
                  Your phone number is not verified. Verify it to enable SMS notifications and account recovery.
                </Text>
              </Box>
            )}
          </VStack>
        </Card>

        {/* Password Settings */}
        <Card className="mx-4 mt-4 p-6">
          <VStack space="lg">
            <HStack className="items-center justify-between">
              <HStack className="items-center flex-1" space="md">
                <Icon as={KeyIcon} className="text-typography-600" size="md" />
                <VStack className="flex-1">
                  <Text className="font-medium text-typography-900">Password</Text>
                  <Text size="sm" className="text-typography-600">
                    Last updated: Recently
                  </Text>
                </VStack>
              </HStack>
              <Button
                variant="outline"
                size="sm"
                onPress={() => setShowChangePassword(true)}
              >
                <ButtonIcon as={EditIcon} />
                <ButtonText>Change</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </Card>

        {/* Security Tips */}
        <Card className="mx-4 mt-4 p-6">
          <VStack space="md">
            <Heading size="sm" className="text-typography-900">
              Security Tips
            </Heading>
            <VStack space="sm">
              <Text size="sm" className="text-typography-600">
                • Keep your email and phone number verified for account security
              </Text>
              <Text size="sm" className="text-typography-600">
                • Use a strong, unique password for your account
              </Text>
              <Text size="sm" className="text-typography-600">
                • Never share your login credentials with others
              </Text>
              <Text size="sm" className="text-typography-600">
                • Contact support if you notice any suspicious activity
              </Text>
            </VStack>
          </VStack>
        </Card>
      </ScrollView>

      {/* Modals */}
      <ChangeEmailModal
        isOpen={showChangeEmail}
        onClose={() => setShowChangeEmail(false)}
      />
      
      <ChangePhoneModal
        isOpen={showChangePhone}
        onClose={() => setShowChangePhone(false)}
      />
      
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />

      <VerificationModal
        isOpen={showVerifyEmail}
        onClose={() => setShowVerifyEmail(false)}
        onSuccess={handleEmailVerificationSuccess}
        method="email"
        contact={user?.email || ""}
        title="Verify Email Address"
        description={`Enter the verification code sent to ${user?.email}`}
        isExistingVerification={true}
      />

      <VerificationModal
        isOpen={showVerifyPhone}
        onClose={() => setShowVerifyPhone(false)}
        onSuccess={handlePhoneVerificationSuccess}
        method="phone"
        contact={user?.phone || ""}
        title="Verify Phone Number"
        description={`Enter the verification code sent to ${user?.phone}`}
        isExistingVerification={true}
      />
    </>
  );
}
