import React, { useState } from "react";
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
import { AlertCircleIcon } from "@/components/ui/icon";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { ArrowRightIcon, EyeIcon, EyeOffIcon } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuthStore } from "@/hooks/useAuth";
import { router } from "expo-router";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { GoogleLoginButton } from "@/components/custom/google-login-button";
import { LogoIcon } from "@/components/custom/logo-icon";
import { Link, LinkText } from "@/components/ui/link";
import { ForgotPasswordModal } from "@/components/modals/forgot-password";
import { ActivityIndicator } from "react-native";
import { useAppToast } from "@/hooks/useToast";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .test('email-or-phone', 'Please enter a valid email address or phone number', function(value) {
      if (!value) return false;
      
      // Check if it's a valid email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(value)) return true;
      
      // Check if it's a valid phone number (basic validation)
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
      if (phoneRegex.test(value)) return true;
      
      return false;
    }),
  password: Yup.string()
    .min(6, "At least 6 characters are required")
    .required("Password is required"),
});

export default function LoginLayout() {
  const { loginId: signInLoginId } = useLocalSearchParams();
  const [showPassword1, setShowPassword1] = useState(false);
  const [showForgotPassModel, setShowForgotPassModel] = useState(false);
  const { loginAsync, isLoading, error, clearError } = useAuthStore();
  const { showError, showSuccess, showInfo } = useAppToast();

  const handleCreateAccount = () => {
    router.push({
      'pathname': '/signup',
      params: { loginId: formik.values.email }
    });
  }

  const formik = useFormik({
    initialValues: {
      email: signInLoginId?.toString() || "",
      password: ""
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      try {
        clearError();
        const result = await loginAsync(values);
        
        showSuccess("Login Successful", "Welcome back to WillFind8!");
        
        // Check if user needs verification
        const { user } = useAuthStore.getState();
        if (user && !user.isVerified) {
          // Determine verification method based on user data
          const hasEmail = user.email && user.emailVerified === false;
          const hasPhone = user.phone && user.phoneVerified === false;
          
          if (hasEmail || hasPhone) {
            const method = hasEmail ? 'email' : 'phone';
            const contact = hasEmail ? user.email : user.phone;
            
            showInfo(
              "Verification Required",
              `Please verify your ${method} to access all features.`
            );
            
            router.push({
              pathname: "/(auth)/verify",
              params: { 
                method,
                contact
              }
            });
            return;
          }
        }
        
        // Navigate back or to main screen on success
        if (router.canGoBack()) {
          router.back();
        } else {
          router.push("/(tabs)");
        }
      } catch (error: any) {
        // Error is handled in the auth store
        showError(
          "Login Failed", 
          error.response?.data?.message || "Please check your credentials and try again."
        );
      }
    },
  });

  // Show error if exists
  React.useEffect(() => {
    if (error) {
      showError("Login Error", error);
    }
  }, [error]);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className={`bg-background-50`}
        keyboardShouldPersistTaps="handled"
      >
        <Box className="p-5 rounded-lg bg-background-0">
          <Center className="mb-5">
            <LogoIcon />
            <Heading size="md" className="text-center">
              Welcome to Willfind8
            </Heading>
            <Text size='xs' className="text-center mt-3">
              Type your e-mail or phone number to log in or create a Willfind8 account.
            </Text>
          </Center>

          <FormControl isInvalid={!!(formik.touched.email && formik.errors.email)} className="w-full">
            <FormControlLabel>
              <FormControlLabelText size="sm">
                Email or Phone
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type={"text"}
                keyboardType="default"
                value={formik.values.email}
                onChangeText={formik.handleChange("email")}
                onBlur={formik.handleBlur("email")}
                placeholder="Enter your email or phone number"
              />
            </Input>
            {formik.touched.email && formik.errors.email && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText size="xs">
                  {formik.errors.email}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl isInvalid={!!(formik.touched.password && formik.errors.password)} className="w-full mt-6">
            <FormControlLabel>
              <FormControlLabelText size="sm">
                Password
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type={showPassword1 ? "text" : "password"}
                value={formik.values.password}
                onChangeText={formik.handleChange("password")}
                onBlur={formik.handleBlur("password")}
                placeholder="Enter your password"
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
                Must be atleast 6 characters.
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

          <Button
            className="mt-8 w-full"
            isDisabled={!formik.isValid || isLoading}
            onPress={formik.handleSubmit as any}
          >
            <ButtonText>Login</ButtonText>
            <ActivityIndicator animating={isLoading} />
          </Button>

          <Link onPress={() => setShowForgotPassModel(true)} className="mt-4" >
            <LinkText size="sm" className="no-underline">Forgot password? click here</LinkText>
          </Link>

          <Button
            onPress={handleCreateAccount}
            variant="outline"
            className="mt-6 w-full"
          >
            <ButtonText>Create An Account</ButtonText>
          </Button>
        </Box>
        <Box className="p-5 gap-5">
          <GoogleLoginButton />
          {/* <FacebookLoginButton /> */}

          <Button
            onPress={() => router.replace('/(tabs)')}
            variant="link"
            size="md"
            action="secondary"
            className="w-full border-dashed"
          >
            <ButtonText>Continue Shopping</ButtonText>
            <ButtonIcon as={ArrowRightIcon} />
          </Button>
        </Box>
      </ScrollView>
      <ForgotPasswordModal
        isOpen={showForgotPassModel}
        onClose={() => setShowForgotPassModel(false)}
      />
    </SafeAreaView>
  );
}
