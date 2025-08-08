import { GoogleLoginButton } from "@/components/custom/google-login-button";
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogHeader
} from "@/components/ui/alert-dialog";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import React, { useCallback } from "react";

interface AuthAlertProps {
    onClose: () => void;
    showAlertDialog: boolean;
};

export const AuthAlert = ({ onClose, showAlertDialog }: AuthAlertProps) => {
    const handleLoginPress = useCallback(() => {
        router.push('/(auth)/login');
        onClose();
    }, []);

    const handleSignUpPress = useCallback(() => {
        router.push('/(auth)/signup');
        onClose();
    }, [])

    return (<>
        <AlertDialog className="px-5" isOpen={showAlertDialog} onClose={onClose}>
            <AlertDialogBackdrop />
            <AlertDialogContent className="w-full gap-4 items-center bg-background-100">
                <AlertDialogHeader className="mb-2">
                    <Heading size="md">Sign In</Heading>
                </AlertDialogHeader>
                <AlertDialogBody>

                    <VStack className="gap-5">
                        <Text size="sm" className="text-center">You need to login before you continue.</Text>
                        <Button size="sm"
                            onPress={handleLoginPress} >
                            <ButtonText>Login</ButtonText>
                        </Button>

                        <Button variant="outline" size="sm"
                            onPress={handleSignUpPress} >
                            <ButtonText>Sign up</ButtonText>
                        </Button>

                        <GoogleLoginButton onSuccess={onClose} size='md' />

                        <Button variant="link" size="sm"
                            onPress={onClose} >
                            <ButtonText className="text-black data-[active=true]:text-gray-500">Cancel</ButtonText>
                        </Button>
                    </VStack>
                </AlertDialogBody>
            </AlertDialogContent>
        </AlertDialog>
    </>
    )
}