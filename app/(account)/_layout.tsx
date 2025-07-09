import { Stack } from "expo-router";
import React from "react";

export default function AccountLayout() {

    return (
        <Stack>
            <Stack.Screen name="about-us" options={{title:"About Us"}} />
            <Stack.Screen name="business-information" options={{title:"Business Information"}} />
            <Stack.Screen name="customer-support" options={{title:"Customer Support"}} />
            <Stack.Screen name="faq" options={{title:"Frequently Asked Question"}} />
            <Stack.Screen name="following" options={{title:"Followed Sellers"}} />
            <Stack.Screen name="messages" options={{title:"Messages"}} />
            <Stack.Screen name="my-ads" options={{title:"My Ads"}} />
            <Stack.Screen name="payment-settings" options={{title:"Payment Settings"}} />
            <Stack.Screen name="recently-viewed" options={{title:"Recently Viewed"}} />
            <Stack.Screen name="reviews" options={{title:"Ratings & Reviews"}} />
            <Stack.Screen name="settings" options={{title:"Settings"}} />
            <Stack.Screen name="terms" options={{title:"Terms of Use"}} />
        </Stack>
    )
}