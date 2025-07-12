import React, { useState } from "react";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { VStack } from "@/components/ui/vstack";
import { FlatList, TouchableOpacity } from "react-native";
import { SearchBox } from "@/components/custom/search-box";
import products from "@/constants/mockup/products.json";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { Product } from "@/types";

export default function CategoriesLayout() {
  const [selectedMainCategory, setSelectedMainCategory] = useState<Product | null>(products[0]);
  return (
    <SafeAreaView>
      <VStack className="flex-1 dark:bg-background-900 bg-background-50">
        <VStack className="w-full p-[10px] border-10 bg-background-0 dark:bg-background-900">
          <SearchBox className="mt-0" />
        </VStack>
        < HStack className="gap-1 flex-1">
          <Box className=" w-1/3">
            <FlatList
              contentContainerClassName="gap-y-[2px]"
              initialNumToRender={10}
              extraData={selectedMainCategory}
              data={products}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setSelectedMainCategory(item)} activeOpacity={.6} >
                  <Card size='sm' className={`bg-background-0 ${selectedMainCategory?.id === item.id ? 'bg-background-100' : ''}`}>
                    <HStack className="gap-2 items-center">
                      <Image className="h-[25px] w-[25px]" alt={item.name} source={item.image} />
                    <Box className="flex-1">
                        <Heading size="xs" >{item.name}</Heading>
                    </Box>
                    </HStack>
                  </Card>
                </TouchableOpacity>)}
            />
          </Box>
          <Box className="flex-1">
            <FlatList
              className="flex-1"
              numColumns={3}
              initialNumToRender={10}
              data={products.filter((item) => item.category === selectedMainCategory?.category)}
              renderItem={({ item }) => (
                <Box className="flex-1 p-2">
                  <TouchableOpacity activeOpacity={.5}>
                    <Center>
                      <Card className="p-2 bg-background-200">
                        <Image className="h-[40px] w-[40px]" alt={item.name} source={item.image} />
                      </Card>
                      <Text numberOfLines={2} size="2xs" className="text-center mt-1">{item.name}</Text>
                    </Center>
                  </TouchableOpacity>
                </Box>
              )}
            />
          </Box>
        </HStack>
      </VStack>
    </SafeAreaView>
  );
}
