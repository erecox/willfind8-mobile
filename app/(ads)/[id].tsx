import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import products from "@/constants/mockup/products.json";
import { Product } from "@/types";
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { ProductCardLandscape } from "@/components/custom/product-card";
import { Divider } from "@/components/ui/divider";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { ImageSlider } from "@/components/ui/image-slider";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { EyeIcon, Icon, MessageCircleIcon } from "@/components/ui/icon";
import { MapPinIcon, PhoneCallIcon } from "lucide-react-native";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import moment from "moment";

export default function AdDetailsScreen() {
    const { id }: { id: string; } = useLocalSearchParams();
    const product: Product | undefined = products.findLast((item) => item.id === id);

    const [scrolling, setScrolling] = useState(false);
    const buttonAnim = useRef(new Animated.Value(1)).current;
    const scrollTimeout = useRef<number | null>(null);


    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (!scrolling) {
            setScrolling(true);
            Animated.timing(buttonAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }

        // Reset the timeout on each scroll
        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }

        // When scroll slows or stops (after 500ms), show the button
        scrollTimeout.current = setTimeout(() => {
            setScrolling(false);
            Animated.timing(buttonAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }, 500);
    };

    return (
        <VStack className="flex-1">
            <Stack.Screen options={{ title: product?.category }} />
            <Animated.FlatList
                data={products}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                initialNumToRender={5}
                contentContainerClassName={'pb-11'}
                renderItem={({ item }) => <ProductCardLandscape product={item} />}
                ItemSeparatorComponent={() => <Divider />}
                ListHeaderComponent={() => <Header product={product} />}
            />
            <Animated.View style={{ opacity: buttonAnim }}
                className="flex flex-row absolute bottom-0 bg-background-0">
                <Button variant="outline" className="w-1/2 rounded-none">
                    <ButtonIcon as={MessageCircleIcon} />
                    <ButtonText>Chat</ButtonText>
                </Button>
                <Button className="w-1/2 rounded-none">
                    <ButtonIcon as={PhoneCallIcon} />
                    <ButtonText>Call Now</ButtonText>
                </Button>
            </Animated.View>
        </VStack>
    )
}

const Header = ({ product }: { product: Product }) => {
    return (
        <VStack>
            <ImageSlider
                pictures={[product?.image, products[2]?.image]}
                getPicture={(item) => item}
                onPress={(index) => router.push({ pathname: "/fullscreen", params: { index, id: product.id }})} />
            <Card className="pt-0">
                <VStack className="gap-1">

                    <HStack className="justify-between">
                        <Heading numberOfLines={2}>
                            {product.name}
                        </Heading>
                    </HStack>
                    <Text size="md" className="text-typography-800">
                        {"GHC"} {product.price}
                    </Text>
                    <HStack className="gap-1 items-center justify-between">
                        <HStack className="items-center gap-1">
                            <Icon size="xs" as={MapPinIcon} />
                            <Text size="xs">
                                {product.city}
                            </Text>
                        </HStack>
                        <Box className="flex flex-row items-center gap-2">
                            <Text size="2xs">{moment('2025-07-14 06:00:00').fromNow()}</Text>
                            <Icon size="sm" as={EyeIcon} />
                            <Text size="sm">{product.views ?? 0}</Text>
                        </Box>
                    </HStack>
                </VStack>
            </Card>
            <Card className="my-2">

            </Card>
        </VStack>
    )
};