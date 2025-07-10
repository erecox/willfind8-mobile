import { HighlightText } from "@/components/ui/highlight-text";
import { HStack } from "@/components/ui/hstack";
import { SearchIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon } from "@/components/ui/input";
import { FlatList } from "@/components/ui/flat-list";
import { Product } from "@/types";
import React from "react";
import { View } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Divider } from "@/components/ui/divider";
import { Pressable } from "@/components/ui/pressable";

interface SearchBoxProps {
    className?: string;
    data?: Product[];
    query?: string;
    onPress?: () => void;
}

export function SearchBox({ className, data, query, onPress }: SearchBoxProps) {

    return (
        <Pressable className="relative">
            <Input variant="outline" className={`px-1 mt-[15px] border-gray-300 dark:border-gray-500 rounded-xl bg-gray-50 dark:bg-gray-400 ${className}`} >
                <InputIcon className="dark:color-gray-600" as={SearchIcon} />
                <InputField onPress={onPress} className="text-white dark:color-black" placeholder="Search..." />
            </Input>
            {data &&
                <View className="absolute w-full z-100 top-[57px]">
                    <FlatList
                        className="z-100 rounded w-full h-[400px] bg-gray-400 border-gray-500 shadow-hard-5"
                        data={data}
                        extraData={query}
                        renderItem={({ item }: { item: Product }) => (
                            <VStack className="bg-white">
                                <HStack className="p-2">
                                    <HighlightText text={item.name} query={query ?? ""} />
                                </HStack>
                                <Divider />
                            </VStack>
                        )}
                    />
                </View>
            }
        </Pressable>
    )
};