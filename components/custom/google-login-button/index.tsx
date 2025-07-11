import { Button, ButtonText } from '@/components/ui/button';
import {
    GoogleSignin as GoogleOGneTapSignIn,
} from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';
import GoogleSvg from "@/assets/icons/icons8-google-48.svg";
import { View } from 'react-native';

export function GoogleLoginButton({ className }: { className?: string }) {
    const startSignInFlow = async () => {
        try {
            await GoogleOGneTapSignIn.hasPlayServices();
            const signInResponse = await GoogleOGneTapSignIn.signIn();
            if (signInResponse.type === 'success') {
                // use signInResponse.data

                console.log("sign data", signInResponse.data);
            } else if (signInResponse.type === 'cancelled') {
                Alert.alert("Signin was cancelled!")
            }
            // the else branches correspond to the user canceling the sign in
        } catch (error) {
            // handle error

            console.log("error", error);
        }
    };

    return (<Button
        onPress={startSignInFlow}
        className={`bg-white rounded-lg flex justify-between data-[active=true]:opacity-60 data-[active=true]:bg-white-500 ${className}`}
    >
       <GoogleSvg width={24} height={24} style={{ marginRight: 10, }} />
        <ButtonText className='self-center'>Sign in with Google</ButtonText>
        <View />
    </Button>)
}