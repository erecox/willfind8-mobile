import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormControlHelper,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelperText,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { AlertCircleIcon, ArrowLeftIcon, CheckCircleIcon } from "@/components/ui/icon";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { useFormik } from "formik";
import * as Yup from "yup";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { LogoIcon } from "@/components/custom/logo-icon";
import { ActivityIndicator } from "react-native";
import { useAppToast } from "@/hooks/useToast";
import { authService } from "@/utils/authService";
import { useAuthStore } from "@/hooks/useAuth";
import { Icon } from "@/components/ui/icon";

const VerificationSchema = Yup.object().shape({
  code: Yup.string()
    .length(6, "Verification code must be 6 digits")
    .matches(/^\d+$/, "Verification code must contain only numbers")
    .required("Verification code is required"),
});

export default function VerifyScreen() {
  const { method, contact } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { showError, showSuccess, showInfo } = useAppToast();
  const { user, refreshUser } = useAuthStore();

  const verificationMethod = method as 'email' | 'phone';
  const contactInfo = contact as string;

  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: VerificationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        
        // TODO: Implement verification API call
        // await authService.verifyAccount(values.code, verificationMethod);
        
        // For now, simulate verification
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        showSuccess(
          "Verification Successful!",
          `Your ${verificationMethod} has been verified successfully.`
        );
        
        setVerificationSuccess(true);
        
        // Refresh user data
        await refreshUser();
        
        // Navigate to main app after a short delay
        setTimeout(() => {
          router.replace("/(tabs)");
        }, 2000);
        
      } catch (error: any) {
        showError(
          "Verification Failed",
          error.message || "Invalid verification code. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleResendCode = async () => {
    try {
      setIsResending(true);
      
      // TODO: Implement resend verification code API call
      // await authService.resendVerificationCode(verificationMethod, contactInfo);
      
      // For now, simulate resend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccess(
        "Code Sent!",
        `A new verification code has been sent to your ${verificationMethod}.`
      );
      
      // Start countdown
      setCountdown(60);
      
    } catch (error: any) {
      showError(
        "Resend Failed",
        error.message || "Failed to resend verification code. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleSkipVerification = () => {
    showInfo(
      "Verification Skipped",
      "You can verify your account later in settings to access all features."
    );
    router.replace("/(tabs)");
  };

  const handleBackToLogin = () => {
    router.replace("/(auth)/login");
  };

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Check if verification is needed
  useEffect(() => {
    if (!method || !contact) {
      showError("Invalid Verification", "Missing verification parameters.");
      router.replace("/(auth)/login");
    }
  }, [method, contact]);

  if (verificationSuccess) {
    return (
      <SafeAreaView className="flex-1 bg-background-50">
        <ScrollView className="bg-background-50" contentContainerClassName="px-5 pt-10">
          <Box className="p-5 rounded-lg bg-background-0">
            <Center className="mb-8">
              <LogoIcon />
              <Icon as={CheckCircleIcon} className="h-16 w-16 text-success-500 mv-4" />
              <Heading size="md" className="text-center">
                Verification Complete!
              </Heading>
              <Text className="text-center mt-3" size="sm">
                Your {verificationMethod} has been verified successfully. 
                Welcome to WillFind8!
              </Text>
            </Center>
          </Box>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-50">
      <ScrollView
        className="bg-background-50"
        contentContainerClassName="px-5 pt-10"
      >
        <Box className="p-5 rounded-lg bg-background-0">
          <Center className="mb-8">
            <LogoIcon />
            <Heading size="md" className="text-center">
              Verify Your {verificationMethod === 'email' ? 'Email' : 'Phone Number'}
            </Heading>
            <Text className="text-center mt-3" size="sm">
              We've sent a 6-digit verification code to{" "}
              <Text className="font-semibold">{contactInfo}</Text>
            </Text>
          </Center>

          {/* Verification Code Input */}
          <FormControl
            isInvalid={!!(formik.touched.code && formik.errors.code)}
            className="w-full"
          >
            <FormControlLabel>
              <FormControlLabelText size="sm">
                Verification Code
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                keyboardType="numeric"
                value={formik.values.code}
                onChangeText={formik.handleChange("code")}
                onBlur={formik.handleBlur("code")}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </Input>
            <FormControlHelper>
              <FormControlHelperText size="xs">
                Enter the 6-digit code sent to your {verificationMethod}.
              </FormControlHelperText>
            </FormControlHelper>
            {formik.touched.code && formik.errors.code && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText size="xs">
                  {formik.errors.code}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Verify Button */}
          <Button
            className="mt-6 w-full"
            disabled={!formik.isValid || isLoading}
            onPress={formik.handleSubmit as any}
          >
            <ButtonText>Verify {verificationMethod === 'email' ? 'Email' : 'Phone'}</ButtonText>
            <ActivityIndicator animating={isLoading} />
          </Button>

          {/* Resend Code */}
          <Button
            variant="link"
            action="secondary"
            className="mt-4 w-full"
            disabled={countdown > 0 || isResending}
            onPress={handleResendCode}
          >
            <ButtonText>
              {countdown > 0 
                ? `Resend code in ${countdown}s` 
                : isResending 
                  ? "Sending..." 
                  : "Resend verification code"
              }
            </ButtonText>
            <ActivityIndicator animating={isResending} />
          </Button>

          {/* Skip Verification */}
          <Button
            variant="outline"
            action="secondary"
            className="mt-4 w-full"
            onPress={handleSkipVerification}
          >
            <ButtonText>Skip for now</ButtonText>
          </Button>

          {/* Back to Login */}
          <Button
            variant="link"
            action="secondary"
            className="mt-4 w-full"
            onPress={handleBackToLogin}
          >
            <ButtonIcon as={ArrowLeftIcon} />
            <ButtonText>Back to Login</ButtonText>
          </Button>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
