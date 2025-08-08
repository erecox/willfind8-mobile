import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import {
    GoogleSignin as GoogleOGneTapSignIn,
} from '@react-native-google-signin/google-signin';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/hooks/useAuth';
import { useState } from 'react';
import { useAppToast } from '@/hooks/useToast';
import { router } from 'expo-router';
import { GoogleIcon } from '@/components/custom/icons/google-icon';

export function GoogleLoginButton({ size, className, onSuccess }: { className?: string, size?: "xs" | "sm" | "md" | "lg" | "xl", onSuccess?: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const { socialAuthAsync } = useAuthStore();
    const { showError, showSuccess } = useAppToast();

    const startSignInFlow = async () => {
        try {
            setIsLoading(true);
            await GoogleOGneTapSignIn.hasPlayServices();
            const token = GoogleOGneTapSignIn.getCurrentUser()?.idToken;
            await GoogleOGneTapSignIn.signOut();
            if (token) await GoogleOGneTapSignIn.clearCachedAccessToken(token);
            const signInResponse = await GoogleOGneTapSignIn.signIn();

            if (signInResponse.type === 'success') {
                const googleUser = signInResponse.data.user;

                // Prepare social auth data
                const socialAuthData = {
                    providerId: googleUser.id,
                    provider: 'GOOGLE' as const,
                    email: googleUser.email,
                    firstName: googleUser.givenName || undefined,
                    lastName: googleUser.familyName || undefined,
                    avatar: googleUser.photo || undefined
                };

                // Send to backend API
                await socialAuthAsync(socialAuthData);

                showSuccess(
                    "Google Sign-In Successful!",
                    "Welcome to WillFind8!"
                );

                // Navigate back or to main screen on success
                if (router.canGoBack()) {
                    router.back();
                } else {
                    router.replace("/(tabs)");
                }
                if (onSuccess) onSuccess();

            } else if (signInResponse.type === 'cancelled') {
                // User cancelled, no need to show error
                console.log("Google sign-in cancelled");
            }
        } catch (error: any) {
            showError(
                "Google Sign-In Error",
                error.message || "Failed to sign in with Google. Please try again."
            );
            console.log("Google sign-in error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            size={size}
            onPress={startSignInFlow}
            disabled={isLoading}
            className={`bg-white rounded-lg flex-row justify-center items-center data-[active=true]:opacity-60 data-[active=true]:bg-white-500 ${className}`}
        >
            <GoogleIcon />
            <ButtonText className='text-black flex-1 text-center'>
                {isLoading ? "Signing in..." : "Sign in with Google"}
            </ButtonText>
            <ActivityIndicator animating={isLoading} size="small" />
        </Button>
    );
}
