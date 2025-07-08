import React from "react";
import { Center } from "@/components/ui/center";
import { Grid, GridItem } from "@/components/ui/grid";
import { ScrollView } from "@/components/ui/scroll-view";
import { examples } from "@/components/docs/examples/grid";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoriesLayout () {
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
            <Grid
              className="gap-4 max-w-[600px]"
              _extra={{
                className: "grid-cols-2",
              }}
            >
              <GridItem
                className="border border-dashed border-outline-400 rounded-lg h-[68px]"
                _extra={{
                  className: "col-span-1",
                }}
              />
              <GridItem
                className="border border-dashed border-outline-400 rounded-lg h-[68px]"
                _extra={{
                  className: "col-span-1",
                }}
              />
              <GridItem
                className="border border-dashed border-outline-400 rounded-lg h-[68px]"
                _extra={{
                  className: "col-span-1",
                }}
              />
              <GridItem
                className="border border-dashed border-outline-400 rounded-lg h-[68px]"
                _extra={{
                  className: "col-span-1",
                }}
              />
              <GridItem
                className="border border-dashed border-outline-400 rounded-lg h-[68px]"
                _extra={{
                  className: "col-span-1",
                }}
              />
              <GridItem
                className="border border-dashed border-outline-400 rounded-lg h-[68px]"
                _extra={{
                  className: "col-span-1",
                }}
              />
            </Grid>
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
                <Center className="flex-1">
                  {isFunctionComponent ? <Example.Code /> : Example.Code}
                </Center>
              </Box>
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
}
