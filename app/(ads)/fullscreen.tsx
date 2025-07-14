import { router, useLocalSearchParams } from "expo-router";
import React, { } from "react";
import products from "@/constants/mockup/products.json";
import { Product } from "@/types";
import { Box } from "@/components/ui/box";
import { ImageSlider } from "@/components/ui/image-slider";
import { Button, ButtonIcon } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/icon";
import { ClosableView } from "@/components/custom/closable-view";

export default function AdFullScreen() {
    const { id, index }: { id: string; index: string; } = useLocalSearchParams();
    const product: Product | undefined = products.findLast((item) => item.id === id);

    return (
        <ClosableView onClose={() => router.dismiss()} >
            <ImageSlider
                fullscreen
                pictures={[product?.image, products[2]?.image]}
                getPicture={(item) => item ?? ''} />

            <Button onPress={() => router.dismiss()} variant="outline"
                action="secondary"
                className="rounded-full p-5 h-5 w-5 absolute top-5 end-5">
                <ButtonIcon as={CloseIcon} />
            </Button>
        </ClosableView>
    )
}