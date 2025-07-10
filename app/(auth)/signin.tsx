import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { AlertCircleIcon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuthStore } from "@/hooks/useAuth";
import { router } from "expo-router";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { GoogleLoginButton } from "@/components/custom/google-login-button";
import { FacebookLoginButton } from "@/components/custom/facebook-login-button";

const LoginSchema = Yup.object().shape({
  loginId: Yup.string().required("Login ID is required."),
});

export default function LoginLayout() {
  const [submitting, setSubmitting] = React.useState(false);

  const { setUser } = useAuthStore();

  const formik = useFormik({
    initialValues: {
      loginId: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      setSubmitting(true);
      // handle login here
      console.log("values", values);
      setUser({ ...values, id: 1, name: 'Eric Mensah', phone: values.loginId, email: values.loginId });
      if (router.canGoBack()) router.back();
      else router.push("/(tabs)");
    },
  });

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className={`bg-background-50`}
        contentContainerClassName="px-5 pt-10"
      >
        <Box className="p-5 rounded-lg bg-background-0">
          <Center className="mb-10">
            <Image alt="Logo" source={require('@/assets/images/icon.png')} />
            <Heading size="md" className="text-center">
              Welcome to Willfind8
            </Heading>
            <Text className="text-center mt-3">
              Type your e-mail or phone number to log in or create a Willfind8 account.
            </Text>
          </Center>

          <FormControl isInvalid={!!(formik.touched.loginId && formik.errors.loginId)} className="w-full">
            <FormControlLabel>
              <FormControlLabelText size="sm">
                Login ID
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type={"text"}
                keyboardType="email-address"
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

          <Button
            className="mt-8 w-full"
            size="sm"
            disabled={!formik.isValid || submitting}
            onPress={formik.handleSubmit as any}
          >
            <ButtonText>Continue</ButtonText>
          </Button>

          <Button
            variant="outline"
            className="mt-8 w-full border-dashed"
            size="sm"
          >
            <ButtonText>Create An Account</ButtonText>
          </Button>
        </Box>
        <Box className="p-5 rounded-lg">
          <GoogleLoginButton className="mt-3" />
          <FacebookLoginButton className="mt-3" />
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
