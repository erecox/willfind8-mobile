import React, { useRef } from "react";
import { VStack } from "@/components/ui/vstack";
import { Animated, FlatList, Platform, View } from "react-native";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { SearchBox } from "@/components/custom/search-box";
import { LogoBar } from "@/components/custom/logo-bar";
import { ProductCard } from "@/components/custom/product-card";

import products from "@/constants/mockup/products.json";
import { cssInterop } from "nativewind";
import { Image } from "expo-image";
import { Fab } from "@/components/ui/fab";
import { Icon } from "@/components/ui/icon";
import { ChevronUp } from "lucide-react-native";
import { useLoading } from "@/hooks/useLoading";

interface HeaderProps {
  translateY: any;
  logoOpacity: any;
}


cssInterop(Image, { className: 'style' });

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

  setInterval(() => {
    loader?.hideLoading();
  }, 6000);

  return (
    <SafeAreaView>
      <VStack className="flex-1 dark:bg-background-900 bg-background-300">
        <Header translateY={translateY} logoOpacity={hideLogo} />
        <Animated.FlatList
          ref={scrollRef}
          contentContainerClassName="pt-[100px] px-[10] pb-[10px] gap-y-[2px]"
          className={`${Platform.OS === 'ios' ? "mb-[50px]" : ''} flex-1 py-[10]`}
          numColumns={2}
          columnWrapperClassName={"gap-x-[2px]"}
          initialNumToRender={10}
          data={products}
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

          renderItem={({ item }) => <ProductCard product={item} />}
        />
      </VStack>
      <Fab
        onPress={loader?.showLoading}
        className={`${Platform.OS === 'ios' ? 'bottom-[100px]' : 'bottom-[60px]'} sm:right-10 right-6 p-4 z-0`}
      >
        <Icon
          as={ChevronUp}
          className="text-typography-0"
        />
      </Fab>
    </SafeAreaView>
  );
}

const Header: React.FC<HeaderProps> = ({ translateY, logoOpacity }) => {
  return (
    <Animated.View style={[{ position: 'absolute', zIndex: 100, left: 0, right: 0, top: 0 }, { transform: [{ translateY }] }]}>
      <VStack className="w-full h-[105px] p-[10px] border-10 bg-background-0 dark:bg-background-900">
        <Animated.View style={{ opacity: logoOpacity }}>
          <LogoBar />
        </Animated.View>
        <SearchBox />
      </VStack>
    </Animated.View>
  );
};