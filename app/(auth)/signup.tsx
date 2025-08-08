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
import { AlertCircleIcon, ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icon";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuthStore } from "@/hooks/useAuth";
import { router } from "expo-router";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { LogoIcon } from "@/components/custom/logo-icon";
import { GoogleLoginButton } from "@/components/custom/google-login-button";
import { ActivityIndicator } from "react-native";
import { useAppToast } from "@/hooks/useToast";

const SignUpSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .when('signupMethod', {
      is: 'email',
      then: (schema) => schema.required("Email is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  phone: Yup.string()
    .test('phone-format', 'Please enter a valid phone number', function (value) {
      if (!value) return true;
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
      return phoneRegex.test(value);
    })
    .when('signupMethod', {
      is: 'phone',
      then: (schema) => schema.required("Phone number is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  password: Yup.string()
    .min(6, "At least 6 characters are required")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
  signupMethod: Yup.string().oneOf(['email', 'phone']).required(),
});

export default function SignUpScreen() {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [signupMethod, setSignupMethod] = useState<'email' | 'phone'>('email');
  const { registerAsync, isLoading, error, clearError } = useAuthStore();
  const { showError, showSuccess, showInfo } = useAppToast();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      signupMethod: 'email' as 'email' | 'phone',
    },
    validationSchema: SignUpSchema,
    onSubmit: async (values) => {
      try {
        clearError();

        // Prepare registration data
        const registrationData: any = {
          username: values.username.trim(),
          password: values.password,
          ...(values.email && { email: values.email }),
          ...(values.phone && { phone: values.phone }),
        };

        const result = await registerAsync(registrationData);

        showSuccess(
          "Account Created Successfully!",
          "Welcome to WillFind8! Please verify your account to complete setup."
        );

        // Navigate to verification screen
        const verificationMethod = signupMethod;
        const contactInfo = signupMethod === 'email' ? values.email : values.phone;
        
        router.push({
          pathname: "/(auth)/verify",
          params: { 
            method: verificationMethod,
            contact: contactInfo
          }
        });
      } catch (error: any) {
        showError(
          "Registration Failed",
          error.response?.data?.message || "Please check your information and try again."
        );
      }
    },
  });

  // Show error if exists
  React.useEffect(() => {
    if (error) {
      showError("Registration Error", error);
    }
  }, [error]);

  return (
    <SafeAreaView className="flex-1 bg-background-50">
      <ScrollView
        className="bg-background-50"
      >
        <Box className="px-5 rounded-lg bg-background-0">
          <Center className="mb-5">
            <LogoIcon />
            <Heading size="md" className="text-center">
              Create Your Willfind8 Account
            </Heading>
            <Text size="2xs" className="text-center mt-2">
              Sign up with your email or phone number to get started. You'll set up your personal info after verification.
            </Text>
          </Center>
          {/* Signup Method Toggle */}
          <Box className="flex-row gap-2">
            <Button
              size="xs"
              variant={signupMethod === 'email' ? 'solid' : 'outline'}
              action={signupMethod === 'email' ? 'positive' : 'secondary'}
              className="flex-1"
              onPress={() => {
                setSignupMethod('email');
                formik.setFieldValue('signupMethod', 'email');
                formik.setFieldValue('phone', '');
              }}
            >
              <ButtonText>Sign up with Email</ButtonText>
            </Button>
            <Button
              size="xs"
              variant={signupMethod === 'phone' ? 'solid' : 'outline'}
              action={signupMethod === 'phone' ? 'positive' : 'secondary'}
              className="flex-1"
              onPress={() => {
                setSignupMethod('phone');
                formik.setFieldValue('signupMethod', 'phone');
                formik.setFieldValue('email', '');
              }}
            >
              <ButtonText>Sign up with Phone</ButtonText>
            </Button>
          </Box>

          {/* Username */}
          <FormControl
            isInvalid={!!(formik.touched.username && formik.errors.username)}
            className="w-full mt-2"
          >
            <FormControlLabel>
              <FormControlLabelText size="sm">
                Username
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                value={formik.values.username}
                onChangeText={formik.handleChange("username")}
                onBlur={formik.handleBlur("username")}
                placeholder="Enter your username"
              />
            </Input>
            {formik.touched.username && formik.errors.username && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText size="xs">
                  {formik.errors.username}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Email Field - Only show when email signup is selected */}
          {signupMethod === 'email' && (
            <FormControl
              isInvalid={!!(formik.touched.email && formik.errors.email)}
              className="w-full mt-4"
            >
              <FormControlLabel>
                <FormControlLabelText size="sm">
                  Email Address
                </FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  type="text"
                  keyboardType="email-address"
                  value={formik.values.email}
                  onChangeText={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                  placeholder="Enter your email address"
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
          )}

          {/* Phone Field - Only show when phone signup is selected */}
          {signupMethod === 'phone' && (
            <FormControl
              isInvalid={!!(formik.touched.phone && formik.errors.phone)}
              className="w-full mt-4"
            >
              <FormControlLabel>
                <FormControlLabelText size="sm">
                  Phone Number
                </FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  type="text"
                  keyboardType="phone-pad"
                  value={formik.values.phone}
                  onChangeText={formik.handleChange("phone")}
                  onBlur={formik.handleBlur("phone")}
                  placeholder="Enter your phone number"
                />
              </Input>
              {formik.touched.phone && formik.errors.phone && (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText size="xs">
                    {formik.errors.phone}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          )}

          {/* Password Field */}
          <FormControl
            isInvalid={!!(formik.touched.password && formik.errors.password)}
            className="w-full mt-4"
          >
            <FormControlLabel>
              <FormControlLabelText size="sm">Password</FormControlLabelText>
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
                Confirm Password
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
            className="mt-4 w-full"
            disabled={!formik.isValid || isLoading}
            onPress={formik.handleSubmit as any}
          >
            <ButtonText>Create Account</ButtonText>
            <ActivityIndicator animating={isLoading} />
          </Button>
          <Box className="mt-4 items-center gap-1">
            <Text size="xs">Already have an account ?</Text>
            <Button
              variant="link"
              action="secondary"
              className=" w-full"
              onPress={() => router.back()}
            >
              <ButtonIcon as={ArrowLeftIcon} />
              <ButtonText size="sm" className="font-normal">Sign in Instead</ButtonText>
            </Button>
          </Box>
        </Box>

        <Box className="px-5 mt-4 gap-4 rounded-lg">
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
    </SafeAreaView>
  );
}
