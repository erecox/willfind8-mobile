import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { SearchBox } from "@/components/custom/search-box";
import { Card } from "@/components/ui/card";
import { FlatList, View } from "react-native";
import { ProductCard, ProductCardLandscape } from "@/components/custom/product-card";
import products from "@/constants/mockup/products.json";
import { Pressable } from "@/components/ui/pressable";
import { ChevronLeftIcon, Icon } from "@/components/ui/icon";
import { ToggleColumnButton } from "@/components/custom/toggle-column";
import { HStack } from "@/components/ui/hstack";
import { useColumnLayout } from "@/hooks/useColumnLayout";
import { router } from "expo-router";

export default function ResultsScreen() {
  const { columns, toggleColumns } = useColumnLayout();
  return (
    <Box className="flex-1">
      <Card size="sm" className="w-full absolute">
        <Box className="w-full flex flex-row items-center p-0">
          <Pressable onPress={() => router.back()}>
            <Icon size='2xl' as={ChevronLeftIcon} />
          </Pressable>
          <SearchBox className="flex-1" />
        </Box>
      </Card>
      <Box className="pt-[60px]">
        <FlatList
        key={columns}
        extraData={columns}
        numColumns={columns}
        data={products}
        initialNumToRender={10}
        contentContainerClassName="gap-1"
        renderItem={({ item }) => columns === 2 ? <ProductCard product={item} /> : <ProductCardLandscape product={item} />}
        ListHeaderComponent={
          <HStack className="justify-end mt-2">
            <ToggleColumnButton isGrid={columns === 2} toggleColumns={toggleColumns} />
          </HStack>}
      />
      </Box>
    </Box>
  );
}
