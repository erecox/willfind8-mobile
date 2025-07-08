import React from "react";
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
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { useFormik } from "formik";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  loginId: Yup.string().required("Login ID is required."),
  password: Yup.string()
    .min(6, "Atleast 6 characters are required.")
    .required("Password is required."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match.")
    .required("Confirm Password is required."),
});

export default function LoginLayout() {
  const [showPassword1, setShowPassword1] = React.useState(false);
  const [showPassword2, setShowPassword2] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      loginId: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      // handle login here
      console.log("values", values);
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
              Type your e-mail or phone number to log in or create a Jumia account.
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

          <FormControl isInvalid={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)} className="mt-6 w-full">
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
                Must be same as password.
              </FormControlHelperText>
            </FormControlHelper>

            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText size="xs">
                  {formik.errors.confirmPassword}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <Button
            className="mt-8 w-full"
            size="sm"
            onPress={formik.handleSubmit as any}
          >
            <ButtonText>Login</ButtonText>
          </Button>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
