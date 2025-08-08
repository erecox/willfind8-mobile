import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { ModalBackdrop } from "@/components/ui/modal";
import { ModalContent } from "@/components/ui/modal";
import { ModalHeader } from "@/components/ui/modal";
import { ModalCloseButton } from "@/components/ui/modal";
import { ModalBody } from "@/components/ui/modal";
import { ModalFooter } from "@/components/ui/modal";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText, FormControlHelper, FormControlHelperText } from "@/components/ui/form-control";
import { Icon } from "@/components/ui/icon";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ActivityIndicator } from "react-native";
import { useAppToast } from "@/hooks/useToast";
import { authService } from "@/utils/authService";
import { userService } from "@/utils/userService";
import { XIcon, MailIcon, PhoneIcon, AlertCircleIcon } from "lucide-react-native";

const VerificationSchema = Yup.object().shape({
  code: Yup.string()
    .length(6, "Verification code must be 6 digits")
    .matches(/^\d+$/, "Verification code must contain only numbers")
    .required("Verification code is required"),
});

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  method: 'email' | 'phone';
  contact: string;
  title?: string;
  description?: string;
  isExistingVerification?: boolean; // For verifying existing unverified email/phone
}

export function VerificationModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  method, 
  contact, 
  title, 
  description,
  isExistingVerification = false
}: VerificationModalProps) {
  const { showError, showSuccess } = useAppToast();
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: VerificationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (isExistingVerification) {
          // Verifying existing unverified email/phone
          if (method === 'email') {
            await userService.verifyExistingEmail(values.code);
          } else {
            await userService.verifyExistingPhone(values.code);
          }
        } else {
          // Verifying email/phone change
          if (method === 'email') {
            await userService.verifyEmailChange(values.code);
          } else {
            await userService.verifyPhoneChange(values.code);
          }
        }
        
        showSuccess(
          "Verification Successful",
          `Your ${method} has been verified successfully.`
        );
        
        onSuccess();
        formik.resetForm();
        
      } catch (error: any) {
        showError(
          "Verification Failed",
          error.message || "Invalid verification code. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleResendCode = async () => {
    try {
      setIsResending(true);
      
      if (isExistingVerification) {
        // Resend verification for existing unverified email/phone
        if (method === 'email') {
          await userService.requestEmailVerification();
        } else {
          await userService.requestPhoneVerification();
        }
      } else {
        // Resend verification for email/phone change
        await userService.resendChangeVerification(method);
      }
      
      showSuccess(
        "Code Sent",
        `A new verification code has been sent to your ${method}.`
      );
      
      // Start countdown
      setCountdown(60);
      
    } catch (error: any) {
      showError(
        "Resend Failed",
        error.message || "Failed to resend verification code. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleClose = () => {
    formik.resetForm();
    setCountdown(0);
    onClose();
  };

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Start countdown when modal opens
  useEffect(() => {
    if (isOpen && countdown === 0) {
      setCountdown(60);
    }
  }, [isOpen]);

  const defaultTitle = `Verify ${method === 'email' ? 'Email' : 'Phone Number'}`;
  const defaultDescription = `Enter the 6-digit verification code sent to ${contact}`;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">{title || defaultTitle}</Heading>
          <ModalCloseButton>
            <Icon as={XIcon} />
          </ModalCloseButton>
        </ModalHeader>
        
        <ModalBody>
          <VStack space="lg">
            <HStack className="items-center" space="md">
              <Icon 
                as={method === 'email' ? MailIcon : PhoneIcon} 
                className="text-primary-600" 
                size="md" 
              />
              <VStack className="flex-1">
                <Text className="font-medium">
                  {method === 'email' ? 'Email Address' : 'Phone Number'}
                </Text>
                <Text size="sm" className="text-typography-600">
                  {contact}
                </Text>
              </VStack>
            </HStack>

            <Text size="sm" className="text-typography-600 text-center">
              {description || defaultDescription}
            </Text>

            <FormControl isInvalid={!!(formik.touched.code && formik.errors.code)}>
              <FormControlLabel>
                <FormControlLabelText>Verification Code</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="Enter 6-digit code"
                  value={formik.values.code}
                  onChangeText={formik.handleChange("code")}
                  onBlur={formik.handleBlur("code")}
                  keyboardType="numeric"
                  maxLength={6}
                  textAlign="center"
                  className="text-lg font-mono"
                />
              </Input>
              <FormControlHelper>
                <FormControlHelperText size="xs">
                  Enter the 6-digit code sent to your {method}.
                </FormControlHelperText>
              </FormControlHelper>
              {formik.touched.code && formik.errors.code && (
                <FormControlError>
                  <FormControlErrorText>{formik.errors.code}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <VStack space="sm" className="bg-info-50 p-3 rounded-md">
              <HStack className="items-center" space="sm">
                <Icon as={AlertCircleIcon} className="text-info-600" size="sm" />
                <Text size="sm" className="font-medium text-info-800">
                  Didn't receive the code?
                </Text>
              </HStack>
              <Text size="xs" className="text-info-700">
                Check your spam folder or try resending the code.
              </Text>
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <VStack space="md" className="w-full">
            <Button
              className="w-full"
              onPress={() => formik.handleSubmit()}
              disabled={!formik.isValid || formik.isSubmitting}
            >
              <ButtonText>
                {formik.isSubmitting ? "Verifying..." : "Verify Code"}
              </ButtonText>
              <ActivityIndicator animating={formik.isSubmitting} />
            </Button>

            <Button
              variant="outline"
              className="w-full"
              disabled={countdown > 0 || isResending}
              onPress={handleResendCode}
            >
              <ButtonText>
                {countdown > 0 
                  ? `Resend code in ${countdown}s` 
                  : isResending 
                    ? "Sending..." 
                    : "Resend verification code"
                }
              </ButtonText>
              <ActivityIndicator animating={isResending} />
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
