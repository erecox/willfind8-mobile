// components/ImageSlider.jsx
import React, { useState } from "react";
import { Pressable } from "../pressable";
import { Image } from "../image";
import { Box } from "../box";
import { Carousel, Pagination } from "react-native-snap-carousel";
import { useWindowDimensions } from "react-native";
import { cssInterop } from "nativewind";
import { Skeleton } from "../skeleton";

cssInterop(Carousel, { "style": 'style' });
interface ImageSliderPropsType<T> {
    initialIndex?: number;
    count_pictures?: number;
    pictures: Array<T>;
    fullscreen?: boolean;
    onPress?: (index: number, pictures: Array<T>) => void;
    getPicture: (item: T, index: number) => string;
}

export function ImageSlider<T>({
    initialIndex = 0,
    count_pictures,
    pictures,
    fullscreen = false,
    onPress,
    getPicture
}: ImageSliderPropsType<T>) {
    const { width: windowSize } = useWindowDimensions()
    const [index, setIndex] = useState(initialIndex);

    const renderItem = ({ index, item }: any) => (
        <Pressable
            onPress={() => {
                if (onPress) onPress(index, item);
            }}
        >
            <Image
                className="w-full h-full"
                alt="Product"
                resizeMode="contain"
                source={getPicture(item, index)}
            />
        </Pressable>
    );

    return (
        <Box>
            {pictures.length > 0 ? (
                <Carousel
                    className={fullscreen ? `h-full bg-background-900` : 'aspect-[21/16]'}
                    data={pictures ?? []}
                    sliderWidth={windowSize}
                    itemWidth={windowSize}
                    firstItem={index}
                    vertical={false}
                    renderItem={renderItem}
                    onSnapToItem={setIndex}
                />
            ) : (
                <Box className="aspect-[21/16]">
                    <Skeleton className="flex-1" speed={2} />
                </Box>
            )}
            <Box className="absolute bottom-0 w-full">
                <Pagination
                    dotStyle={{ backgroundColor: '#fff' }}
                    inactiveDotStyle={{ backgroundColor: "#ccc" }}
                    activeDotIndex={index}
                    dotsLength={pictures.length} />
            </Box>
        </Box>
    );
}