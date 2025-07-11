import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { AlertCircleIcon, ArrowLeftIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import {
    Modal,
    ModalBackdrop, ModalBody,
    ModalContent, ModalFooter,
    ModalHeader
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
    FormControlLabel,
    FormControlLabelText
} from "@/components/ui/form-control";
import { Link, LinkText } from "@/components/ui/link";
import { HStack } from "@/components/ui/hstack";

interface props {
    isOpen?: boolean;
    onClose?: () => void;
}

const LoginSchema = Yup.object().shape({
    loginId: Yup.string().required("Email or phone is required.")
});

export function VerifyOtpModal({ isOpen, onClose }: props) {
    const [submitting, setSubmitting] = useState(false);

    const handleSendCode = () => {

    };

    const formik = useFormik({
        initialValues: {
            loginId: "",
        },
        validationSchema: LoginSchema,
        onSubmit: (values) => {
            setSubmitting(true);
            // handle login here
            console.log("values", values);
        },
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} >
            <ModalBackdrop />
            <ModalContent>
                <ModalHeader className="flex-col items-start gap-0.5">
                    <Heading>Reset password</Heading>
                    <Text size="sm">
                        A verification code has been sent to you. Enter code below.
                    </Text>
                </ModalHeader>

                <ModalBody className="mb-4">
                    <Input>
                        <InputField placeholder="Enter verification code" />
                    </Input>
                </ModalBody>

                <ModalFooter className="flex-col items-start">
                    <Button onPress={onClose} className="w-full" >
                        <ButtonText>Continue</ButtonText>
                    </Button>

                    <Text size="sm" className="">Didn’t receive the email?
                        <Link onPress={handleSendCode} className="">
                            <LinkText size="xs" className="text-typography-700 font-semibold" >Click to resend</LinkText>
                        </Link>
                    </Text>

                    <HStack space="xs" className="items-center">
                        <Button variant="link" size="sm" onPress={onClose} className="gap-1" >
                            <ButtonIcon as={ArrowLeftIcon} />
                            <ButtonText>Back to login</ButtonText>
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>);
}