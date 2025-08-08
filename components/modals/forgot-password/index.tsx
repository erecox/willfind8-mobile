import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { AlertCircleIcon, ArrowLeftIcon, CheckCircleIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import {
    Modal,
    ModalBackdrop, ModalBody,
    ModalContent, ModalFooter,
    ModalHeader
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
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
import { authService } from "@/utils/authService";
import { useAppToast } from "@/hooks/useToast";
import { Center } from "@/components/ui/center";
import { Icon } from "@/components/ui/icon";

interface props {
    isOpen?: boolean;
    onClose?: () => void;
}

const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email("Please enter a valid email address")
        .when('resetMethod', {
            is: 'email',
            then: (schema) => schema.required("Email is required"),
            otherwise: (schema) => schema.notRequired(),
        }),
    phone: Yup.string()
        .test('phone-format', 'Please enter a valid phone number', function (value) {
            if (!value) return true;
            const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
            return phoneRegex.test(value);
        })
        .when('resetMethod', {
            is: 'phone',
            then: (schema) => schema.required("Phone number is required"),
            otherwise: (schema) => schema.notRequired(),
        }),
    otp: Yup.string()
        .when('resetMethod', {
            is: 'phone',
            then: (schema) => schema.length(6, "OTP must be 6 digits").matches(/^\d+$/, "OTP must contain only numbers"),
            otherwise: (schema) => schema.notRequired(),
        }),
    resetMethod: Yup.string().oneOf(['email', 'phone']).required(),
});

export function ForgotPasswordModal({ isOpen, onClose }: props) {
    const [submitting, setSubmitting] = useState(false);
    const [resetMethod, setResetMethod] = useState<'email' | 'phone'>('email');
    const [step, setStep] = useState<'method' | 'otp' | 'success'>('method');
    const [otpSent, setOtpSent] = useState(false);
    const { showError, showSuccess } = useAppToast();

    const formik = useFormik({
        initialValues: {
            email: "",
            phone: "",
            otp: "",
            resetMethod: 'email' as 'email' | 'phone',
        },
        validationSchema: ForgotPasswordSchema,
        onSubmit: async (values) => {
            try {
                setSubmitting(true);
                
                if (resetMethod === 'email') {
                    // Send reset email
                    await authService.forgotPassword(values.email);
                    
                    showSuccess(
                        "Reset Email Sent!",
                        "We've sent password reset instructions to your email address."
                    );
                    
                    setStep('success');
                } else if (resetMethod === 'phone' && !otpSent) {
                    // Send OTP to phone
                    await authService.sendPhoneOTP(values.phone);
                    
                    showSuccess(
                        "OTP Sent!",
                        "We've sent a verification code to your phone number."
                    );
                    
                    setOtpSent(true);
                } else if (resetMethod === 'phone' && otpSent) {
                    // Verify OTP and proceed to password reset
                    await authService.verifyPhoneOTPAndReset(values.phone, values.otp);
                    
                    showSuccess(
                        "OTP Verified!",
                        "Your phone number has been verified. You can now reset your password."
                    );
                    
                    setStep('success');
                }
            } catch (error: any) {
                showError(
                    "Reset Failed",
                    error.message || `Failed to ${otpSent ? 'verify OTP' : 'send reset instructions'}. Please try again.`
                );
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleClose = () => {
        setStep('method');
        setOtpSent(false);
        setResetMethod('email');
        formik.resetForm();
        onClose?.();
    };

    const handleMethodChange = (method: 'email' | 'phone') => {
        setResetMethod(method);
        setOtpSent(false);
        formik.setFieldValue('resetMethod', method);
        formik.setFieldValue('email', '');
        formik.setFieldValue('phone', '');
        formik.setFieldValue('otp', '');
    };

    const getHeaderText = () => {
        if (step === 'success') {
            return resetMethod === 'email' ? "Email Sent!" : "Phone Verified!";
        }
        return "Forgot password?";
    };

    const getSubHeaderText = () => {
        if (step === 'success') {
            return resetMethod === 'email' 
                ? "Check your email for reset instructions"
                : "You can now reset your password";
        }
        return "Choose how you'd like to reset your password";
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalBackdrop />
            <ModalContent>
                <ModalHeader className="flex-col items-start gap-0.5">
                    <Heading>{getHeaderText()}</Heading>
                    <Text size="sm">{getSubHeaderText()}</Text>
                </ModalHeader>

                <ModalBody className="mb-4">
                    {step === 'success' ? (
                        <Center className="py-6">
                            <Icon as={CheckCircleIcon} className="h-16 w-16 text-success-500 mb-4" />
                            {resetMethod === 'email' ? (
                                <>
                                    <Text className="text-center">
                                        We've sent a password reset link to{" "}
                                        <Text className="font-semibold">{formik.values.email}</Text>
                                    </Text>
                                    <Text size="sm" className="text-center mt-2 text-typography-500">
                                        Please check your email and click the link to reset your password.
                                        Don't forget to check your spam folder!
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Text className="text-center">
                                        Your phone number{" "}
                                        <Text className="font-semibold">{formik.values.phone}</Text>
                                        {" "}has been verified successfully.
                                    </Text>
                                    <Text size="sm" className="text-center mt-2 text-typography-500">
                                        You can now proceed to reset your password using the link sent to your registered email.
                                    </Text>
                                </>
                            )}
                        </Center>
                    ) : (
                        <>
                            {/* Reset Method Toggle */}
                            <Box className="flex-row gap-2 mb-4">
                                <Button
                                    size="xs"
                                    variant={resetMethod === 'email' ? 'solid' : 'outline'}
                                    action={resetMethod === 'email' ? 'positive' : 'secondary'}
                                    className="flex-1"
                                    onPress={() => handleMethodChange('email')}
                                >
                                    <ButtonText>Reset via Email</ButtonText>
                                </Button>
                                <Button
                                    size="xs"
                                    variant={resetMethod === 'phone' ? 'solid' : 'outline'}
                                    action={resetMethod === 'phone' ? 'positive' : 'secondary'}
                                    className="flex-1"
                                    onPress={() => handleMethodChange('phone')}
                                >
                                    <ButtonText>Reset via Phone</ButtonText>
                                </Button>
                            </Box>

                            {/* Email Field - Only show when email reset is selected */}
                            {resetMethod === 'email' && (
                                <FormControl
                                    isInvalid={!!(formik.touched.email && formik.errors.email)}
                                    className="w-full"
                                >
                                    <FormControlLabel>
                                        <FormControlLabelText size="sm">
                                            Email Address
                                        </FormControlLabelText>
                                    </FormControlLabel>
                                    <Input>
                                        <InputField
                                            type="text"
                                            keyboardType="email-address"
                                            value={formik.values.email}
                                            onChangeText={formik.handleChange("email")}
                                            onBlur={formik.handleBlur("email")}
                                            placeholder="Enter your email address"
                                        />
                                    </Input>
                                    {formik.touched.email && formik.errors.email && (
                                        <FormControlError>
                                            <FormControlErrorIcon as={AlertCircleIcon} />
                                            <FormControlErrorText size="xs">
                                                {formik.errors.email}
                                            </FormControlErrorText>
                                        </FormControlError>
                                    )}
                                </FormControl>
                            )}

                            {/* Phone Field - Only show when phone reset is selected */}
                            {resetMethod === 'phone' && (
                                <>
                                    <FormControl
                                        isInvalid={!!(formik.touched.phone && formik.errors.phone)}
                                        className="w-full mb-4"
                                    >
                                        <FormControlLabel>
                                            <FormControlLabelText size="sm">
                                                Phone Number
                                            </FormControlLabelText>
                                        </FormControlLabel>
                                        <Input>
                                            <InputField
                                                type="text"
                                                keyboardType="phone-pad"
                                                value={formik.values.phone}
                                                onChangeText={formik.handleChange("phone")}
                                                onBlur={formik.handleBlur("phone")}
                                                placeholder="Enter your phone number"
                                                editable={!otpSent}
                                            />
                                        </Input>
                                        {formik.touched.phone && formik.errors.phone && (
                                            <FormControlError>
                                                <FormControlErrorIcon as={AlertCircleIcon} />
                                                <FormControlErrorText size="xs">
                                                    {formik.errors.phone}
                                                </FormControlErrorText>
                                            </FormControlError>
                                        )}
                                    </FormControl>

                                    {/* OTP Field - Only show after OTP is sent */}
                                    {otpSent && (
                                        <FormControl
                                            isInvalid={!!(formik.touched.otp && formik.errors.otp)}
                                            className="w-full"
                                        >
                                            <FormControlLabel>
                                                <FormControlLabelText size="sm">
                                                    Verification Code
                                                </FormControlLabelText>
                                            </FormControlLabel>
                                            <Input>
                                                <InputField
                                                    type="text"
                                                    keyboardType="numeric"
                                                    value={formik.values.otp}
                                                    onChangeText={formik.handleChange("otp")}
                                                    onBlur={formik.handleBlur("otp")}
                                                    placeholder="Enter 6-digit code"
                                                    maxLength={6}
                                                />
                                            </Input>
                                            {formik.touched.otp && formik.errors.otp && (
                                                <FormControlError>
                                                    <FormControlErrorIcon as={AlertCircleIcon} />
                                                    <FormControlErrorText size="xs">
                                                        {formik.errors.otp}
                                                    </FormControlErrorText>
                                                </FormControlError>
                                            )}
                                            <Text size="xs" className="mt-1 text-typography-500">
                                                We've sent a 6-digit code to {formik.values.phone}
                                            </Text>
                                        </FormControl>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </ModalBody>
                
                <ModalFooter className="flex-col items-start">
                    {step !== 'success' ? (
                        <>
                            <Button
                                isDisabled={!formik.isValid || submitting}
                                onPress={formik.handleSubmit as any}
                                className="w-full"
                            >
                                <ButtonText>
                                    {resetMethod === 'email' 
                                        ? "Send Reset Email" 
                                        : otpSent 
                                            ? "Verify Code" 
                                            : "Send OTP"
                                    }
                                </ButtonText>
                                <ActivityIndicator animating={submitting} />
                            </Button>
                            
                            {resetMethod === 'phone' && otpSent && (
                                <Button 
                                    variant="link" 
                                    size="sm" 
                                    onPress={() => {
                                        setOtpSent(false);
                                        formik.setFieldValue('otp', '');
                                    }} 
                                    className="w-full mt-2"
                                >
                                    <ButtonText>Resend OTP</ButtonText>
                                </Button>
                            )}
                            
                            <Button variant="link" size="sm" onPress={handleClose} className="gap-1 mt-2">
                                <ButtonIcon as={ArrowLeftIcon} />
                                <ButtonText>Back to login</ButtonText>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onPress={handleClose} className="w-full">
                                <ButtonText>Done</ButtonText>
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onPress={() => {
                                    setStep('method');
                                    setOtpSent(false);
                                    formik.resetForm();
                                }} 
                                className="w-full mt-2"
                            >
                                <ButtonText>
                                    {resetMethod === 'email' 
                                        ? "Send to different email" 
                                        : "Try different phone number"
                                    }
                                </ButtonText>
                            </Button>
                        </>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
