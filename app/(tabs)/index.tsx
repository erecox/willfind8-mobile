import React, { useRef } from "react";
import { VStack } from "@/components/ui/vstack";
import { Animated, FlatList } from "react-native";
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
import { ChevronUp } from "lucide-react-native";
import { useLoading } from "@/hooks/useLoading";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { router } from "expo-router";
import { ToggleColumnButton } from "@/components/custom/toggle-column";
import { useColumnLayout } from "@/hooks/useColumnLayout";

interface HeaderProps {
  translateY: any;
  logoOpacity: any;
}

cssInterop(Image, { className: "style" });

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<FlatList>(null); // Ref for the FlatList
  const scrollOffsetRef = useRef(0);
  const { columns, toggleColumns } = useColumnLayout();
  const loader = useLoading();


  const handleProductClicked = (id: any) => router.push({ pathname: '/(ads)/[id]', params: { id } });

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

  return (
    <SafeAreaView>
      <VStack className="flex-1 dark:bg-background-900 bg-background-200">
        <Header translateY={translateY} logoOpacity={hideLogo} />
        <Animated.FlatList
          ref={scrollRef}
          key={columns} // Important to force layout change
          numColumns={columns}
          data={products}
          extraData={columns}
          initialNumToRender={10}
          contentContainerClassName="pt-[100px] px-[10] pb-[10px] gap-y-1 bg-background-50"
          columnWrapperClassName={columns === 2 ? 'gap-x-1' : undefined}
          className={`flex-1 py-[10]`}
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
              <ProductCard product={item}
                onPress={() => handleProductClicked(item.id)} />
            ) : (
              <ProductCardLandscape product={item}
                onPress={() => handleProductClicked(item.id)} />
            )
          }
          ListHeaderComponent={() => (
            <HStack className="justify-between mb-1">
              <Heading size="sm">Trending</Heading>
              <ToggleColumnButton
                isGrid={columns === 2}
                toggleColumns={toggleColumns}
              />
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
      <VStack className="w-full flex justify-end h-[105px] p-[10px] border-10 bg-background-0 dark:bg-background-900">
        <Animated.View style={{ opacity: logoOpacity }}>
          <LogoBar />
        </Animated.View>
        <SearchBox onFocus={() => router.push({ pathname: "/(search)/search" })} />
      </VStack>
    </Animated.View>
  );
};
