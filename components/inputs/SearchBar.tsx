// components/SearchBar.jsx
import {
  View,
  StyleSheet,
  NativeSyntheticEvent,
  NativeTouchEvent,
  StyleProp,
  ViewStyle,
} from "react-native";
import { SearchBar as RNSearchBar, Button, lightColors } from "@rneui/themed";
import React from "react";

export default function SearchBar({
  placeholder = "Whare are you looking for...",
  search,
  onChangeText,
  showFilterButton,
  hideFilter,
  onFilterPress,
  onPress,
  inputStyle,
  style,
  disabled,
  ...rest
}: {
  placeholder?: string;
  search: string;
  disabled?: boolean;
  onChangeText?: (text: string) => void;
  showFilterButton?: boolean;
  hideFilter?: boolean;
  onFilterPress?: () => void;
  onPress?: (e?: NativeSyntheticEvent<NativeTouchEvent>) => void;
  inputStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        styles.container,
        showFilterButton && styles.containerFilter,
        style,
      ]}
    >
      <RNSearchBar
        placeholder={placeholder || "Search..."}
        value={search}
        onPress={onPress}
        onChangeText={onChangeText}
        platform="default" // Options: 'default', 'ios', 'android'
        round
        disabled={disabled}
        lightTheme
        containerStyle={[
          styles.searchContainer,
          showFilterButton && styles.searchFilter,
        ]}
        inputContainerStyle={[styles.inputContainer, inputStyle]}
        clearButtonMode="while-editing"
        {...rest}
      />
      {showFilterButton && !hideFilter ? (
        <Button
          type="clear"
          onPress={onFilterPress}
          icon={{ name: "filter", color: "black", type: "font-awesome" }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //width: "100%",
  },
  containerFilter: {
    flexDirection: "row",
    alignItems: "center",
    paddingEnd: 8,
  },
  searchFilter: {
    flex: 1,
  },
  searchContainer: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  inputContainer: {
    backgroundColor: lightColors.grey5,
    borderRadius: 10,
    height: 40,
  },
});
