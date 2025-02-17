import { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ActivityIndicator,
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
import usePostStore from "@/hooks/store/useFetchPosts";
import { useRouteInfo } from "expo-router/build/hooks";
import React from "react";

export default function AdsScreen() {
  const route = useRouteInfo();
  const { id } = route.params;
  const postId = parseInt(id?.toString());

  const {
    dynamicFilters,
    isLoading,
    fetchFilters,
    defaultFilters,
    setDefaultFilters,
    setDynamicFilters,
  } = useFilterStore();

  const { items, updatePost, loadingStates } = usePostStore();
  const post = items[postId];

  const inputRef = useRef();
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

  useEffect(() => {
    if (loadingStates.postUpdated) router.push("/(user)/mylisting");
  }, [loadingStates]);

  const openCategoryModal = () => router.push("/search/categories_menu");
  const openCityModal = () => router.push("/search/cities_menu");

  const buildValidationSchema = () => {
    const schema = {
      title: Yup.string().required("Title is required"),
      description: Yup.string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters"),
      permanent: Yup.boolean(),
      price: Yup.string().required("Price is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      auth_field: Yup.string().required("Auth field is required"),
      phone: Yup.string().required("Phone is required"),
      contact_name: Yup.string().required(),
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
      cf: Yup.object().shape(
        dynamicFilters.reduce((acc, filter) => {
          acc[filter.id] = Yup.number().required(`${filter.name} is required`);
          return acc;
        }, {})
      ),
    };

    return Yup.object(schema);
  };

  const formik = useFormik({
    initialValues: {
      title: post.title,
      city_id: post.city.id,
      category_id: post.category.id,
      description: post.description,
      price: post.price,
      email: post.user?.email,
      phone: post.user?.phone,
      contact_name: post.user?.name || "",
      phone_country: "GH",
      auth_field: "email",
      pictures: [],
      country_code: post.country_code,
      negotiable: false,
      permanent: false,
      accept_terms: post.accept_terms,
      tags: post.tags,
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
      await updatePost(values);
    },
  });

  const handleDynamicFieldChange = (fieldId: number, value: any) => {
    const updatedCf = { ...formik.values.cf, [fieldId]: value };
    formik.setFieldValue("cf", updatedCf);
  };

  useEffect(() => {
    formik.setFieldValue("category_id", category?.id || null);
  }, [category]);

  useEffect(() => {
    formik.setFieldValue("city_id", city?.id || null);
  }, [city]);

  useEffect(() => {
    fetchFilters(post.category.id);
    // setDynamicFilters(post.extra?.fieldsValues.)
  }, [post]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Stack.Screen
          options={{
            title: "Edit  Advert",
            headerRight: () => (
              <TouchableOpacity
                activeOpacity={0.55}
                style={{ paddingVertical: 5 }}
                disabled={!formik.isValid || loadingStates.addPost}
                onPress={() => formik.handleSubmit()}
              >
                {loadingStates.addPost ? (
                  <ActivityIndicator size={"small"} animating />
                ) : (
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: formik.isValid
                        ? lightColors.primary
                        : lightColors.disabled,
                    }}
                  >
                    Submit
                  </Text>
                )}
              </TouchableOpacity>
            ),
            headerTitleStyle: { fontSize: 16 },
          }}
        />

        <TouchableWithoutFeedback
          onPress={() => inputRef && inputRef.current.dismissKeyboard()}
        >
          <View style={{ padding: 10, paddingBottom: 50 }}>
            <SelectDialog
              label="City"
              value={city?.name || post.city.name}
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
              value={category?.name || post.category.name}
              onPress={openCategoryModal}
              placeholder="Select a category"
              errorMessage={
                formik.touched.category_id && !formik.values.category_id
                  ? formik.errors.category_id
                  : ""
              }
            />
            <ImagePickerInput
              imagePlaceHolder={post.pictures?.map((pic) => pic.url.full)}
              onImagesSelected={(imgs: any) => {
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
              <TouchableWithoutFeedback>
                <DescriptionInput
                  inputRef={inputRef}
                  value={formik.values.description}
                  onChange={(value: any) =>
                    formik.setFieldValue("description", value)
                  }
                  errorMessage={
                    (formik.touched.description && formik.errors.description) ||
                    ""
                  }
                  onBlur={() =>
                    inputRef.current && inputRef.current?.dismissKeyboard()
                  }
                />
              </TouchableWithoutFeedback>
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
                      options={filter.options.map((option) => ({
                        label: option.value,
                        value: option.id,
                      }))}
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
                    filter.options.map((option) => (
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
                    filter.options.map((option) => (
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
              checked={formik.values.permanent}
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
              checked={formik.values.accept_terms}
              containerStyle={{
                marginStart: 0,
                marginEnd: 0,
                backgroundColor: null,
              }}
              onPress={() =>
                formik.setFieldValue(
                  "accept_terms",
                  !formik.values.accept_terms
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
        loading={loadingStates.addPost || isLoading}
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
