import React from "react";
import "@/styles/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import useThemeMode from "@/hooks/useThemeMode";
import { LoaderProvider } from "@/hooks/useLoading";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:"181055438274-h74907ar84b959aq09it4f95pkse0318.apps.googleusercontent.com",
  scopes: ["profile", "email"],
  offlineAccess: true,
});

export default function RootLayout() {
  const { themeMode } = useThemeMode();

  return (
    <>
      <GluestackUIProvider>
        <LoaderProvider>
          <Stack screenOptions={{ animation: "slide_from_right" }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />

            {/* Account Screens */}
            <Stack.Screen name="(account)/about-us" options={{title:"About Us"}} />
            <Stack.Screen name="(account)/business-information" options={{title:"Business Information"}} />
            <Stack.Screen name="(account)/customer-support" options={{title:"Customer Support"}} />
            <Stack.Screen name="(account)/faq" options={{title:"Frequently Asked Question"}} />
            <Stack.Screen name="(account)/following" options={{title:"Followed Sellers"}} />
            <Stack.Screen name="(account)/messages" options={{title:"Messages"}} />
            <Stack.Screen name="(account)/my-ads" options={{title:"My Ads"}} />
            <Stack.Screen name="(account)/payment-settings" options={{title:"Payment Settings"}} />
            <Stack.Screen name="(account)/recently-viewed" options={{title:"Recently Viewed"}} />
            <Stack.Screen name="(account)/reviews" options={{title:"Ratings & Reviews"}} />
            <Stack.Screen name="(account)/settings" options={{title:"Settings"}} />
            <Stack.Screen name="(account)/terms" options={{title:"Terms of Use"}} />
          </Stack> 
        </LoaderProvider>
      </GluestackUIProvider>
      <StatusBar style={themeMode} />
    </>
  );
}
