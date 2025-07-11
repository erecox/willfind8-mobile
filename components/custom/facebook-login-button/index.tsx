import { Button, ButtonText } from "@/components/ui/button";
import FaceBookSvg from "@/assets/icons/icons8-facebook.svg";
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { Alert, View } from "react-native";

interface ButtonPropType {
    className?: string;
}

export function FacebookLoginButton({ className }: ButtonPropType) {

    const signInWithFacebook = async () => {
        try {
            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
            if (result.isCancelled) {
                return Alert.alert('User cancelled the login process');
            }

            const data = await AccessToken.getCurrentAccessToken();
            if (!data) {
                return Alert.alert('Something went wrong', "Error code: 100");
            }

            const accessToken = data.accessToken.toString();
            // Send this token to your backend
            console.log('FB Access Token:', accessToken);

        } catch (error) {
            console.error('FB Login Error:', error);
        }
    };

    return (
        <Button
            onPress={signInWithFacebook}
            className={`bg-white rounded-lg flex justify-between data-[active=true]:opacity-60 data-[active=true]:bg-white-500 ${className}`}
        >
            <FaceBookSvg width={24} height={24} style={{ marginRight: 10 }} />
            <ButtonText>Sign in with Facebook</ButtonText>
             <View />
        </Button>
    );
}

