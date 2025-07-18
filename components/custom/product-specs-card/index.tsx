import { Card } from "@/components/ui/card";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ProductSpec } from "@/types";
import { getSpecValue } from "@/utils/product-helper";
import ReadMore from "@fawazahmed/react-native-read-more";
import { cssInterop } from "nativewind";
import React, { useState } from "react";
import { FlatList } from "react-native";

cssInterop(ReadMore, { style: 'style' });
interface ProductSpecProps {
    data: ProductSpec[]
}
export function ProductSpecCard({ data }: ProductSpecProps) {
    const specs1 = data.slice(0, 4);
    const specs2 = data.slice(4);
    const [showMore, toggleReadMore] = useState(false);

    const renderItem = ({ item }: { item: ProductSpec }) => {
        return (
            <VStack className="w-1/2 p-1">
                <ReadMore numberOfLines={1}
                    seeLessStyle={{ fontSize: 14, color:'gray' }}
                    seeMoreStyle={{ fontSize: 14,color:'gray' }}>{getSpecValue(item)}</ReadMore>
                <Text size="xs" className="text-secondary-500 font-light uppercase mt-1">{item.name}</Text>
            </VStack>
        );
    };

    return (
        <Card>
            <FlatList
                data={[...specs1, ...(showMore ? specs2 : [])]}
                numColumns={2}
                className="gap-3"
                columnWrapperClassName="gap-2"
                renderItem={renderItem}
                ListFooterComponent={() => (
                    <Pressable onPress={() => toggleReadMore(!showMore)} className="fw-full flex flex-row justify-end">
                        {showMore ? <Text className="color-secondary-500" size="xs">Read Less</Text>
                            : <Text size="xs" className="color-secondary-500">Read More</Text>}
                    </Pressable>)} />
        </Card>
    )
}