import React, { useRef, useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { Animated, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { SearchBox } from "@/components/custom/search-box";
import { LogoBar } from "@/components/custom/logo-bar";
import {
  ProductCard,
  ProductCardLandscape,
} from "@/components/custom/product-card";

import products from "@/constants/mockup/products.json";
import { cssInterop } from "nativewind";
import { Image } from "expo-image";
import { Fab } from "@/components/ui/fab";
import { Icon } from "@/components/ui/icon";
import { ChevronUp, Grid2X2Icon, ListIcon } from "lucide-react-native";
import { useLoading } from "@/hooks/useLoading";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { router } from "expo-router";

interface HeaderProps {
  translateY: any;
  logoOpacity: any;
}

cssInterop(Image, { className: "style" });

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<FlatList>(null); // Ref for the FlatList
  const scrollOffsetRef = useRef(0);
  const loader = useLoading();

  const translateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -65],
    extrapolate: "clamp",
  });

  const hideLogo = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const showFab = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const [columns, setColumns] = useState(2);

  const toggleColumns = () => {
    setColumns(columns === 2 ? 1 : 2);
  };

  return (
    <SafeAreaView>
      <VStack className="flex-1 dark:bg-background-900 bg-background-200">
        <Header translateY={translateY} logoOpacity={hideLogo} />
        <Animated.FlatList
          ref={scrollRef}
          contentContainerClassName="pt-[100px] px-[10] pb-[10px] gap-[2px] bg-background-50"
          className={`flex-1 py-[10]`}
          initialNumToRender={10}
          key={columns} // Important to force layout change
          numColumns={columns}
          data={products}
          extraData={columns}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: true,
              listener: (event: any) => {
                const offset = event.nativeEvent.contentOffset.y;
                scrollOffsetRef.current = offset;
              },
            }
          )}
          renderItem={({ item }) =>
            columns === 2 ? (
              <ProductCard product={item} />
            ) : (
              <ProductCardLandscape product={item} />
            )
          }
          ListHeaderComponent={() => (
            <HStack className="justify-between mb-1">
              <Heading size="sm">Trending</Heading>
              <TouchableOpacity
                className="p-1 bg-secondary-500 dark:bg-background-500 rounded"
                onPress={toggleColumns}
              >
                {columns === 2 ? (
                  <Icon className="color-white" size="lg" as={ListIcon} />
                ) : (
                  <Icon className="color-white" size="lg" as={Grid2X2Icon} />
                )}
              </TouchableOpacity>
            </HStack>
          )}
        />
      </VStack>
      <Animated.View style={{ opacity: showFab }}>
        <Fab
          onPress={() =>
            scrollRef.current?.scrollToOffset({ offset: 0, animated: true })
          }
          className={`sm:right-10 right-6 p-4 z-0`}
        >
          <Icon as={ChevronUp} className="text-typography-0" />
        </Fab>
      </Animated.View>
    </SafeAreaView>
  );
}

const Header: React.FC<HeaderProps> = ({ translateY, logoOpacity }) => {
  return (
    <Animated.View
      style={[
        { position: "absolute", zIndex: 100, left: 0, right: 0, top: 0 },
        { transform: [{ translateY }] },
      ]}
    >
      <VStack className="w-full h-[105px] p-[10px] border-10 bg-background-0 dark:bg-background-900">
        <Animated.View style={{ opacity: logoOpacity }}>
          <LogoBar />
        </Animated.View>
        <SearchBox onPress={()=>router.push('/(account)/about-us')} />
      </VStack>
    </Animated.View>
  );
};
