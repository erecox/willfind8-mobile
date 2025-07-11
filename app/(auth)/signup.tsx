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

const SignUpSchema = Yup.object().shape({
  loginId: Yup.string().required("Email or phone is required."),
  password: Yup.string()
    .min(6, "At least 6 characters are required.")
    .required("Password is required."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match.")
    .required("Please confirm your password."),
});

export default function SignUpScreen() {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
    const [submitting, setSubmitting] = useState(false);
  const { setUser } = useAuthStore();

  const formik = useFormik({
    initialValues: {
      name: "",
      loginId: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: SignUpSchema,
    onSubmit: (values) => {
      console.log("Sign up values", values);
      setUser({
        id: "123",
        email: values.loginId,
        phone: values.loginId,
        ...values,
      });

      router.push("/(tabs)");
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-background-50">
      <ScrollView
        className="bg-background-50"
        contentContainerClassName="px-5 pt-5"
      >
        <Box className="p-5 rounded-lg bg-background-0">
          <Center className="mb-8">
            <LogoIcon />
            <Heading size="md" className="text-center">
              Create Your Willfind8 Account
            </Heading>
            <Text className="text-center mt-3">
              Sign up with your email or phone number to get started.
            </Text>
          </Center>

          {/* Name */}
          <FormControl
            isInvalid={!!(formik.touched.name && formik.errors.name)}
            className="w-full"
          >
            <FormControlLabel>
              <FormControlLabelText size="sm">
                Name
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                value={formik.values.name}
                onChangeText={formik.handleChange("name")}
                onBlur={formik.handleBlur("name")}
                placeholder="Enter your namme"
              />
            </Input>
            {formik.touched.name && formik.errors.name && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText size="xs">
                  {formik.errors.name}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Login ID Field */}
          <FormControl
            isInvalid={!!(formik.touched.loginId && formik.errors.loginId)}
            className="w-full mt-6"
          >
            <FormControlLabel>
              <FormControlLabelText size="sm">
                Email or Phone
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                value={formik.values.loginId}
                onChangeText={formik.handleChange("loginId")}
                onBlur={formik.handleBlur("loginId")}
                placeholder="Enter your email or phone"
              />
            </Input>
            {formik.touched.loginId && formik.errors.loginId && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText size="xs">
                  {formik.errors.loginId}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Password Field */}
          <FormControl
            isInvalid={!!(formik.touched.password && formik.errors.password)}
            className="w-full mt-6"
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
            className="mt-6 w-full"
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
            className="mt-6 w-full"
            disabled={!formik.isValid}
            onPress={formik.handleSubmit as any}
          >
            <ButtonText>Create Account</ButtonText>
             <ActivityIndicator animating={submitting} />
          </Button>
          <Box className="mt-6 items-center gap-1">
            <Text size="xs">Already have an account ?</Text>
            <Button
              variant="link"
              action="secondary"
              className=" w-full"
              onPress={() => router.back()}
            >
              <ButtonIcon as={ArrowLeftIcon} />
              <ButtonText className="font-normal">Sign in Instead</ButtonText>
            </Button>
          </Box>
        </Box>

        <Box className="p-5 gap-5 rounded-lg">
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
