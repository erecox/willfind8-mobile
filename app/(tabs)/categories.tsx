import React, { useState } from "react";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { VStack } from "@/components/ui/vstack";
import { FlatList } from "react-native";
import { SearchBox } from "@/components/custom/search-box";
import categories from "@/constants/mockup/categories.json";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Box } from "@/components/ui/box";
import { Product } from "@/types";
import { router } from "expo-router";
import { CategoryCard, CategoryCardLanscape } from "@/components/custom/category-card";
import { ListAllHeader } from "@/components/custom/list-all-header";

export default function CategoriesLayout() {
  const [selectedMainCategory, setSelectedMainCategory] = useState<Product | null>(categories[0] ?? null);
  return (
    <SafeAreaView>
      <VStack className="dark:bg-background-900 bg-background-50">
        <Card className="absolute w-full" size='sm'>
          <SearchBox />
        </Card>
        <HStack className="pt-[60px]">
          <Box className="w-1/3">
            <FlatList
              contentContainerClassName="gap-y-[2px]"
              className="h-full"
              initialNumToRender={10}
              extraData={selectedMainCategory}
              data={categories}
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
              data={categories.filter((item) => item.id === selectedMainCategory?.id)}
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
