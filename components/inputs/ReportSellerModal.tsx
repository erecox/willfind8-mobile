import React, { createContext, useState, useContext } from "react";
import {
  View,
  Text,
  Modal,
  Button,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Picker } from "@react-native-picker/picker";

const ReportSellerContext = createContext<
  | {
      openSheet: () => void;
      closeSheet: () => void;
    }
  | undefined
>(undefined);

export const useReportSeller = () => {
  const context = useContext(ReportSellerContext);
  if (!context) {
    throw new Error(
      "useReportSeller must be used within a ReportSellerProvider"
    );
  }
  return context;
};

const ReportSellerProvider = ({ children }: { children: any }) => {
  const [show, setShow] = useState(false);

  const openSheet = () => setShow(true);
  const closeSheet = () => setShow(false);

  const formik = useFormik({
    initialValues: {
      reason: "",
      message: "",
    },
    validationSchema: Yup.object({
      reason: Yup.string().required("Reason is required"),
      message: Yup.string().min(10, "Message must be at least 10 characters"),
    }),
    onSubmit: (values) => {
      console.log("Report Submitted", values);
      formik.resetForm();
      closeSheet();
    },
  });

  return (
    <ReportSellerContext.Provider value={{ openSheet, closeSheet }}>
      {children}

      <Modal visible={show} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalBackground}>
            <View style={styles.sheetContainer}>
              <Text style={styles.title}>Report Seller</Text>

              <Picker
                selectedValue={formik.values.reason}
                onValueChange={(itemValue) =>
                  formik.setFieldValue("reason", itemValue)
                }
                style={styles.picker}
              >
                <Picker.Item label="Select a reason" value="" />
                <Picker.Item label="Fraud" value="fraud" />
                <Picker.Item
                  label="Misleading Information"
                  value="misleading"
                />
                <Picker.Item label="Harassment" value="harassment" />
              </Picker>
              {formik.errors.reason && formik.touched.reason && (
                <Text style={styles.errorText}>{formik.errors.reason}</Text>
              )}

              <TextInput
                placeholder="Additional message"
                value={formik.values.message}
                onChangeText={formik.handleChange("message")}
                onBlur={formik.handleBlur("message")}
                multiline
                style={styles.input}
              />
              {formik.errors.message && formik.touched.message && (
                <Text style={styles.errorText}>{formik.errors.message}</Text>
              )}

              <View style={styles.buttonContainer}>
                <Button title="Submit" onPress={() => formik.handleSubmit()} />
                <Button title="Cancel" onPress={closeSheet} color="red" />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ReportSellerContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
  },
  sheetContainer: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  picker: {
    backgroundColor: "white",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "white",
    height: 100,
    textAlignVertical: "top",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ReportSellerProvider;
