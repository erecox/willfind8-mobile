import React, { useRef, useCallback } from "react";
import { VStack } from "@/components/ui/vstack";
import { Animated, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { SearchBox } from "@/components/custom/search-box";
import { LogoBar } from "@/components/custom/logo-bar";
import {
  ProductCard,
  ProductCardLandscape,
} from "@/components/custom/product-card";

import { cssInterop } from "nativewind";
import { Image } from "expo-image";
import { Fab } from "@/components/ui/fab";
import { Icon } from "@/components/ui/icon";
import { ChevronUp, RefreshCw } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Skeleton } from "@/components/ui/skeleton";
import { Box } from "@/components/ui/box";
import { router } from "expo-router";
import { ToggleColumnButton } from "@/components/custom/toggle-column";
import { useColumnLayout } from "@/hooks/useColumnLayout";
import { useInfiniteAds } from "@/hooks/useAds";
import { Ad } from "@/types";

interface HeaderProps {
  translateY: any;
  logoOpacity: any;
}

cssInterop(Image, { className: "style" });

// Loading skeleton component
const ProductSkeleton = ({ isGrid }: { isGrid: boolean }) => (
  <Box className={`${isGrid ? 'flex-1 mx-0.5' : 'w-full'} mb-2`}>
    <Skeleton className={`${isGrid ? 'h-40' : 'h-32'} w-full rounded-lg mb-2`} />
    <Skeleton className="h-4 w-3/4 mb-1" />
    <Skeleton className="h-3 w-1/2" />
  </Box>
);

// Error component
const ErrorComponent = ({ onRetry }: { onRetry: () => void }) => (
  <Center className="flex-1 px-4">
    <Icon as={RefreshCw} size="xl" className="text-typography-400 mb-4" />
    <Heading size="md" className="text-center mb-2">
      Something went wrong
    </Heading>
    <Text className="text-center text-typography-600 mb-4">
      Unable to load ads. Please check your connection and try again.
    </Text>
    <Button onPress={onRetry} variant="outline">
      <ButtonIcon as={RefreshCw} />
      <ButtonText>Try Again</ButtonText>
    </Button>
  </Center>
);

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<FlatList>(null);
  const scrollOffsetRef = useRef(0);
  const { columns, toggleColumns } = useColumnLayout();

  // Fetch ads with infinite scrolling
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteAds({
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const handleProductClicked = (id: string) => 
    router.push({ pathname: '/(ads)/[id]', params: { id } });

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten the infinite query data - handle case where pagination might be undefined
  const ads = data?.pages.flatMap(page => {
    if (page && page.data) {
      return page.data;
    }
    return [];
  }) ?? [];

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

  const renderItem = useCallback(({ item }: { item: Ad }) => {
    return columns === 2 ? (
      <ProductCard 
        product={item}
        onPress={() => handleProductClicked(item.id)} 
      />
    ) : (
      <ProductCardLandscape 
        product={item}
        onPress={() => handleProductClicked(item.id)} 
      />
    );
  }, [columns]);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    
    return (
      <HStack className="justify-center py-4">
        {columns === 2 ? (
          <HStack className="gap-2">
            <ProductSkeleton isGrid={true} />
            <ProductSkeleton isGrid={true} />
          </HStack>
        ) : (
          <ProductSkeleton isGrid={false} />
        )}
      </HStack>
    );
  }, [isFetchingNextPage, columns]);

  const keyExtractor = useCallback((item: Ad) => item.id, []);

  if (isError) {
    return (
      <SafeAreaView>
        <VStack className="flex-1">
          <Header translateY={translateY} logoOpacity={hideLogo} />
          <ErrorComponent onRetry={handleRefresh} />
        </VStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <VStack className="flex-1 dark:bg-background-900 bg-background-200">
        <Header translateY={translateY} logoOpacity={hideLogo} />
        
        {isLoading ? (
          // Loading state
          <VStack className="flex-1 pt-[100px] px-[10]">
            <HStack className="justify-between mb-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-8 rounded" />
            </HStack>
            {columns === 2 ? (
              <HStack className="gap-2 flex-wrap">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ProductSkeleton key={index} isGrid={true} />
                ))}
              </HStack>
            ) : (
              <VStack className="gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <ProductSkeleton key={index} isGrid={false} />
                ))}
              </VStack>
            )}
          </VStack>
        ) : (
          <Animated.FlatList
            ref={scrollRef}
            key={columns}
            numColumns={columns}
            data={ads}
            extraData={columns}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
            contentContainerClassName="pt-[100px] px-[10] pb-[10px] gap-y-1 bg-background-50"
            columnWrapperClassName={columns === 2 ? 'gap-x-1' : undefined}
            className="flex-1 py-[10]"
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={handleRefresh}
                tintColor="#666"
              />
            }
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
        )}
      </VStack>
      
      <Animated.View style={{ opacity: showFab }}>
        <Fab
          onPress={() =>
            scrollRef.current?.scrollToOffset({ offset: 0, animated: true })
          }
          className="right-4"
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
