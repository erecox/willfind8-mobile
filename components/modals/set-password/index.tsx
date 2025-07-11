import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { AlertCircleIcon, ArrowLeftIcon, EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
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
    FormControlHelper,
    FormControlHelperText,
    FormControlLabel,
    FormControlLabelText
} from "@/components/ui/form-control";

interface props {
    isOpen?: boolean;
    onClose?: () => void;
}

const LoginSchema = Yup.object().shape({
    password: Yup.string()
        .min(6, "At least 6 characters are required.")
        .required("Password is required."),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords do not match.")
        .required("Please confirm your password."),
});

export function ForgotPasswordModal({ isOpen, onClose }: props) {
    const [submitting, setSubmitting] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const formik = useFormik({
        initialValues: {
            loginId: "",
            password: "",
            confirmPassword: "",
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
                    <Heading>Set new password</Heading>
                    <Text size="sm">Almost done. Enter your new password and you are all set.</Text>
                </ModalHeader>
                <ModalBody className="" contentContainerClassName="gap-3">

                    {/* Password Field */}
                    <FormControl
                        isInvalid={!!(formik.touched.password && formik.errors.password)}
                        className="w-full mt-6"
                    >
                        <FormControlLabel>
                            <FormControlLabelText size="sm">Password</FormControlLabelText>
                        </FormControlLabel>
                        <Input>
                            <InputField
                                type={showPassword1 ? "text" : "password"}
                                value={formik.values.password}
                                onChangeText={formik.handleChange("password")}
                                onBlur={formik.handleBlur("password")}
                                placeholder="Enter your password"
                            />
                            <InputSlot
                                onPress={() => setShowPassword1(!showPassword1)}
                                className="mr-3"
                            >
                                <InputIcon as={showPassword1 ? EyeIcon : EyeOffIcon} />
                            </InputSlot>
                        </Input>
                        <FormControlHelper>
                            <FormControlHelperText size="xs">
                                Must be at least 6 characters.
                            </FormControlHelperText>
                        </FormControlHelper>
                        {formik.touched.password && formik.errors.password && (
                            <FormControlError>
                                <FormControlErrorIcon as={AlertCircleIcon} />
                                <FormControlErrorText size="xs">
                                    {formik.errors.password}
                                </FormControlErrorText>
                            </FormControlError>
                        )}
                    </FormControl>

                    {/* Confirm Password Field */}
                    <FormControl
                        isInvalid={
                            !!(
                                formik.touched.confirmPassword && formik.errors.confirmPassword
                            )
                        }
                        className="mt-6 w-full"
                    >
                        <FormControlLabel>
                            <FormControlLabelText size="sm">
                                Confirm Password
                            </FormControlLabelText>
                        </FormControlLabel>
                        <Input>
                            <InputField
                                type={showPassword2 ? "text" : "password"}
                                value={formik.values.confirmPassword}
                                onChangeText={formik.handleChange("confirmPassword")}
                                onBlur={formik.handleBlur("confirmPassword")}
                                placeholder="Enter password again"
                            />
                            <InputSlot
                                onPress={() => setShowPassword2(!showPassword2)}
                                className="mr-3"
                            >
                                <InputIcon as={showPassword2 ? EyeIcon : EyeOffIcon} />
                            </InputSlot>
                        </Input>
                        <FormControlHelper>
                            <FormControlHelperText size="xs">
                                Should match the password above.
                            </FormControlHelperText>
                        </FormControlHelper>
                        {formik.touched.confirmPassword &&
                            formik.errors.confirmPassword && (
                                <FormControlError>
                                    <FormControlErrorIcon as={AlertCircleIcon} />
                                    <FormControlErrorText size="xs">
                                        {formik.errors.confirmPassword}
                                    </FormControlErrorText>
                                </FormControlError>
                            )}
                    </FormControl>
                </ModalBody>
                <ModalFooter className="flex-col items-start">
                    <Button onPress={onClose} className="w-full" >
                        <ButtonText>Submit</ButtonText>
                    </Button>
                    <Button variant="link" size="sm" onPress={onClose} className="gap-1" >
                        <ButtonIcon as={ArrowLeftIcon} />
                        <ButtonText>Back to login</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>);
}