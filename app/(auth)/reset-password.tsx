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
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { AlertCircleIcon, ArrowLeftIcon, CheckCircleIcon } from "@/components/ui/icon";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
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
import { Icon } from "@/components/ui/icon";

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "At least 6 characters are required")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams();
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { showError, showSuccess } = useAppToast();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        
        if (!token) {
          showError("Invalid Reset Link", "The reset token is missing or invalid.");
          return;
        }

        await authService.resetPassword(token as string, values.password);
        
        showSuccess(
          "Password Reset Successfully!",
          "Your password has been updated. You can now log in with your new password."
        );
        
        setResetSuccess(true);
      } catch (error: any) {
        showError(
          "Reset Failed",
          error.message || "Failed to reset password. Please try again or request a new reset link."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Check if token is present
  useEffect(() => {
    if (!token) {
      showError("Invalid Reset Link", "This reset link is invalid or has expired.");
      router.replace("/(auth)/login");
    }
  }, [token]);

  const handleBackToLogin = () => {
    router.replace("/(auth)/login");
  };

  if (resetSuccess) {
    return (
      <SafeAreaView className="flex-1 bg-background-50">
        <ScrollView className="bg-background-50" contentContainerClassName="px-5 pt-10">
          <Box className="p-5 rounded-lg bg-background-0">
            <Center className="mb-8">
              <LogoIcon />
              <Icon as={CheckCircleIcon} className="h-16 w-16 text-success-500 mv-4" />
              <Heading size="md" className="text-center">
                Password Reset Complete!
              </Heading>
              <Text className="text-center mt-3" size="sm">
                Your password has been successfully updated. You can now log in with your new password.
              </Text>
            </Center>

            <Button
              className="w-full"
              onPress={handleBackToLogin}
            >
              <ButtonText>Continue to Login</ButtonText>
            </Button>
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
              Reset Your Password
            </Heading>
            <Text className="text-center mt-3" size="sm">
              Enter your new password below. Make sure it's secure and easy for you to remember.
            </Text>
          </Center>

          {/* New Password Field */}
          <FormControl
            isInvalid={!!(formik.touched.password && formik.errors.password)}
            className="w-full"
          >
            <FormControlLabel>
              <FormControlLabelText size="sm">New Password</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type={showPassword1 ? "text" : "password"}
                value={formik.values.password}
                onChangeText={formik.handleChange("password")}
                onBlur={formik.handleBlur("password")}
                placeholder="Enter your new password"
              />
              <InputSlot
                onPress={() => setShowPassword1(!showPassword1)}
                className="mr-3"
              >
                <InputIcon as={showPassword1 ? EyeIcon : EyeOffIcon} />
              </InputSlot>
            </Input>
            <FormControlHelper>
              <FormControlHelperText size="xs">
                Must be at least 6 characters.
              </FormControlHelperText>
            </FormControlHelper>
            {formik.touched.password && formik.errors.password && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText size="xs">
                  {formik.errors.password}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Confirm Password Field */}
          <FormControl
            isInvalid={
              !!(
                formik.touched.confirmPassword && formik.errors.confirmPassword
              )
            }
            className="mt-4 w-full"
          >
            <FormControlLabel>
              <FormControlLabelText size="sm">
                Confirm New Password
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type={showPassword2 ? "text" : "password"}
                value={formik.values.confirmPassword}
                onChangeText={formik.handleChange("confirmPassword")}
                onBlur={formik.handleBlur("confirmPassword")}
                placeholder="Enter password again"
              />
              <InputSlot
                onPress={() => setShowPassword2(!showPassword2)}
                className="mr-3"
              >
                <InputIcon as={showPassword2 ? EyeIcon : EyeOffIcon} />
              </InputSlot>
            </Input>
            <FormControlHelper>
              <FormControlHelperText size="xs">
                Should match the password above.
              </FormControlHelperText>
            </FormControlHelper>
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText size="xs">
                    {formik.errors.confirmPassword}
                  </FormControlErrorText>
                </FormControlError>
              )}
          </FormControl>

          {/* Submit Button */}
          <Button
            className="mt-6 w-full"
            disabled={!formik.isValid || isLoading}
            onPress={formik.handleSubmit as any}
          >
            <ButtonText>Reset Password</ButtonText>
            <ActivityIndicator animating={isLoading} />
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
