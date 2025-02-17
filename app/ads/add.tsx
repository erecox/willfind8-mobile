import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Alert,
  TextInput as RNTextInput,
} from "react-native";
import { router, Stack } from "expo-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CheckBox, lightColors, Switch, Text } from "@rneui/themed";

import ImagePickerInput from "@/components/inputs/ImagePickerInput";
import DescriptionInput from "@/components/inputs/DescriptionInput";
import PriceInput from "@/components/inputs/PriceInput";
import TextInput from "@/components/inputs/TextInput";
import TagInput from "@/components/inputs/TagInput";
import SelectDialog from "@/components/inputs/SelectDialog";
import SelectInput from "@/components/inputs/SelectInput";
import LoadingBar from "@/components/ui/cards/LoadingBar";
import { useFilterStore } from "@/hooks/store/filterStore";
import { useAuth } from "@/lib/auth/AuthProvider";
import React from "react";
import api from "@/lib/apis/api";

// Define types for filters
interface Filter {
  id: string;
  type: string;
  name: string;
  options?: { id: number; value: string }[];
  selectedValue?: { id: number; name: string };
}

// Define type for advert
interface Advert {
  title: string;
  city_id: number;
  category_id: number;
  description: string;
  price: string;
  email: string;
  phone: string;
  contact_name: string;
  phone_country: string;
  auth_field: string;
  pictures: string[];
  country_code: string | null;
  negotiable: 0 | 1;
  permanent: 0 | 1;
  accept_terms: 0 | 1;
  tags: string[];
  cf: Record<string, any>;
}

export default function AddScreen() {
  const { user } = useAuth();
  const [requestLoading, setRequestLoading] = useState(false);

  const {
    dynamicFilters,
    isLoading,
    fetchFilters,
    defaultFilters,
    setDefaultFilters,
  } = useFilterStore();

  const inputRef = useRef<RNTextInput>(null);
  const category = defaultFilters.find(
    (filter) => filter.id === "c"
  )?.selectedValue;
  const city = defaultFilters.find(
    (filter) => filter.id === "l"
  )?.selectedValue;

  useEffect(() => {
    if (!defaultFilters.length) setDefaultFilters();
    if (category?.id) fetchFilters(category.id);
  }, [category?.id, defaultFilters.length, setDefaultFilters, fetchFilters]);

  const openCategoryModal = () => router.push("/search/categories_menu");
  const openCityModal = () => router.push("/search/cities_menu");

  const buildValidationSchema = () => {
    const schema: Record<string, any> = {
      title: Yup.string().required("Title is required"),
      description: Yup.string()
        .min(20, "Description must be at least 10 characters")
        .required("Description is required"),
      permanent: Yup.boolean(),
      price: Yup.string().required("Price is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      auth_field: Yup.string().required("Auth field is required"),
      phone: Yup.string().required("Phone is required"),
      contact_name: Yup.string().required("Contact name is required"),
      phone_country: Yup.string(),
      accept_terms: Yup.boolean()
        .isTrue("Accept the terms and conditions")
        .required("Accept the terms"),
      category_id: Yup.number().required("Category is required"),
      city_id: Yup.number().required("City is required"),
      pictures: Yup.array()
        .of(Yup.string().required("Each item must be a string"))
        .min(1, "At least one image is required")
        .required("This field is required"),
    };

    if (dynamicFilters.length > 0) {
      schema.cf = Yup.object().shape(
        dynamicFilters.reduce((acc, filter) => {
          if (filter.type !== "checkbox_multiple") {
            acc[filter.id] = Yup.number().required(
              `${filter.name} is required`
            );
          }
          return acc;
        }, {})
      );
    }

    return Yup.object(schema);
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      city_id: 0,
      category_id: 0,
      description: "",
      price: "",
      email: user?.email || "",
      phone: user?.phone || "",
      contact_name: user?.name || "",
      phone_country: "GH",
      auth_field: "email",
      pictures: [],
      country_code: null,
      negotiable: 0,
      permanent: 0,
      accept_terms: 0,
      tags: [],
      cf: dynamicFilters.reduce(
        (acc, filter) => ({
          ...acc,
          [filter.id]: filter.type === "checkbox_multiple" ? [] : "",
        }),
        {}
      ),
    },
    validationSchema: buildValidationSchema(),
    onSubmit: async (values) => {
      await addPost(values);
    },
  });

  // Post add
  const addPost = async (advert: Advert) => {
    setRequestLoading(true);

    const pics = advert.pictures.map((uri: string) => {
      const fileName = uri.split("/").pop();
      const fileType = `image/${fileName?.split(".").pop()}`;
      return {
        uri,
        name: fileName,
        type: fileType,
      };
    });

    try {
      const response = await api.postForm(`/api/posts`, {
        ...advert,
        pictures: undefined,
        "pictures[]": pics,
      });

      const { success, message, result } = response.data;
      if (success) {
        router.dismiss(1);
        router.push({ pathname: "/ads/details", params: { id: result.id } });
      } else {
        Alert.alert(
          "Error",
          message || "Something went wrong. Please try again."
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error?.message || "An unexpected error occurred.");
    } finally {
      setRequestLoading(false);
    }
  };

  const handleDynamicFieldChange = (fieldId: string, value: any) => {
    const updatedCf = { ...formik.values.cf, [fieldId]: value };
    formik.setFieldValue("cf", updatedCf);
  };

  useEffect(() => {
    if (category?.id !== formik.values.category_id) {
      formik.setFieldValue("category_id", category?.id || null);
    }
  }, [category]);

  useEffect(() => {
    if (city?.id !== formik.values.city_id) {
      formik.setFieldValue("city_id", city?.id || null);
    }
  }, [city]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Stack.Screen
          options={{
            title: "New Advert",
            headerRight: () => (
              <TouchableOpacity
                activeOpacity={0.55}
                style={{ paddingVertical: 5 }}
                disabled={!formik.isValid || requestLoading}
                onPress={() => formik.handleSubmit()}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color:
                      !formik.isValid || requestLoading
                        ? lightColors.disabled
                        : lightColors.primary,
                  }}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            ),
            headerTitleStyle: { fontSize: 16 },
          }}
        />

        <TouchableWithoutFeedback>
          <View style={{ padding: 10, paddingBottom: 50 }}>
            <SelectDialog
              label="City"
              value={city?.name}
              onPress={openCityModal}
              placeholder="Select a city"
              errorMessage={
                formik.touched.city_id && !formik.values.city_id
                  ? formik.errors.city_id
                  : ""
              }
            />
            <SelectDialog
              label="Category"
              value={category?.name}
              onPress={openCategoryModal}
              placeholder="Select a category"
              errorMessage={
                formik.touched.category_id && !formik.values.category_id
                  ? formik.errors.category_id
                  : ""
              }
            />
            <ImagePickerInput
              onImagesSelected={(imgs: string[]) => {
                formik.setFieldValue("pictures", imgs, true);
              }}
              errorMessage={formik.touched?.pictures && formik.errors?.pictures}
            />
            <View style={styles.container}>
              <TextInput
                label="Title"
                placeholder="Enter the listing title"
                value={formik.values.title}
                onChangeText={formik.handleChange("title")}
                onBlur={formik.handleBlur("title")}
                errorMessage={
                  (formik.touched.title && formik.errors.title) || ""
                }
              />
              <DescriptionInput
                inputRef={inputRef}
                value={formik.values.description}
                onChange={(value: string) => {
                  formik.setFieldTouched("description", true);
                  formik.setFieldValue("description", value);
                }}
                errorMessage={
                  (formik.touched.description && formik.errors.description) ||
                  ""
                }
                onBlur={() => {
                  inputRef.current?.blur();
                  formik.handleBlur("description");
                }}
              />
              {dynamicFilters.map((filter) => (
                <View key={filter.id} style={styles.filterContainer}>
                  <Text style={styles.label}>{filter.name}</Text>
                  {filter.type === "select" && (
                    <SelectInput
                      value={formik.values.cf[filter.id]}
                      onChange={(value) =>
                        handleDynamicFieldChange(filter.id, value)
                      }
                      placeholder={`Select ${filter.name}`}
                      options={
                        filter.options?.map((option) => ({
                          label: option.value,
                          value: option.id,
                        })) || []
                      }
                      errorMessage={formik.errors.cf?.[filter.id]}
                    />
                  )}
                  {filter.type === "text" && (
                    <TextInput
                      placeholder={filter.name}
                      value={formik.values.cf[filter.id]}
                      onChangeText={(text) =>
                        handleDynamicFieldChange(filter.id, text)
                      }
                      onBlur={formik.handleBlur(`cf.${filter.id}`)}
                      errorMessage={formik.errors.cf?.[filter.id]}
                    />
                  )}
                  {filter.type === "number" && (
                    <TextInput
                      placeholder={filter.name}
                      value={formik.values.cf[filter.id]}
                      onChangeText={(text) =>
                        handleDynamicFieldChange(filter.id, text)
                      }
                      onBlur={formik.handleBlur(`cf.${filter.id}`)}
                      inputMode="numeric"
                      errorMessage={formik.errors.cf?.[filter.id]}
                    />
                  )}
                  {filter.type === "radio" &&
                    filter.options?.map((option) => (
                      <View key={option.id} style={styles.radioContainer}>
                        <Text>{option.value}</Text>
                        <Switch
                          value={formik.values.cf[filter.id] === option.id}
                          onValueChange={() =>
                            handleDynamicFieldChange(filter.id, option.id)
                          }
                        />
                      </View>
                    ))}
                  {filter.type === "checkbox_multiple" &&
                    filter.options?.map((option) => (
                      <CheckBox
                        key={option.id}
                        title={option.value}
                        checked={formik.values.cf[filter.id]?.includes(
                          option.id
                        )}
                        onPress={() => {
                          const currentValues =
                            formik.values.cf[filter.id] || [];
                          const updatedValues = currentValues.includes(
                            option.id
                          )
                            ? currentValues.filter((id) => id !== option.id)
                            : [...currentValues, option.id];
                          handleDynamicFieldChange(filter.id, updatedValues);
                        }}
                      />
                    ))}
                </View>
              ))}
              <PriceInput
                containerStyle={{ marginBottom: 0 }}
                negotiable={formik.values.negotiable}
                value={formik.values.price}
                onChangePrice={(value: string) =>
                  formik.setFieldValue("price", value)
                }
                onToggleNegotiable={() =>
                  formik.setFieldValue("negotiable", !formik.values.negotiable)
                }
                errorMessage={formik.touched.price && formik.errors.price}
              />
              <Text style={{ fontSize: 12, color: lightColors.grey3 }}>
                Enter 0 to offer this item (or service) as a donation.
              </Text>
              <TagInput
                onTagUpdate={(tags) => formik.setFieldValue("tags", tags)}
                value={formik.values.tags}
              />
            </View>
            <CheckBox
              title="Mark this listing as permanent"
              checked={!!formik.values.permanent}
              containerStyle={{ marginStart: 0, marginEnd: 0 }}
              onPress={() =>
                formik.setFieldValue("permanent", !formik.values.permanent)
              }
            />
            <CheckBox
              title={
                <Text>
                  Accept the{" "}
                  <Text
                    onPress={() => router.push("/pages/terms")}
                    style={{ color: lightColors.primary }}
                  >
                    Terms and Conditions
                  </Text>
                </Text>
              }
              checked={!!formik.values.accept_terms}
              containerStyle={{
                marginStart: 0,
                marginEnd: 0,
              }}
              onPress={() =>
                formik.setFieldValue(
                  "accept_terms",
                  formik.values.accept_terms ? 0 : 1
                )
              }
            />
            <KeyboardAvoidingView
              keyboardVerticalOffset={300}
              behavior="padding"
            >
              <View style={{ marginVertical: 10, gap: 20 }}>
                <Text style={{ fontWeight: "bold" }}>Seller's Information</Text>
                <TextInput
                  label="Contact Name"
                  inputMode="text"
                  placeholder="Enter your contact name"
                  value={formik.values.contact_name}
                  onChangeText={formik.handleChange("contact_name")}
                  onBlur={formik.handleBlur("contact_name")}
                  errorMessage={
                    (formik.touched.contact_name &&
                      formik.errors.contact_name) ||
                    ""
                  }
                />

                <TextInput
                  label="Email"
                  inputMode="email"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChangeText={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                  errorMessage={
                    (formik.touched.email && formik.errors.email) || ""
                  }
                />
                <TextInput
                  label="Phone"
                  placeholder="Enter your phone number"
                  value={formik.values.phone}
                  onChangeText={formik.handleChange("phone")}
                  onBlur={formik.handleBlur("phone")}
                  inputMode="numeric"
                  errorMessage={
                    (formik.touched.phone && formik.errors.phone) || ""
                  }
                />
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <LoadingBar
        style={{ position: "absolute", top: 0, zIndex: 100 }}
        loading={requestLoading || isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  filterContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
});
