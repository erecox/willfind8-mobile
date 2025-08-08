import React from "react";
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
import { userService } from "@/utils/userService";
import { KeyIcon, XIcon, AlertCircleIcon, CheckCircleIcon } from "lucide-react-native";

const ChangePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "New password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required("Please confirm your new password"),
});

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { showError, showSuccess } = useAppToast();

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: ChangePasswordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await userService.changePassword(values.currentPassword, values.newPassword);

        showSuccess(
          "Password Changed",
          "Your password has been successfully updated."
        );

        formik.resetForm();
        onClose();

      } catch (error: any) {
        showError(
          "Change Failed",
          error.message || "Failed to change password. Please try again."
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

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: "Weak", color: "text-error-600" };
    if (strength <= 3) return { strength, label: "Fair", color: "text-warning-600" };
    if (strength <= 4) return { strength, label: "Good", color: "text-success-600" };
    return { strength, label: "Strong", color: "text-success-700" };
  };

  const passwordStrength = getPasswordStrength(formik.values.newPassword);

  return (
    <Modal size="lg" isOpen={isOpen} onClose={handleClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">Change Password</Heading>
          <ModalCloseButton>
            <Icon as={XIcon} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <VStack space="lg">
            <HStack className="items-center" space="md">
              <Icon as={KeyIcon} className="text-primary-600" size="md" />
              <VStack className="flex-1">
                <Text className="font-medium">Update Your Password</Text>
                <Text size="sm" className="text-typography-600">
                  Choose a strong password to keep your account secure
                </Text>
              </VStack>
            </HStack>

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

            <FormControl isInvalid={!!(formik.touched.newPassword && formik.errors.newPassword)}>
              <FormControlLabel>
                <FormControlLabelText>New Password</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="Enter your new password"
                  value={formik.values.newPassword}
                  onChangeText={formik.handleChange("newPassword")}
                  onBlur={formik.handleBlur("newPassword")}
                  secureTextEntry
                />
              </Input>
              {formik.values.newPassword && (
                <FormControlHelper>
                  <FormControlHelperText size="xs" className={passwordStrength.color}>
                    Password strength: {passwordStrength.label}
                  </FormControlHelperText>
                </FormControlHelper>
              )}
              {formik.touched.newPassword && formik.errors.newPassword && (
                <FormControlError>
                  <FormControlErrorText>{formik.errors.newPassword}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <FormControl isInvalid={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)}>
              <FormControlLabel>
                <FormControlLabelText>Confirm New Password</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="Confirm your new password"
                  value={formik.values.confirmPassword}
                  onChangeText={formik.handleChange("confirmPassword")}
                  onBlur={formik.handleBlur("confirmPassword")}
                  secureTextEntry
                />
              </Input>
              {formik.values.confirmPassword && formik.values.newPassword === formik.values.confirmPassword && (
                <FormControlHelper>
                  <HStack className="items-center" space="xs">
                    <Icon as={CheckCircleIcon} className="text-success-600" size="xs" />
                    <FormControlHelperText size="xs" className="text-success-600">
                      Passwords match
                    </FormControlHelperText>
                  </HStack>
                </FormControlHelper>
              )}
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <FormControlError>
                  <FormControlErrorText>{formik.errors.confirmPassword}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <VStack space="sm" className="bg-info-50 p-3 rounded-md">
              <HStack className="items-center" space="sm">
                <Icon as={AlertCircleIcon} className="text-info-600" size="sm" />
                <Text size="sm" className="font-medium text-info-800">
                  Password Requirements
                </Text>
              </HStack>
              <VStack space="xs">
                <Text size="xs" className="text-info-700">
                  • At least 8 characters long
                </Text>
                <Text size="xs" className="text-info-700">
                  • Contains uppercase and lowercase letters
                </Text>
                <Text size="xs" className="text-info-700">
                  • Contains at least one number
                </Text>
                <Text size="xs" className="text-info-700">
                  • Special characters recommended for extra security
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
                {formik.isSubmitting ? "Changing..." : "Change Password"}
              </ButtonText>
              {formik.isSubmitting && <ActivityIndicator animating={formik.isSubmitting} />}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
