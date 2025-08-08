import React, { useState } from "react";
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
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText
} from "@/components/ui/form-control";
import { Icon } from "@/components/ui/icon";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ActivityIndicator } from "react-native";
import { useAppToast } from "@/hooks/useToast";
import { useAuthStore } from "@/hooks/useAuth";
import { userService } from "@/utils/userService";
import { MailIcon, XIcon, AlertCircleIcon } from "lucide-react-native";
import { VerificationModal } from "@/components/modals/verification";

const ChangeEmailSchema = Yup.object().shape({
  newEmail: Yup.string()
    .email("Please enter a valid email address")
    .required("New email is required"),
  currentPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Current password is required"),
});

interface ChangeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangeEmailModal({ isOpen, onClose }: ChangeEmailModalProps) {
  const { user, refreshUser } = useAuthStore();
  const { showError, showSuccess } = useAppToast();
  const [showVerification, setShowVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const formik = useFormik({
    initialValues: {
      newEmail: "",
      currentPassword: "",
    },
    validationSchema: ChangeEmailSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await userService.requestEmailChange(values.newEmail, values.currentPassword);

        setPendingEmail(values.newEmail);
        setShowVerification(true);

        showSuccess(
          "Verification Sent",
          `A verification code has been sent to ${values.newEmail}`
        );

        formik.resetForm();

      } catch (error: any) {
        showError(
          "Change Failed",
          error.message || "Failed to change email. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const handleVerificationSuccess = async () => {
    setShowVerification(false);
    handleClose();
    await refreshUser();
    showSuccess(
      "Email Changed",
      "Your email address has been successfully updated and verified."
    );
  };

  const handleVerificationClose = () => {
    setShowVerification(false);
    setPendingEmail("");
  };

  return (
    <>
      <Modal size="lg" className="px-0" isOpen={isOpen && !showVerification} onClose={handleClose}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md">Change Email Address</Heading>
            <ModalCloseButton>
              <Icon as={XIcon} />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody className="px-0">
            <VStack space="lg">
              <HStack className="items-center" space="md">
                <Icon as={MailIcon} className="text-primary-600" size="md" />
                <VStack className="flex-1">
                  <Text className="font-medium">Current Email</Text>
                  <Text size="sm" className="text-typography-600">
                    {user?.email || 'No email set'}
                  </Text>
                </VStack>
              </HStack>

              <FormControl isInvalid={!!(formik.touched.newEmail && formik.errors.newEmail)}>
                <FormControlLabel>
                  <FormControlLabelText>New Email Address</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="Enter new email address"
                    value={formik.values.newEmail}
                    onChangeText={formik.handleChange("newEmail")}
                    onBlur={formik.handleBlur("newEmail")}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </Input>
                <FormControlHelper>
                  <FormControlHelperText size="2xs">
                    You'll need to verify this email address before the change takes effect.
                  </FormControlHelperText>
                </FormControlHelper>
                {formik.touched.newEmail && formik.errors.newEmail && (
                  <FormControlError>
                    <FormControlErrorText>{formik.errors.newEmail}</FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              <FormControl isInvalid={!!(formik.touched.currentPassword && formik.errors.currentPassword)}>
                <FormControlLabel>
                  <FormControlLabelText>Current Password</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="Enter your current password"
                    value={formik.values.currentPassword}
                    onChangeText={formik.handleChange("currentPassword")}
                    onBlur={formik.handleBlur("currentPassword")}
                    secureTextEntry
                  />
                </Input>
                <FormControlHelper>
                  <FormControlHelperText size="xs">
                    Required for security verification.
                  </FormControlHelperText>
                </FormControlHelper>
                {formik.touched.currentPassword && formik.errors.currentPassword && (
                  <FormControlError>
                    <FormControlErrorText>{formik.errors.currentPassword}</FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              <VStack space="sm" className="bg-info-50 p-3 rounded-md">
                <HStack className="items-center" space="sm">
                  <Icon as={AlertCircleIcon} className="text-info-600" size="sm" />
                  <Text size="sm" className="font-medium text-info-800">
                    Important
                  </Text>
                </HStack>
                <VStack>
                  <Text size="2xs" className="text-info-700">• A verification code will be sent to your new email address</Text>
                  <Text size="2xs" className="text-info-700">• Your current email will remain active until verification is complete</Text>
                  <Text size="2xs" className="text-info-700">• You can cancel this change anytime before verificationI</Text>
                </VStack>
              </VStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <HStack space="md" className="w-full">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onPress={handleClose}
                disabled={formik.isSubmitting}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onPress={() => formik.handleSubmit()}
                disabled={!formik.isValid || formik.isSubmitting}
              >
                <ButtonText size="xs">
                  {formik.isSubmitting ? "Sending..." : "Send Verification"}
                </ButtonText>
                {formik.isSubmitting && <ActivityIndicator animating={formik.isSubmitting} />}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <VerificationModal
        isOpen={showVerification}
        onClose={handleVerificationClose}
        onSuccess={handleVerificationSuccess}
        method="email"
        contact={pendingEmail}
        title="Verify New Email"
        description={`Enter the verification code sent to ${pendingEmail}`}
      />
    </>
  );
}
