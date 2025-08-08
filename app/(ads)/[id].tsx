import { Stack, useLocalSearchParams } from "expo-router";
import { useMemo, useRef, useCallback, useState } from "react";
import { Animated, FlatList } from "react-native";
import { ProductCardLandscape } from "@/components/custom/product-card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Ad } from "@/types";
import { ProductHeader } from "@/components/custom/product-header";
import { Fab, FabIcon } from "@/components/ui/fab";
import { ChevronUpIcon, Icon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "react-native";
import { HeartIcon, MoreVerticalIcon, RefreshCw } from "lucide-react-native";
import { VStack } from "@/components/ui/vstack";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Box } from "@/components/ui/box";
import { BottomFabs } from "@/components/custom/bottom-fabs";
import { ProductActionSheet } from "@/components/custom/product-action-sheet";
import { useAd, useAds } from "@/hooks/useAds";

// Loading component
const AdDetailsSkeleton = () => (
  <VStack className="flex-1">
    <Box className="h-64 bg-background-100">
      <Skeleton className="h-full w-full" />
    </Box>
    <VStack className="p-4 gap-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </VStack>
  </VStack>
);

// Error component
const AdDetailsError = ({ onRetry }: { onRetry: () => void }) => (
  <Center className="flex-1 px-4">
    <Icon as={RefreshCw} size="xl" className="text-typography-400 mb-4" />
    <Heading size="md" className="text-center mb-2">
      Ad not found
    </Heading>
    <Text className="text-center text-typography-600 mb-4">
      This ad may have been removed or doesn't exist.
    </Text>
    <Button onPress={onRetry} variant="outline">
      <ButtonIcon as={RefreshCw} />
      <ButtonText>Try Again</ButtonText>
    </Button>
  </Center>
);

export default function ProductDetailsScreen() {
    const { id } = useLocalSearchParams();
    const adId = Array.isArray(id) ? id[0] : id;
    const scrollRef = useRef<FlatList>(null);

    const [showActionsheet, setShowActionsheet] = useState(false);
    const {
        showFab,
        buttonAnim,
        handleScroll,
    } = useScrollAnimation();

    // Fetch the specific ad
    const { data: ad, isLoading, isError, error, refetch } = useAd(adId as string);
    
    // Fetch related ads for recommendations
    const { data: relatedAdsData } = useAds({
        limit: 10,
        categoryId: ad?.categoryId,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    const relatedAds = relatedAdsData?.data?.filter(item => item.id !== adId) ?? [];

    const keyExtractor = useCallback((item: Ad) => item.id, []);
    const renderItem = useCallback(
        ({ item }: { item: Ad }) => <ProductCardLandscape product={item} />,
        []
    );

    const headerComponent = useMemo(() => {
        return ad ? <ProductHeader product={ad} /> : null;
    }, [ad]);
    
    const fabStyle = useMemo(() => ({ opacity: showFab }), [showFab]);
    const buttonAnimStyle = useMemo(() => ({ opacity: buttonAnim }), [buttonAnim]);

    if (isLoading) {
        return (
            <VStack className="flex-1">
                <Stack.Screen options={{ title: "Loading..." }} />
                <AdDetailsSkeleton />
            </VStack>
        );
    }

    if (isError || !ad) {
        return (
            <VStack className="flex-1">
                <Stack.Screen options={{ title: "Error" }} />
                <AdDetailsError onRetry={refetch} />
            </VStack>
        );
    }

    return (
        <VStack className="flex-1">
            <Stack.Screen options={{
                title: ad.title || "Ad Details",
                headerRight(props) {
                    return (<HStack className="gap-4">
                        <Pressable><Icon as={HeartIcon} /></Pressable>
                        <Pressable onPress={() => setShowActionsheet(true)} >
                            <Icon as={MoreVerticalIcon} />
                        </Pressable>
                    </HStack>)
                },
            }} />

            <Animated.FlatList
                ref={scrollRef}
                data={relatedAds}
                contentContainerClassName='pb-11'
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ListHeaderComponent={headerComponent}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                bounces={false}
                ListEmptyComponent={() => (
                    <Box className="p-4">
                        <Text className="text-center text-typography-600">
                            No related ads found
                        </Text>
                    </Box>
                )}
            />

            <Animated.View style={fabStyle}>
                <Fab
                    onPress={() =>
                        scrollRef.current?.scrollToOffset({ offset: 0, animated: true })
                    }
                    className={'bottom-14 right-4'}
                >
                    <FabIcon as={ChevronUpIcon} />
                </Fab>
            </Animated.View>

            <Animated.View style={buttonAnimStyle}>
                <BottomFabs />
            </Animated.View>
            
            <ProductActionSheet
                showActionsheet={showActionsheet}
                handleClose={() => setShowActionsheet(false)} 
            />
        </VStack>
    );
}
