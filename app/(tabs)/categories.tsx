import React, { useState } from "react";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { VStack } from "@/components/ui/vstack";
import { FlatList } from "react-native";
import { SearchBox } from "@/components/custom/search-box";
import products from "@/constants/mockup/products.json";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Box } from "@/components/ui/box";
import { Product } from "@/types";
import { ChevronRightIcon, Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { router } from "expo-router";
import { CategoryCard, CategoryCardLanscape } from "@/components/custom/category-card";
import { ListAllHeader } from "@/components/custom/list-all-header";

export default function CategoriesLayout() {
  const [selectedMainCategory, setSelectedMainCategory] = useState<Product | null>(products[0]);
  return (
    <SafeAreaView>
      <VStack className=" dark:bg-background-900 bg-background-50">
        <Card className="absolute w-full" size='sm'>
          <SearchBox />
        </Card>
        <HStack className=" pt-[60px]">
          <Box className="w-1/3">
            <FlatList
              contentContainerClassName="gap-y-[2px]"
              initialNumToRender={10}
              extraData={selectedMainCategory}
              data={products}
              renderItem={({ item }) => (
                <CategoryCardLanscape
                  isSelected={selectedMainCategory?.id === item.id}
                  category={item}
                  onPress={() => setSelectedMainCategory(item)} />
              )}
            />
          </Box>
          <Box className="w-2/3">
            <ListAllHeader onPress={() => router.push("/(search)/results")} />
            <FlatList
              numColumns={3}
              initialNumToRender={10}
              data={products.filter((item) => item.category === selectedMainCategory?.category)}
              renderItem={({ item }) => (
                <CategoryCard
                  category={item}
                  onPress={() => router.push({ pathname: '/results' })} />
              )}
            />
          </Box>
        </HStack>
      </VStack>
    </SafeAreaView>
  );
}
