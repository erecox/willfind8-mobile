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
import { ActivityIndicator } from "react-native";

interface props {
    isOpen?: boolean;
    onClose?: () => void;
}

const LoginSchema = Yup.object().shape({
    loginId: Yup.string().required("Email or phone is required.")
});

export function ForgotPasswordModal({ isOpen, onClose }: props) {
    const [submitting, setSubmitting] = useState(false);

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
                    <Heading>Forgot password?</Heading>
                    <Text size="sm">No worries, we'll send you reset instructions</Text>
                </ModalHeader>

                <ModalBody className="mb-4">
                    <FormControl isInvalid={!!(formik.touched.loginId && formik.errors.loginId)} className="w-full">
                        <FormControlLabel>
                            <FormControlLabelText size="sm">
                                Email or Phone
                            </FormControlLabelText>
                        </FormControlLabel>
                        <Input>
                            <InputField
                                type={"text"}
                                keyboardType="email-address"
                                value={formik.values.loginId}
                                onChangeText={formik.handleChange("loginId")}
                                onBlur={formik.handleBlur("loginId")}
                                placeholder="Enter your email or phone"
                            />
                        </Input>
                        {formik.touched.loginId && formik.errors.loginId && (
                            <FormControlError>
                                <FormControlErrorIcon as={AlertCircleIcon} />
                                <FormControlErrorText size="xs">
                                    {formik.errors.loginId}
                                </FormControlErrorText>
                            </FormControlError>
                        )}
                    </FormControl>
                </ModalBody>
                
                <ModalFooter className="flex-col items-start">
                    <Button
                        isDisabled={!formik.isValid || submitting}
                        onPress={formik.handleSubmit as any}
                        className="w-full">
                        <ButtonText>Submit</ButtonText>
                        <ActivityIndicator animating={submitting} />
                    </Button>
                    <Button variant="link" size="sm" onPress={onClose} className="gap-1" >
                        <ButtonIcon as={ArrowLeftIcon} />
                        <ButtonText>Back to login</ButtonText>
                    </Button>
                </ModalFooter></ModalContent>
        </Modal>);
}