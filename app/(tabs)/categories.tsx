import React from "react";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { VStack } from "@/components/ui/vstack";
import { FlatList, Platform } from "react-native";
import { ProductCard } from "@/components/custom/product-card";
import { SearchBox } from "@/components/custom/search-box";

import products from "@/constants/mockup/products.json";

export default function CategoriesLayout() {
  return (
    <SafeAreaView>
      <VStack className="flex-1 dark:bg-background-900 bg-background-300">
        <VStack className="w-full p-[10px] border-10 bg-background-0 dark:bg-background-900">
          <SearchBox className="mt-0" />
        </VStack>
        <FlatList
          contentContainerClassName=" px-[10] gap-y-[2px]"
          className={`${Platform.OS === 'ios' ? "mb-[50px]" : ''} flex-1 py-[10]`}
          numColumns={2}
          columnWrapperClassName={"gap-x-[2px]"}
          initialNumToRender={10}
          data={products}
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      </VStack>
    </SafeAreaView>
  );
}
