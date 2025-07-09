import React from "react";

import { Image as ExpoImage } from "expo-image";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { MapPinIcon } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { Product } from "@/types";

type ProductCardProps = {
  product: Product;
  onPress?: () => void;
};

export function ProductCard({ product, onPress }: ProductCardProps) {
  return (
    <Pressable
      className={`flex-1  bg-background-50 dark:bg-background-700 w-full h-full sm:gap-2 gap-1 flex flex-col pb-2 lg:p-4`}
      onPress={onPress}
    >
      <Box className="bg-background-100 dark:bg-background-800 px-3 lg:px-6 py-[14px] lg:py-7 aspect-[17/12]">
        <ExpoImage
          source={product.image}
          alt={product.name}
          className={`flex-1 rounded bg-background-500`}
          cachePolicy="memory-disk"
        />
      </Box>
      <VStack className="px-3 gap-1">
        <HStack className="justify-between">
          <Text className="text-typography-900 dark:text-typography-400 font-medium sm:text-base text-sm lg:text-xl">
            {product.name}
          </Text>
        </HStack>
        <Text className="text-typography-900 dark:text-typography-400 font-medium sm:text-base text-sm lg:text-l">
          {"GHC"} {product.price}
        </Text>
        <HStack className="gap-1">
          <Icon className="dark:color-gray-400" size="xs" as={MapPinIcon} />
          <Text className="text-typography-900 dark:text-typography-400 font-small sm:text-base text-xs">
            {product.city}
          </Text>
        </HStack>
      </VStack>
    </Pressable>
  );
};