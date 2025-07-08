import React from "react";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
import { examples } from "@/components/docs/examples/actionsheet";
import { Box } from "@/components/ui/box";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MessageLayout() {
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => setShowActionsheet(false);

  return (

    <SafeAreaView className="flex-1 bg-background-0 relative">
      <ScrollView
        className={`bg-background-0 ${examples?.length > 0 ? "" : "web:justify-center"}`}
        contentContainerClassName="px-3 pb-6"
      >
        <Box className="p-5 rounded-lg m-3 mt-5 bg-background-50 gap-5 min-h-[200px] max-w-[600px] lg:min-w-[700px] w-full self-center">
          <Text className="border-b border-outline-200 pb-2 lg:pb-3 lg:text-xl text-base">
            Default
          </Text>
          <Center className="flex-1">
            <Button onPress={() => setShowActionsheet(true)}>
              <ButtonText>Open Actionsheet</ButtonText>
            </Button>
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
          </Center>
        </Box>

        {examples?.length > 0 &&
          examples.map((Example: any, index: any) => {
            const isFunctionComponent = typeof Example.Code === "function"; // Check if Code is a function
            return (
              <Box
                key={index}
                className="p-5 border border-outline-100 rounded-lg my-2.5 gap-5 min-h-[200px] max-w-[600px] lg:min-w-[700px] w-full self-center"
              >
                <Text className="border-b border-outline-200 pb-2 lg:pb-3 lg:text-xl text-base">
                  {Example.name}
                </Text>

                {Example.subExamples ? (
                  Example.subExamples.map((subExample: any, index: number) => {
                    const isFunctionalComponent =
                      typeof subExample.Code === "function";
                    return (
                      <Box
                        key={index}
                        className="p-5 bg-background-50 rounded-lg gap-5 min-h-[200px] max-w-[600px] lg:min-w-[660px] w-full self-center"
                      >
                        <Text className="border-b border-outline-200 pb-1 lg:pb-2 lg:text-lg text-sm">
                          {subExample.subName}
                        </Text>
                        <Center className="flex-1">
                          {isFunctionalComponent ? (
                            <subExample.Code />
                          ) : (
                            subExample.Code
                          )}
                        </Center>
                      </Box>
                    );
                  })
                ) : (
                  <Center className="flex-1">
                    {isFunctionComponent ? <Example.Code /> : Example.Code}
                  </Center>
                )}
              </Box>
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
}