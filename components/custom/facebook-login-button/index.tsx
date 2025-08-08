import { Button, ButtonText } from "@/components/ui/button";
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { View, ActivityIndicator } from "react-native";
import { useState } from 'react';
import { useAppToast } from '@/hooks/useToast';
import { useAuthStore } from '@/hooks/useAuth';
import { router } from 'expo-router';

interface ButtonPropType {
    className?: string;
}

export function FacebookLoginButton({ className }: ButtonPropType) {
    const [isLoading, setIsLoading] = useState(false);
    const { socialAuthAsync } = useAuthStore();
    const { showError, showSuccess } = useAppToast();

    const signInWithFacebook = async () => {
        try {
            setIsLoading(true);
            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
            
            if (result.isCancelled) {
                console.log('Facebook sign-in cancelled');
                return;
            }

            const data = await AccessToken.getCurrentAccessToken();
            if (!data) {
                showError(
                    "Facebook Sign-In Error",
                    "Failed to get Facebook access token. Please try again."
                );
                return;
            }

            // Get user profile from Facebook
            const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,first_name,last_name,picture&access_token=${data.accessToken}`);
            const userProfile = await response.json();

            if (!userProfile.id) {
                showError(
                    "Facebook Sign-In Error",
                    "Failed to get user profile from Facebook. Please try again."
                );
                return;
            }

            // Prepare social auth data
            const socialAuthData = {
                providerId: userProfile.id,
                provider: 'FACEBOOK' as const,
                email: userProfile.email,
                firstName: userProfile.first_name || undefined,
                lastName: userProfile.last_name || undefined,
                avatar: userProfile.picture?.data?.url || undefined
            };

            // Send to backend API
            await socialAuthAsync(socialAuthData);
            
            showSuccess(
                "Facebook Sign-In Successful!",
                "Welcome to WillFind8!"
            );
            
            // Navigate back or to main screen on success
            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace("/(tabs)");
            }

        } catch (error: any) {
            showError(
                "Facebook Sign-In Error",
                error.message || "Failed to sign in with Facebook. Please try again."
            );
            console.error('Facebook Login Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onPress={signInWithFacebook}
            disabled={isLoading}
            className={`bg-white rounded-lg flex-row justify-center items-center data-[active=true]:opacity-60 data-[active=true]:bg-white-500 ${className}`}
        >
            {/* Facebook Icon - using text for now since SVG import has issues */}
            <View className="w-6 h-6 mr-3 bg-blue-600 rounded-full items-center justify-center">
                <ButtonText className="text-white text-xs font-bold">f</ButtonText>
            </View>
            <ButtonText className='text-black flex-1 text-center'>
                {isLoading ? "Signing in..." : "Sign in with Facebook"}
            </ButtonText>
            <ActivityIndicator animating={isLoading} size="small" />
        </Button>
    );
}
