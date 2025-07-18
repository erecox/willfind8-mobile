import { Stack, useLocalSearchParams } from "expo-router";
import { useMemo, useRef, useCallback, useState } from "react";
import { Animated, FlatList } from "react-native";
import products from "@/constants/mockup/products.json";
import specs from "@/constants/mockup/product-specs.json";
import { ProductCardLandscape } from "@/components/custom/product-card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation"; // path to your hook
import { Product, ProductSpec } from "@/types";
import { ProductHeader } from "@/components/custom/product-header";
import { Fab, FabIcon } from "@/components/ui/fab";
import { ChevronUpIcon, Icon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "react-native";
import { HeartIcon, MoreVerticalIcon } from "lucide-react-native";
import { VStack } from "@/components/ui/vstack";
import { BottomFabs } from "@/components/custom/bottom-fabs";
import { ProductActionSheet } from "@/components/custom/product-action-sheet";

export default function ProductDetailsScreen() {
    const { id } = useLocalSearchParams();
    const scrollRef = useRef<FlatList>(null);

    const [showActionsheet,setShowActionsheet] = useState(false);
    const {
        showFab,
        scrolling,
        buttonAnim,
        handleScroll,
    } = useScrollAnimation();

    // Avoid mutation
    const product = useMemo(() => {
        const found = products.findLast((item) => item.id === id) as Product;
        if (!found) return null;
        return {
            ...found,
            specs: specs as ProductSpec[],
        };
    }, [id]);

    const keyExtractor = useCallback((item: Product, index: any) => item.id.toString(), []);
    const renderItem = useCallback(
        ({ item }: { item: Product }) => <ProductCardLandscape product={item} />,
        []
    );

    const headerComponent = useMemo(() => {
        return product ? <ProductHeader product={product} /> : null;
    }, [product]);
    const fabStyle = useMemo(() => ({ opacity: showFab }), [showFab]);
    const buttonAnimStyle = useMemo(() => ({ opacity: buttonAnim }), [buttonAnim]);

    if (!product) return null;

    return (
        <VStack className="flex-1">
            <Stack.Screen options={{
                title: product.category,
                headerRight(props) {
                    return (<HStack className="gap-4">
                        <Pressable><Icon as={HeartIcon} /></Pressable>
                        <Pressable onPress={()=>setShowActionsheet(true)} >
                            <Icon as={MoreVerticalIcon} />
                        </Pressable>
                    </HStack>)
                },
            }} />

            <Animated.FlatList
                ref={scrollRef}
                data={products}
                contentContainerClassName='pb-11'
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ListHeaderComponent={headerComponent}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                bounces={false}
            />

            <Animated.View style={fabStyle}>
                <Fab
                    onPress={() =>
                        scrollRef.current?.scrollToOffset({ offset: 0, animated: true })
                    }
                    className={'bottom-14 right-6'}
                >
                    <FabIcon as={ChevronUpIcon} />
                </Fab>
            </Animated.View>

            <Animated.View style={buttonAnimStyle}>
                <BottomFabs />
            </Animated.View>
            <ProductActionSheet
                showActionsheet={showActionsheet}
                handleClose={() => setShowActionsheet(false)} />
        </VStack>
    );
}
