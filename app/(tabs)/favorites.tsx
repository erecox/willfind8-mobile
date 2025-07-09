import React from "react";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
import { VStack } from "@/components/ui/vstack";
import { SearchBox } from "@/components/custom/search-box";
import { FlatList, Platform } from "react-native";
import { ProductCard } from "@/components/custom/product-card";

import products from "@/constants/mockup/products.json";
import { SafeAreaView } from "@/components/ui/safe-area-view";

export default function FavouriteScreen() {
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => setShowActionsheet(false);

  return (
    <SafeAreaView>
      <VStack className="flex-1 dark:bg-background-900 bg-background-300">
        <VStack className="w-full p-[10px] border-10 bg-background-0 dark:bg-background-900">
          <SearchBox className="mt-0" />
        </VStack>
        <FlatList
          contentContainerClassName=" px-[10] gap-y-[2px]"
          className={`${Platform.OS === 'ios' ? "mb-[50px]" : ''} flex-1 py-[10]`}
          numColumns={2}
          columnWrapperClassName={"gap-x-[2px]"}
          initialNumToRender={10}
          data={products}
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      </VStack>
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText>Delete</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText>Share</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText>Play</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText>Favourite</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText>Cancel</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </SafeAreaView>
  );
}

