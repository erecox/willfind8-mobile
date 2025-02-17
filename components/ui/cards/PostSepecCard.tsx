import { lightColors, Text } from "@rneui/themed";
import { FlatList, StyleSheet, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import React from "react";

export default function PostSepecCard({
  list,
}: {
  list: Array<{ name: string; value: string }>;
}) {
  const initialItemCount = 6; // Initial number of items to show
  const [visibleItemCount, setVisibleItemCount] = useState(initialItemCount);
  const [expanded, setExpanded] = useState(false);

  const toggleShowMore = () => {
    if (expanded) {
      setVisibleItemCount(initialItemCount); // Collapse to initial items
    } else {
      setVisibleItemCount(list.length); // Expand to show all items
    }
    setExpanded(!expanded); // Toggle expanded state
  };

  return (
    list.length > 0 && (
      <FlatList
        style={styles.container}
        columnWrapperStyle={{ gap: 10 }}
        contentContainerStyle={{ gap: 20 }}
        numColumns={2}
        data={list.slice(0, visibleItemCount)} // Limit items displayed
        renderItem={({ item }) => (
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.title}>{item.value}</Text>
            <Text style={styles.subtitle}>{item.name}</Text>
          </View>
        )}
        keyExtractor={(item) => item.name.toString()}
        ListFooterComponent={
          <View style={{ alignItems: "flex-end" }}>
            {list.length > initialItemCount ? ( // Show button only if items exceed initial count
              <TouchableOpacity
                onPress={toggleShowMore}
                style={styles.showMoreButton}
              >
                <Text style={styles.showMoreText}>
                  {expanded ? "Hide" : "Show more"}
                </Text>
                <Feather
                  name={expanded ? "chevron-down" : "chevron-up"}
                  size={20}
                  color={lightColors.primary}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        }
      />
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    gap: 10,
  },
  title: { fontSize: 14 },
  subtitle: {
    flex: 1,
    fontSize: 14,
    color: lightColors.grey3,
    textTransform: "uppercase",
  },
  showMoreButton: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  showMoreText: {
    color: lightColors.primary,
    fontSize: 14,
    textAlign: "left",
  },
});
