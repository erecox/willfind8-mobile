
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader
} from "@/components/ui/alert-dialog";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Icon, TrashIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import React from "react";

interface DeleteAccountAlertProps {
    showAlertDialog?: boolean;
    handleClose?: () => void;
}
export function DeleteAccountAlert({ showAlertDialog, handleClose }: DeleteAccountAlertProps) {

    return (
        <AlertDialog className="px-5" isOpen={showAlertDialog} onClose={handleClose}>
            <AlertDialogBackdrop />

            <AlertDialogContent className="w-full max-w-[415px] gap-4 items-center">
                <Box className="rounded-full h-[52px] w-[52px] bg-background-error items-center justify-center">
                    <Icon as={TrashIcon} size="lg" className="stroke-error-500" />
                </Box>

                <AlertDialogHeader className="mb-2">
                    <Heading size="md">Delete account?</Heading>
                </AlertDialogHeader>

                <AlertDialogBody>
                    <Text size="sm" className="text-center">
                        This cannot be undone.
                    </Text>
                </AlertDialogBody>

                <AlertDialogFooter className="mt-5">
                    <Button size="sm" action="negative" onPress={handleClose} className="px-[30px]" >
                        <ButtonText>Delete</ButtonText>
                    </Button>

                    <Button variant="outline" action="secondary" onPress={handleClose}
                        size="sm" className="px-[30px]" >
                        <ButtonText>Cancel</ButtonText>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}