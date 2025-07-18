import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Pressable } from "@/components/ui/pressable";
import { HStack } from "@/components/ui/hstack";
import { Icon, ShareIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HeartIcon } from "lucide-react-native";
import { FlatList } from "react-native";
import { SimpleProductCard } from "../product-card";
import { User } from "@/types";
import products from '@/constants/mockup/products.json';

interface props { seller?: User };

export function ProductSeller({ seller }: props) {

    return (
        <VStack className="gap-2">
            {seller && <Card>
                <Heading size='md'>Seller</Heading>
                <HStack className="mt-2 justify-between">
                    <HStack className="gap-2">
                        <Avatar>
                            <AvatarImage
                                defaultSource={require('@/assets/images/icon.png')}
                                source={{ uri: seller.photo?.full }} />
                        </Avatar>
                        <VStack>
                            <Heading size="sm">{seller.name ?? "Eric Mensah"}</Heading>
                            <Text>{seller?.phone}</Text>
                        </VStack>
                    </HStack>
                    <HStack className="gap-4 item-end">
                        <Pressable>
                            <Icon as={ShareIcon} />
                        </Pressable>
                        <Pressable>
                            <Icon as={HeartIcon} />
                        </Pressable>
                    </HStack>
                </HStack>
            </Card>}

            <Card>
                <FlatList
                    contentContainerClassName="gap-2"
                    horizontal
                    data={products}
                    renderItem={({ item }: any) => <SimpleProductCard product={item} />} />
            </Card>
        </VStack>
    );
}