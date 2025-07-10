import * as WebBrowser from "expo-web-browser";
import * as Facebook from "expo-auth-session/providers/facebook";
import { useEffect } from "react";
import { Button, ButtonText } from "@/components/ui/button";
import { useAuthStore } from "@/hooks/useAuth";
import FaceBookSvg from "@/assets/icons/icons8-facebook.svg";

WebBrowser.maybeCompleteAuthSession();

interface ButtonPropType {
    onPress?: () => void;
    className?: string;
}

export function FacebookLoginButton({onPress,className}:ButtonPropType) {
    const { setUser } = useAuthStore();

    const [request, response, promptAsync] = Facebook.useAuthRequest({
        clientId: "<YOUR_FACEBOOK_APP_ID>",
    });

    useEffect(() => {
        if (response?.type === "success") {

        }
    }, [response]);

    return (
        <Button
            disabled={!request}
            onPress={() => promptAsync()}
            className={`bg-white rounded-lg data-[active=true]:opacity-60 data-[active=true]:bg-white-500 ${className}`}
        >
            <FaceBookSvg width={24} height={24} style={{ marginRight: 10 }} />
            <ButtonText>Sign in with Facebook</ButtonText>
        </Button>
    );
}
