import { LabelInputList } from "@/components/inputs/LabelInputList";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useFetchAuth } from "@/hooks/store/useFetchAuth";
import { LabelList } from "@/components/ui/lists/LabelList";
import ImagePickerInput2 from "@/components/inputs/ImagePickerInput2";
import LoadingBar from "@/components/ui/cards/LoadingBar";
import convertImageToBase64 from "@/scripts/convertImageToBase64";
import React from "react";

// Validation schema using Yup
const UserSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),
});

export default function UserScreen() {
  const { user, updateUser } = useAuth();
  const { update, uploadPhoto, response, error, uploadError, isLoading } =
    useFetchAuth();
  const [editable, setEditable] = useState(false);
  const [photo, setPhoto] = useState(user?.photo_url);

  const { handleChange, handleSubmit, resetForm, values, errors, touched } =
    useFormik({
      initialValues: {
        name: user?.name || "",
        username: user?.username || "",
        about: user?.about,
        gender_id: user?.gender_id || 0,
        email: user?.email || "",
      },
      validationSchema: UserSchema,
      onSubmit: (values: any) => {
        setEditable(false);
        if (user) update(user.id, values);
      },
    });

  useEffect(() => {
    if (error) {
      setEditable(true);
      resetForm();

      Alert.alert("Update Failed", error);
    }
    if (uploadError) {
      // setPhoto(user?.photo_url);
      Alert.alert("Update Failed", uploadError);
    }
  }, [error, uploadError]);

  useEffect(() => {
    if (response) updateUser(response);
  }, [response]);

  const genderOptions = [
    { id: 0, label: "Select a Gender", value: "0" },
    { id: 1, label: "Male", value: "1" },
    { id: 2, label: "Female", value: "2" },
  ];
  const data = [
    {
      title: "Username",
      type: "text",
      placeholder: "Enter your username",
      value: values.username,
      errorMessage: (touched.username && errors.username?.toString()) || "",
      onChange: handleChange("username"),
    },
    {
      title: "Name",
      type: "text",
      placeholder: "Enter your name",
      value: values.name,
      errorMessage: (touched.name && errors.name?.toString()) || "",
      onChange: handleChange("name"),
    },
    {
      title: "About",
      type: "text",
      placeholder: "Brief bio",
      value: values.about,
      errorMessage: (touched.about && errors.about?.toString()) || "",
      onChange: handleChange("about"),
    },
    {
      title: "Gender",
      type: "select",
      value: values.gender_id.toString(),
      placeholder: "Select Gender",
      options: genderOptions,
      onChange: handleChange("gender_id"),
    },
  ];

  const data2 = [
    {
      title: "Username",
      value: values.username,
    },
    {
      title: "Name",
      value: values.name,
    },
    {
      title: "About",
      value: values.about,
    },
    {
      title: "Gender",
      value: genderOptions.find((gender) => gender.value == values.gender_id)
        ?.label,
    },
  ];

  const handleEditOrSave = () => {
    if (editable) return handleSubmit();
    setEditable(!editable);
  };

  const handleImageUpload = async (uri: string) => {
    const fileName = uri.split("/").pop();
    const fileType = `image/${fileName?.split(".").pop()}`;
    const base64 = await convertImageToBase64(uri);

    const img = `data:${fileType};base64,${base64}`;

    if (user)
      uploadPhoto(user?.id, {
        ...user,
        img,
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <ImagePickerInput2
          value={photo}
          rounded
          onImageSelected={(value: string) => {
            setPhoto(value);
            handleImageUpload(value);
          }}
        />

        {editable ? (
          <LabelInputList
            onLeftPress={handleEditOrSave}
            leftTitle={editable ? "Save" : "Edit"}
            heading="Personal Details"
            data={data}
          />
        ) : (
          <LabelList
            onLeftPress={handleEditOrSave}
            leftTitle={editable ? "Save" : "Edit"}
            heading="Personal Details"
            data={data2}
          />
        )}
      </ScrollView>
      <LoadingBar
        style={{ position: "absolute", top: 0, zIndex: 100 }}
        loading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    gap: 20,
  },
});
