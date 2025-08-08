import React, { useState } from "react";
import { ScrollView } from "@/components/ui/scroll-view";
import { Box } from "@/components/ui/box";
import { useAuthStore } from "@/hooks/useAuth";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, InputField } from "@/components/ui/input";
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from "@/components/ui/form-control";
import { Redirect, router } from "expo-router";
import { Alert, TouchableOpacity } from "react-native";
import { CameraIcon, SaveIcon } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { userService } from "@/utils/userService";
import { uploadService } from "@/utils/uploadService";
import { useAppToast } from "@/hooks/useToast";
import * as ImagePicker from 'expo-image-picker';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Validation schema
const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  avatar: Yup.string().url('Avatar must be a valid URL').nullable(),
});

interface FormValues {
  firstName: string;
  lastName: string;
  avatar: string;
}

export default function EditProfileScreen() {
  const { user, setUser } = useAuthStore();
  const toast = useAppToast();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  if (!user) return <Redirect href={'/(auth)/login'} />;

  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      avatar: user.avatar || ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const updatedUser = await userService.updateProfile({
          firstName: values.firstName,
          lastName: values.lastName,
          avatar: values.avatar
        });

        setUser(updatedUser);
        toast.showSuccess("Success", "Profile updated successfully");
        router.back();
      } catch (error: any) {
        toast.showError("Error", error.message || "Failed to update profile");
      } finally {
        setSubmitting(false);
      }
    }
  });

  const handleAvatarPicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to upload photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadingAvatar(true);

        // Create FormData for upload
        const formData = new FormData();
        formData.append('avatar', {
          uri: result.assets[0].uri,
          type: result.assets[0].type || 'image/jpeg',
          name: result.assets[0].fileName || 'avatar.jpg',
        } as any);

        const uploadedFile = await uploadService.uploadAvatar(formData);

        // Update Formik field value
        formik.setFieldValue('avatar', uploadedFile.url);

        toast.showSuccess("Success", "Avatar uploaded successfully");
      }
    } catch (error: any) {
      toast.showError("Error", error.message || "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <ScrollView
      className="bg-background-50"
      contentContainerClassName="pb-6"
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar Section */}
        <Card className="mx-4 mt-4 p-6">
          <VStack space="lg" className="items-center">
            <Box className="relative">
              <Avatar className="bg-background-400" size="xl">
                <AvatarFallbackText>
                 {`${formik.values.firstName} ${formik.values.lastName}`}
                </AvatarFallbackText>
                {formik.values.avatar && (
                  <AvatarImage
                    source={{ uri: formik.values.avatar }}
                    alt="Profile photo"
                  />
                )}
              </Avatar>

              <TouchableOpacity
                onPress={handleAvatarPicker}
                disabled={uploadingAvatar}
                className="absolute -bottom-2 -right-2 shadow-hard-1 bg-warning-700 rounded-full p-2"
              >
                <Icon as={CameraIcon} className="text-white" />
              </TouchableOpacity>
            </Box>

            <Text size="sm" className="text-typography-600 text-center">
              Tap the camera icon to change your profile photo
            </Text>

            {/* Avatar Error */}
            {formik.touched.avatar && formik.errors.avatar && (
              <Text size="sm" className="text-error-600 text-center">
                {formik.errors.avatar}
              </Text>
            )}
          </VStack>
        </Card>

        {/* Form Section */}
        <Card className="mx-4 mt-4 p-6">
          <VStack space="lg">
            <Heading size="md" className="text-typography-900">
              Personal Information
            </Heading>

            {/* First Name */}
            <FormControl isInvalid={!!(formik.touched.firstName && formik.errors.firstName)}>
              <FormControlLabel>
                <FormControlLabelText>First Name</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="Enter your first name"
                  value={formik.values.firstName}
                  onChangeText={formik.handleChange('firstName')}
                  onBlur={formik.handleBlur('firstName')}
                />
              </Input>
              {formik.touched.firstName && formik.errors.firstName && (
                <FormControlError>
                  <FormControlErrorText>{formik.errors.firstName}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Last Name */}
            <FormControl isInvalid={!!(formik.touched.lastName && formik.errors.lastName)}>
              <FormControlLabel>
                <FormControlLabelText>Last Name</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="Enter your last name"
                  value={formik.values.lastName}
                  onChangeText={formik.handleChange('lastName')}
                  onBlur={formik.handleBlur('lastName')}
                />
              </Input>
              {formik.touched.lastName && formik.errors.lastName && (
                <FormControlError>
                  <FormControlErrorText>{formik.errors.lastName}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Username - Read Only */}
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Username</FormControlLabelText>
              </FormControlLabel>
              <Input isDisabled isReadOnly>
                <InputField
                  value={user.username}
                  editable={false}
                />
              </Input>
              <Text size="xs" className="text-typography-500 mt-1">
                Username cannot be changed
              </Text>
            </FormControl>
          </VStack>
        </Card>

        {/* Contact Information (Read-only) */}
        <Card className="mx-4 mt-4 p-6">
          <VStack space="lg">
            <Heading size="md" className="text-typography-900">
              Contact Information
            </Heading>

            <Text size="sm" className="text-typography-600">
              To update your email or phone number, go to Security & Privacy settings.
            </Text>

            {/* Email */}
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Email</FormControlLabelText>
              </FormControlLabel>
              <Input isDisabled isReadOnly>
                <InputField
                  value={user.email || 'Not provided'}
                  editable={false}
                />
              </Input>
            </FormControl>

            {/* Phone */}
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Phone</FormControlLabelText>
              </FormControlLabel>
              <Input isDisabled isReadOnly>
                <InputField
                  value={user.phone || 'Not provided'}
                  editable={false}
                />
              </Input>
            </FormControl>
          </VStack>
        </Card>

        {/* Save Button */}
        <Box className="mx-4 mt-6">
          <Button
            onPress={() => formik.handleSubmit()}
            disabled={formik.isSubmitting || uploadingAvatar}
            size="lg"
            className="w-full"
          >
            <ButtonIcon as={SaveIcon} />
            <ButtonText>
              {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
            </ButtonText>
          </Button>
        </Box>
    </ScrollView>
  );
}
