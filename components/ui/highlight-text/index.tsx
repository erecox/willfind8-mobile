
import React from "react";
import { Text } from "@/components/ui/text";

export const HighlightText = ({ text, query }: { text: string; query: string }) => {

  if (!query) return <Text className="dark:color-gray-300" key="no-highlight">{text}</Text>;
  const parts = text.split(new RegExp(`(${query})`, "gi"));

  return (
    <Text>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <Text className="color-primary-500 dark:color-primary-700" key={`highlight-${index}`}>
            {part}
          </Text>
        ) : (
          <Text className="dark:color-gray-300" key={`normal-${index}`}>{part}</Text>
        )
      )}
    </Text>)
};