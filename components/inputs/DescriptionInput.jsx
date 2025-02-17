import { lightColors } from "@rneui/base";
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "@/components/pell-rich-editor";

export default function DescriptionInput({
  inputRef,
  value,
  onChange,
  onFocus = () => {},
  onBlur = () => {},
  inputStyle = {},
  errorMessage,
}) {
  const ref = useRef();
  useEffect(() => {
    if (inputRef) inputRef.current = ref.current;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ padding: 10 }}>Description</Text>
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      <RichToolbar
        editor={ref}
        actions={[
          actions.undo,
          actions.redo,
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.blockquote,
          actions.fontSize,
        ]}
        style={styles.toolbar}
      />
      <RichEditor
        ref={ref}
        initialContentHTML={value}
        onChange={onChange}
        placeholder="Describe what makes your listing unique (min. 10 letters)..."
        style={[styles.input, inputStyle]}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 280,
  },
  input: {
    width: "100%",
    minHeight: 200,
  },
  toolbar: {
    backgroundColor: lightColors.background,
    alignItems: "flex-start",
    borderColor: lightColors.greyOutline,
    borderWidth: 1,
  },
  error: {
    fontSize: 14,
    paddingHorizontal: 8,
    color: "red",
    marginBottom: 5,
  },
});
