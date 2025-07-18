import React, { useState } from "react";

import { Image as ExpoImage } from "expo-image";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { MapPinIcon, PhoneCallIcon } from "lucide-react-native";
import { Icon, MessageCircleIcon } from "@/components/ui/icon";
import { Product } from "@/types";
import { Button, ButtonIcon } from "@/components/ui/button";
import { FavouriteButton } from "../favourite-button";

type ProductCardProps = {
  product: Product;
  className?: string;
  onPress?: () => void;
};

export function ProductCard({ product, className, onPress }: ProductCardProps) {
  const [isFavourite, setIsFavourite] = useState(false);
  return (
    <Pressable
      className={`flex-1 bg-background-0 dark:bg-background-700 w-full h-full sm:gap-2 gap-1 flex flex-col pb-2 lg:p-4 ${className}`}
      onPress={onPress}
    >
      <Box className="bg-background-50 dark:bg-background-800 aspect-[12/14]">
        <ExpoImage
          source={product.picture.full}
          alt={product.name}
          className={`flex-1 rounded bg-background-500`}
          cachePolicy="memory-disk"
        />
        <FavouriteButton active={isFavourite} onToggleActive={setIsFavourite} />
      </Box>
      <VStack className="px-3 gap-1">
        <HStack className="justify-between">
          <Text numberOfLines={2} className="text-typography-900 dark:text-typography-400 font-medium sm:text-base text-sm lg:text-xl">
            {product.name}
          </Text>
        </HStack>
        <Text className="text-typography-900 dark:text-typography-400 font-medium sm:text-base text-sm lg:text-l">
          {"GHC"} {product.price}
        </Text>
        <HStack className="gap-1">
          <Icon className="dark:color-gray-400" size="xs" as={MapPinIcon} />
          <Text className="text-typography-900 dark:text-typography-400 font-small sm:text-base text-2xs">
            {product.city}
          </Text>
        </HStack>
      </VStack>
    </Pressable>
  );
}

export function ProductCardLandscape({ product, onPress }: ProductCardProps) {
  const [isFavourite, setIsFavourite] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      className="flex flex-row w-full rounded-xl overflow-hidden bg-background-0 dark:bg-background-700 p-3 space-x-3"
    >
      {/* Image Section */}
      <Box className="w-32 h-24 bg-background-50 dark:bg-background-800 rounded-md overflow-hidden">
        <ExpoImage
          source={product.picture.full}
          alt={product.name}
          className="w-full h-full object-cover"
          contentFit="cover"
          cachePolicy="memory-disk"
        />
        <FavouriteButton active={isFavourite} onToggleActive={setIsFavourite} />
      </Box>

      {/* Details Section */}
      <VStack className="flex-1 px-2 gap-1">
        <Text numberOfLines={2} className="text-sm font-semibold text-typography-900 dark:text-typography-100">
          {product.name}
        </Text>

        <Text className="text-sm font-medium text-typography-900 dark:text-typography-300">
          GHC {product.price}
        </Text>

        <HStack className="items-center gap-1">
          <Icon as={MapPinIcon} size="2xs" className="text-typography-500 dark:text-typography-400" />
          <Text className="text-2xs text-typography-500 dark:text-typography-400">
            {product.city}
          </Text>
        </HStack>
        <HStack className="items-center gap-1 justify-end">
          <Button size="xs"><ButtonIcon as={PhoneCallIcon} /></Button>
          <Button size="xs" variant="outline"><ButtonIcon as={MessageCircleIcon} /></Button>
        </HStack>
      </VStack>
    </Pressable>
  );
}


export function SimpleProductCard({ product, className, onPress }: ProductCardProps) {
  const [isFavourite, setIsFavourite] = useState(false);
  return (
    <Pressable
      className={`flex-1 bg-background-0 dark:bg-background-700 sm:gap-2 gap-1 flex flex-col pb-2 ${className}`}
      onPress={onPress}
    >
      <Box className="bg-background-50 dark:bg-background-800 h-[80px]">
        <ExpoImage
          source={product.picture.full}
          alt={product.name}
          className={`flex-1 rounded bg-background-500`}
          cachePolicy="memory-disk"
        />
        <FavouriteButton size="md" active={isFavourite} onToggleActive={setIsFavourite} />
      </Box>
      <VStack className="gap-1">
        <HStack className="justify-between">
          <Text numberOfLines={2} size="xs" className="text-typography-900 dark:text-typography-400">
            {product.name}
          </Text>
        </HStack>
        <Text size="xs" className="text-typography-900 dark:text-typography-400">
          {"GHC"} {product.price}
        </Text>
      </VStack>
    </Pressable>
  );
}
