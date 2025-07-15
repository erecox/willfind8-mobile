import React, { useRef, useState } from "react";
import { Box } from "@/components/ui/box";
import { SearchBox } from "@/components/custom/search-box";
import { Card } from "@/components/ui/card";
import { Animated, FlatList, View } from "react-native";
import { ProductCard, ProductCardLandscape } from "@/components/custom/product-card";
import products from "@/constants/mockup/products.json";
import { Pressable } from "@/components/ui/pressable";
import { ChevronLeftIcon, ChevronUpIcon, Icon } from "@/components/ui/icon";
import { ToggleColumnButton } from "@/components/custom/toggle-column";
import { HStack } from "@/components/ui/hstack";
import { useColumnLayout } from "@/hooks/useColumnLayout";
import { router } from "expo-router";
import { Product } from "@/types";
import { Fab, FabIcon } from "@/components/ui/fab";

export default function ResultsScreen() {
  const { columns, toggleColumns } = useColumnLayout();

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<FlatList>(null); // Ref for the FlatList

  const showFab = scrollY.interpolate({
    inputRange: [10, 300],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const renderItem = ({ item }: { item: Product }) => {
    return (
      columns === 2 ? <ProductCard product={item} />
        : <ProductCardLandscape product={item} />
    )
  }

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
        <Animated.FlatList
          ref={scrollRef}
          key={columns}
          data={products}
          extraData={columns}
          numColumns={columns}
          initialNumToRender={10}
          contentContainerClassName="gap-1"
          renderItem={renderItem}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: true,
            })}
          ListHeaderComponent={
            <HStack className="justify-end mt-2">
              <ToggleColumnButton isGrid={columns === 2} toggleColumns={toggleColumns} />
            </HStack>}
        />
      </Box>
      <Animated.View style={{ opacity: showFab }}>
        <Fab
          onPress={() =>
            scrollRef.current?.scrollToOffset({ offset: 0, animated: true })
          }
          className={`right-6 p-4 z-100`}
        >
          <FabIcon as={ChevronUpIcon} />
        </Fab>
      </Animated.View>
    </Box>
  );
}
