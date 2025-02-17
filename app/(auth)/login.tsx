import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { Button, lightColors, Text } from "@rneui/themed";
import { StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

import TextInput from "@/components/inputs/TextInput";
import { useFetchAuth } from "@/hooks/store/useFetchAuth";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth/AuthProvider";
import { handleRegisterForPushNotification } from "@/lib/push-notification";

// Validation schema using Yup
const LoginSchema = Yup.object().shape({
  auth_field: Yup.string().required(),
  email: Yup.string()
    .email("Invalid email address")
    .when("auth_field", {
      is: "email",
      then: (schema: any) => schema.required("Email is required"),
      otherwise: (schema: any) => schema.notRequired(),
    }),
  phone: Yup.string()
    .matches(/^\+?[0-9]{10,15}$/, "Invalid phone number")
    .when("auth_field", {
      is: "phone",
      then: (schema: any) => schema.required("Phone number is required"),
    }),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginScreen = () => {
  const {
    login: requestLogin,
    extra,
    isLoading,
    response,
    error,
  } = useFetchAuth();
  const [auth_field, setAuthField] = useState<"email" | "phone">("email"); // Determines whether email or phone is active
  const { login } = useAuth();

  useEffect(() => {
    if (error) Alert.alert("Login Failed!", error);
    else if (response && typeof response !== "boolean") {
      login(response, extra?.authToken || "");
      handleRegisterForPushNotification();
      router.dismissAll();
      router.push("/(tabs)");
    }
  }, [response, error]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sign In</Text>
      </View>
      <Formik
        initialValues={{
          email: "",
          phone: "",
          password: "",
          auth_field: "email",
        }}
        validationSchema={LoginSchema}
        onSubmit={async (values) => {
          requestLogin(values);
        }}
      >
        {({
          handleChange,
          setFieldValue,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
        }) => (
          <View style={styles.content}>
            {false && (
              <Button
                title={`Switch to ${
                  auth_field === "email" ? "Phone" : "Email"
                }`}
                buttonStyle={styles.toggleButton}
                onPress={() => {
                  setAuthField(auth_field === "email" ? "phone" : "email");
                  setFieldValue(
                    "auth_field",
                    auth_field === "email" ? "phone" : "email"
                  );
                }}
                titleStyle={{ color: lightColors.grey2 }}
                type="clear"
                icon={{ name: "swap-horiz", color: lightColors.grey2 }}
              />
            )}
            {auth_field === "email" && (
              <TextInput
                label="Email"
                inputMode="email"
                placeholder="Enter your email"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                errorMessage={touched.email && errors.email ? errors.email : ""}
              />
            )}
            {auth_field === "phone" && (
              <TextInput
                label="Phone"
                placeholder="Enter your phone number"
                value={values.phone}
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                inputMode="numeric"
                errorMessage={touched.phone && errors.phone ? errors.phone : ""}
              />
            )}
            <TextInput
              label="Password"
              placeholder="Enter your password"
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              secureTextEntry
              errorMessage={
                touched.password && errors.password ? errors.password : ""
              }
            />
            <Button
              size="lg"
              buttonStyle={styles.button}
              color={"primary"}
              title="Login"
              icon={
                isLoading ? (
                  <ActivityIndicator color="white" animating />
                ) : undefined
              }
              disabled={isLoading || !isValid}
              iconRight
              onPress={() => handleSubmit()}
            />

            <View style={{ paddingVertical: 10, gap: 20 }}>
              <Text
                onPress={() => router.push("../forgot-password")}
                style={{ color: lightColors.primary, textAlign: "center" }}
              >
                Forgot Password?
              </Text>
              <Text>
                Don't have an account?{" "}
                <Text
                  style={{ color: lightColors.primary }}
                  onPress={() => {
                    router.dismiss();
                    router.push("../signup");
                  }}
                >
                  Sign up
                </Text>
              </Text>
            </View>

            <Button
              onPress={() => router.replace("../(tabs)")}
              type="outline"
              radius={10}
              containerStyle={{ position: "absolute", bottom: -200 }}
              icon={{ name: "home", color: lightColors.primary }}
              title={"Go Home"}
            />
          </View>
        )}
      </Formik>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    height: "50%",
  },
  header: {
    marginTop: 60,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "600",
  },
  content: {
    rowGap: 16,
    marginTop: 16,
    alignItems: "center",
  },
  button: {
    marginTop: 20,
    width: 300,
    borderRadius: 8,
  },
  toggleButton: {
    width: 300,
    borderRadius: 8,
  },
});
