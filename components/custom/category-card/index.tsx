import React from "react";
import { TouchableOpacity } from "react-native";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Category } from "@/types";
import { Center } from "@/components/ui/center";

interface propsType {
  category: Category;
  isSelected?: boolean;
  onPress?: () => void;
}

export function CategoryCardLanscape({ category, isSelected, onPress }: propsType) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      <Card
        size="sm"
        className={`bg-background-0 ${isSelected ? "bg-primary-500" : ""}`}
      >
        <HStack className="gap-2 items-center">
          <Image
            className="h-[25px] w-[25px] rounded"
            alt={category.name}
            source={category.image}
          />
          <Box className="flex-1">
            <Text numberOfLines={2} size="xs">
              {category.name}
            </Text>
          </Box>
        </HStack>
      </Card>
    </TouchableOpacity>
  );
}

export function CategoryCard({
  category,
  onPress,
}: propsType) {
  return (
    <TouchableOpacity className="p-2" onPress={onPress} activeOpacity={0.5}>
      <Center>
        <Card className="p-2 bg-background-200">
          <Image
            className="h-[40px] w-[40px]"
            alt={category.name}
            source={category.image}
          />
        </Card>
        <Text numberOfLines={2} size="2xs" className="text-center mt-1">
          {category.name}
        </Text>
      </Center>
    </TouchableOpacity>
  );
}
