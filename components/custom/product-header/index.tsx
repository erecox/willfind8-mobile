import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { EyeIcon, Icon } from "@/components/ui/icon";
import { ImageSlider } from "@/components/ui/image-slider";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { MapPinIcon } from "lucide-react-native";
import moment from "moment";
import { ProductSpecCard } from "../product-specs-card";
import ReadMore from "@fawazahmed/react-native-read-more";
import { Comment, Product, User } from "@/types";
import { ProductSeller } from "../product-seller";
import seller from "@/constants/mockup/seller.json";
import { formatCount } from "@/utils/product-helper";
import { ProductCommentCard } from "../product-comment-card";

interface props {
    product: Product
    comments?: Comment[]
}

export function ProductHeader({ product, comments }: props) {
    product.seller = seller as unknown as User;

    return (
        <VStack>
            <ImageSlider
                pictures={[product.picture]}
                getPicture={(item) => item.full}
                onPress={(index) => router.push({
                    pathname: "/fullscreen",
                    params: { index, id: product.id }
                })} />

            <VStack className="gap-2">
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
                                <Icon size="xs" as={EyeIcon} />
                                <Text size="xs">{formatCount(product.view_count ?? 0)}</Text>
                            </Box>
                        </HStack>
                        <ProductCommentCard comments={comments ?? []} />
                    </VStack>
                </Card>
                <ProductSpecCard data={product.specs ?? []} />
                <Card className="flex-1">
                    <ReadMore numberOfLines={5}>
                        {product.description}
                    </ReadMore>
                </Card>

                <ProductSeller seller={product.seller} />
            </VStack>
        </VStack>
    )
};
