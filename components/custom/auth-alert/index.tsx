import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader
} from "@/components/ui/alert-dialog";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Icon, TrashIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { Box } from "lucide-react-native";
import React from "react";

interface AuthAlertProps {
    onClose: () => void;
    showAlertDialog: boolean;
};

export const AuthAlert = ({ onClose, showAlertDialog }: AuthAlertProps) => {
    const handleLoginPress = () => {
        router.push('/(auth)/login');
        onClose();
    }
    return (<>
        <AlertDialog isOpen={showAlertDialog} onClose={onClose}>
            <AlertDialogBackdrop />
            <AlertDialogContent className="w-full max-w-[415px] gap-4 items-center">
                <AlertDialogHeader className="mb-2">
                    <Heading size="md">Sign In</Heading>
                </AlertDialogHeader>
                <AlertDialogBody>
                    <Text size="sm" className="text-center">
                        The invoice will be deleted from the invoices section and in the documents folder.
                        This cannot be undone.</Text>
                    <Button size="sm" action="negative"
                        onPress={handleLoginPress} className="px-[30px]" >
                        <ButtonText>Login</ButtonText></Button>
                    <Button variant="outline" action="secondary" onPress={onClose}
                        size="sm" className="px-[30px]" >
                        <ButtonText>Cancel</ButtonText></Button>
                </AlertDialogBody>
            </AlertDialogContent>
        </AlertDialog>
    </>
    )
}