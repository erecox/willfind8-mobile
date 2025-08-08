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
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText, FormControlHelper, FormControlHelperText } from "@/components/ui/form-control";
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem } from "@/components/ui/select";
import { Icon } from "@/components/ui/icon";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ActivityIndicator } from "react-native";
import { useAppToast } from "@/hooks/useToast";
import { sellerService } from "@/utils/sellerService";
import { XIcon, StoreIcon, ChevronDownIcon } from "lucide-react-native";

const CreateSellerProfileSchema = Yup.object().shape({
    businessName: Yup.string()
        .min(2, "Business name must be at least 2 characters")
        .max(100, "Business name must be less than 100 characters")
        .required("Business name is required"),
    businessType: Yup.string()
        .required("Business type is required"),
    description: Yup.string()
        .max(500, "Description must be less than 500 characters"),
    website: Yup.string()
        .url("Please enter a valid website URL")
        .nullable(),
    facebook: Yup.string()
        .url("Please enter a valid Facebook URL")
        .nullable(),
    instagram: Yup.string()
        .url("Please enter a valid Instagram URL")
        .nullable(),
    twitter: Yup.string()
        .url("Please enter a valid Twitter URL")
        .nullable(),
    linkedin: Yup.string()
        .url("Please enter a valid LinkedIn URL")
        .nullable(),
});

interface CreateSellerProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const businessTypes = [
    "Retail Store",
    "Online Store",
    "Service Provider",
    "Restaurant/Food",
    "Technology",
    "Fashion/Clothing",
    "Electronics",
    "Automotive",
    "Real Estate",
    "Health/Beauty",
    "Education",
    "Entertainment",
    "Sports/Recreation",
    "Home/Garden",
    "Professional Services",
    "Other"
];

export function CreateSellerProfileModal({ isOpen, onClose, onSuccess }: CreateSellerProfileModalProps) {
    const { showError, showSuccess } = useAppToast();

    const formik = useFormik({
        initialValues: {
            businessName: "",
            businessType: "",
            description: "",
            website: "",
            facebook: "",
            instagram: "",
            twitter: "",
            linkedin: "",
        },
        validationSchema: CreateSellerProfileSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const socialMedia: any = {};
                if (values.facebook) socialMedia.facebook = values.facebook;
                if (values.instagram) socialMedia.instagram = values.instagram;
                if (values.twitter) socialMedia.twitter = values.twitter;
                if (values.linkedin) socialMedia.linkedin = values.linkedin;

                await sellerService.createSellerProfile({
                    businessName: values.businessName,
                    businessType: values.businessType,
                    description: values.description || undefined,
                    website: values.website || undefined,
                    socialMedia: Object.keys(socialMedia).length > 0 ? socialMedia : undefined,
                });

                showSuccess(
                    "Profile Created",
                    "Your business profile has been created successfully!"
                );

                onSuccess();
                formik.resetForm();

            } catch (error: any) {
                showError(
                    "Creation Failed",
                    error.message || "Failed to create business profile. Please try again."
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

    return (
        <Modal size="lg" isOpen={isOpen} onClose={handleClose}>
            <ModalBackdrop />
            <ModalContent className="max-h-[90%]">
                <ModalHeader>
                    <Heading size="md">Create Business Profile</Heading>
                    <ModalCloseButton>
                        <Icon as={XIcon} />
                    </ModalCloseButton>
                </ModalHeader>

                <ModalBody showsVerticalScrollIndicator={false}>
                    <VStack space="lg">
                        <HStack className="items-center" space="md">
                            <Icon as={StoreIcon} className="text-primary-600" size="md" />
                            <VStack className="flex-1">
                                <Text className="font-medium">Business Information</Text>
                                <Text size="sm" className="text-typography-600">
                                    Tell customers about your business
                                </Text>
                            </VStack>
                        </HStack>

                        <FormControl isInvalid={!!(formik.touched.businessName && formik.errors.businessName)}>
                            <FormControlLabel>
                                <FormControlLabelText>Business Name *</FormControlLabelText>
                            </FormControlLabel>
                            <Input>
                                <InputField
                                    placeholder="Enter your business name"
                                    value={formik.values.businessName}
                                    onChangeText={formik.handleChange("businessName")}
                                    onBlur={formik.handleBlur("businessName")}
                                />
                            </Input>
                            <FormControlHelper>
                                <FormControlHelperText size="xs">
                                    This will be displayed as your business name on your profile
                                </FormControlHelperText>
                            </FormControlHelper>
                            {formik.touched.businessName && formik.errors.businessName && (
                                <FormControlError>
                                    <FormControlErrorText>{formik.errors.businessName}</FormControlErrorText>
                                </FormControlError>
                            )}
                        </FormControl>

                        <FormControl isInvalid={!!(formik.touched.businessType && formik.errors.businessType)}>
                            <FormControlLabel>
                                <FormControlLabelText>Business Type *</FormControlLabelText>
                            </FormControlLabel>
                            <Select
                                selectedValue={formik.values.businessType}
                                onValueChange={formik.handleChange("businessType")}
                            >
                                <SelectTrigger className="flex items-center px-1">
                                    <SelectInput className="flex-1 mt-2" placeholder="Select business type" />
                                    <SelectIcon as={ChevronDownIcon} />
                                </SelectTrigger>
                                <SelectPortal>
                                    <SelectBackdrop />
                                    <SelectContent>
                                        <SelectDragIndicatorWrapper>
                                            <SelectDragIndicator />
                                        </SelectDragIndicatorWrapper>
                                        {businessTypes.map((type) => (
                                            <SelectItem key={type} label={type} value={type} />
                                        ))}
                                    </SelectContent>
                                </SelectPortal>
                            </Select>
                            {formik.touched.businessType && formik.errors.businessType && (
                                <FormControlError>
                                    <FormControlErrorText>{formik.errors.businessType}</FormControlErrorText>
                                </FormControlError>
                            )}
                        </FormControl>

                        <FormControl isInvalid={!!(formik.touched.description && formik.errors.description)}>
                            <FormControlLabel>
                                <FormControlLabelText>Business Description</FormControlLabelText>
                            </FormControlLabel>
                            <Textarea>
                                <TextareaInput
                                    placeholder="Describe your business, products, or services..."
                                    value={formik.values.description}
                                    onChangeText={formik.handleChange("description")}
                                    onBlur={formik.handleBlur("description")}
                                    numberOfLines={4}
                                />
                            </Textarea>
                            <FormControlHelper>
                                <FormControlHelperText size="xs">
                                    Help customers understand what you offer (optional)
                                </FormControlHelperText>
                            </FormControlHelper>
                            {formik.touched.description && formik.errors.description && (
                                <FormControlError>
                                    <FormControlErrorText>{formik.errors.description}</FormControlErrorText>
                                </FormControlError>
                            )}
                        </FormControl>

                        <FormControl isInvalid={!!(formik.touched.website && formik.errors.website)}>
                            <FormControlLabel>
                                <FormControlLabelText>Website</FormControlLabelText>
                            </FormControlLabel>
                            <Input>
                                <InputField
                                    placeholder="https://www.yourbusiness.com"
                                    value={formik.values.website}
                                    onChangeText={formik.handleChange("website")}
                                    onBlur={formik.handleBlur("website")}
                                    keyboardType="url"
                                    autoCapitalize="none"
                                />
                            </Input>
                            <FormControlHelper>
                                <FormControlHelperText size="xs">
                                    Link to your business website (optional)
                                </FormControlHelperText>
                            </FormControlHelper>
                            {formik.touched.website && formik.errors.website && (
                                <FormControlError>
                                    <FormControlErrorText>{formik.errors.website}</FormControlErrorText>
                                </FormControlError>
                            )}
                        </FormControl>

                        <VStack space="md">
                            <Text className="font-medium">Social Media Links (Optional)</Text>

                            <FormControl isInvalid={!!(formik.touched.facebook && formik.errors.facebook)}>
                                <FormControlLabel>
                                    <FormControlLabelText>Facebook</FormControlLabelText>
                                </FormControlLabel>
                                <Input>
                                    <InputField
                                        placeholder="https://facebook.com/yourbusiness"
                                        value={formik.values.facebook}
                                        onChangeText={formik.handleChange("facebook")}
                                        onBlur={formik.handleBlur("facebook")}
                                        keyboardType="url"
                                        autoCapitalize="none"
                                    />
                                </Input>
                                {formik.touched.facebook && formik.errors.facebook && (
                                    <FormControlError>
                                        <FormControlErrorText>{formik.errors.facebook}</FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!(formik.touched.instagram && formik.errors.instagram)}>
                                <FormControlLabel>
                                    <FormControlLabelText>Instagram</FormControlLabelText>
                                </FormControlLabel>
                                <Input>
                                    <InputField
                                        placeholder="https://instagram.com/yourbusiness"
                                        value={formik.values.instagram}
                                        onChangeText={formik.handleChange("instagram")}
                                        onBlur={formik.handleBlur("instagram")}
                                        keyboardType="url"
                                        autoCapitalize="none"
                                    />
                                </Input>
                                {formik.touched.instagram && formik.errors.instagram && (
                                    <FormControlError>
                                        <FormControlErrorText>{formik.errors.instagram}</FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!(formik.touched.twitter && formik.errors.twitter)}>
                                <FormControlLabel>
                                    <FormControlLabelText>Twitter</FormControlLabelText>
                                </FormControlLabel>
                                <Input>
                                    <InputField
                                        placeholder="https://twitter.com/yourbusiness"
                                        value={formik.values.twitter}
                                        onChangeText={formik.handleChange("twitter")}
                                        onBlur={formik.handleBlur("twitter")}
                                        keyboardType="url"
                                        autoCapitalize="none"
                                    />
                                </Input>
                                {formik.touched.twitter && formik.errors.twitter && (
                                    <FormControlError>
                                        <FormControlErrorText>{formik.errors.twitter}</FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!(formik.touched.linkedin && formik.errors.linkedin)}>
                                <FormControlLabel>
                                    <FormControlLabelText>LinkedIn</FormControlLabelText>
                                </FormControlLabel>
                                <Input>
                                    <InputField
                                        placeholder="https://linkedin.com/company/yourbusiness"
                                        value={formik.values.linkedin}
                                        onChangeText={formik.handleChange("linkedin")}
                                        onBlur={formik.handleBlur("linkedin")}
                                        keyboardType="url"
                                        autoCapitalize="none"
                                    />
                                </Input>
                                {formik.touched.linkedin && formik.errors.linkedin && (
                                    <FormControlError>
                                        <FormControlErrorText>{formik.errors.linkedin}</FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>
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
                                {formik.isSubmitting ? "Creating..." : "Create Profile"}
                            </ButtonText>
                            {formik.isSubmitting && <ActivityIndicator animating={formik.isSubmitting} />}
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
