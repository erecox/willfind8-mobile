import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";
import { Button, ButtonText } from "@/components/ui/button";
import { useAuthStore } from "@/hooks/useAuth";
import GoogleSvg from "@/assets/icons/icons8-google-48.svg";

WebBrowser.maybeCompleteAuthSession();

interface ButtonPropType {
    onPress?: () => void;
    className?: string;
}
export function GoogleLoginButton({ onPress, className }: ButtonPropType) {
    const { login } = useAuthStore();

    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: "<YOUR_IOS_CLIENT_ID>",
        androidClientId: "181055438274-m9nla3ahvmvkji46me7qqitb9riqajpc.apps.googleusercontent.com",
        webClientId: "<YOUR_WEB_CLIENT_ID>",
    });

    useEffect(() => {
        if (response?.type === "success") {
            const { authentication } = response;
            console.log('authentication', authentication);
        }
    }, [response]);

    return (
        <Button
            disabled={!request}
            onPress={() => promptAsync()}
            className={`bg-white rounded-lg data-[active=true]:opacity-60 data-[active=true]:bg-white-500 shadow-hard-1 ${className}`}>
            <GoogleSvg width={24} height={24} style={{ marginRight: 10 }} />
            <ButtonText className="text-black">Sign in with Google</ButtonText>
        </Button>
    );
}