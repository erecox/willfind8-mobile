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
import { PhoneIcon, XIcon, AlertCircleIcon } from "lucide-react-native";
import { VerificationModal } from "@/components/modals/verification";

const ChangePhoneSchema = Yup.object().shape({
  newPhone: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number")
    .required("New phone number is required"),
  currentPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Current password is required"),
});

interface ChangePhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePhoneModal({ isOpen, onClose }: ChangePhoneModalProps) {
  const { user, refreshUser } = useAuthStore();
  const { showError, showSuccess } = useAppToast();
  const [showVerification, setShowVerification] = useState(false);
  const [pendingPhone, setPendingPhone] = useState("");

  const formik = useFormik({
    initialValues: {
      newPhone: "",
      currentPassword: "",
    },
    validationSchema: ChangePhoneSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await userService.requestPhoneChange(values.newPhone, values.currentPassword);

        setPendingPhone(values.newPhone);
        setShowVerification(true);

        showSuccess(
          "Verification Sent",
          `A verification code has been sent to ${values.newPhone}`
        );

        formik.resetForm();

      } catch (error: any) {
        showError(
          "Change Failed",
          error.message || "Failed to change phone number. Please try again."
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
      "Phone Changed",
      "Your phone number has been successfully updated and verified."
    );
  };

  const handleVerificationClose = () => {
    setShowVerification(false);
    setPendingPhone("");
  };

  return (
    <>
      <Modal size="lg" isOpen={isOpen && !showVerification} onClose={handleClose}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md">Change Phone Number</Heading>
            <ModalCloseButton>
              <Icon as={XIcon} />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>
            <VStack space="lg">
              <HStack className="items-center" space="md">
                <Icon as={PhoneIcon} className="text-primary-600" size="md" />
                <VStack className="flex-1">
                  <Text className="font-medium">Current Phone</Text>
                  <Text size="sm" className="text-typography-600">
                    {user?.phone || 'No phone number set'}
                  </Text>
                </VStack>
              </HStack>

              <FormControl isInvalid={!!(formik.touched.newPhone && formik.errors.newPhone)}>
                <FormControlLabel>
                  <FormControlLabelText>New Phone Number</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="Enter new phone number"
                    value={formik.values.newPhone}
                    onChangeText={formik.handleChange("newPhone")}
                    onBlur={formik.handleBlur("newPhone")}
                    keyboardType="phone-pad"
                  />
                </Input>
                <FormControlHelper>
                  <FormControlHelperText size="xs">
                    Include country code (e.g., +1234567890). You'll need to verify this number before the change takes effect.
                  </FormControlHelperText>
                </FormControlHelper>
                {formik.touched.newPhone && formik.errors.newPhone && (
                  <FormControlError>
                    <FormControlErrorText>{formik.errors.newPhone}</FormControlErrorText>
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
                  <Text size="2xs" className="text-info-700">
                    • A verification code will be sent via SMS to your new phone number
                  </Text>
                  <Text size="2xs" className="text-info-700">
                    • Your current phone will remain active until verification is complete
                  </Text>
                  <Text size="2xs" className="text-info-700">
                    • Standard SMS rates may apply
                  </Text>
                  <Text size="2xs" className="text-info-700">
                    • You can cancel this change anytime before verification
                  </Text>
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
        method="phone"
        contact={pendingPhone}
        title="Verify New Phone"
        description={`Enter the verification code sent to ${pendingPhone}`}
      />
    </>
  );
}
