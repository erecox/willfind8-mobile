import React from "react";
import { Input, InputField } from "@/components/ui/input";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { ScrollView } from "@/components/ui/scroll-view";
import { examples } from "@/components/docs/examples/input";
import { Box } from "@/components/ui/box";

const InputDemo = () => {
  const [inputValue1, setInputValue1] = React.useState("");
  const [inputValue2, setInputValue2] = React.useState("");

  const handleSubmit = () => {
    setInputValue1("");
    setInputValue2("");
  };

  return (
    <ScrollView
      className={`bg-background-0 ${examples?.length > 0 ? "" : "web:justify-center"}`}
      contentContainerClassName="px-3 pb-6"
    >
      <Box className="p-5 rounded-lg m-3 mt-5 bg-background-50 gap-5 min-h-[200px] max-w-[600px] lg:min-w-[700px] w-full self-center">
        <Text className="border-b border-outline-200 pb-2 lg:pb-3 lg:text-xl text-base">
          Default
        </Text>
        <Center className="flex-1">
          <VStack className="rounded-xl border border-outline-200 bg-background-0 p-6 w-full max-w-[406px]">
            <Text size="sm" className="font-medium text-typography-900 mb-3">
              First Name
            </Text>
            <Input size="sm" className="mb-6">
              <InputField
                type={"text"}
                value={inputValue1}
                placeholder="Enter First Name"
                onChangeText={(text) => setInputValue1(text)}
              />
            </Input>

            <Text size="sm" className="font-medium text-typography-900 mb-3">
              Last Name
            </Text>
            <Input size="sm" className="mb-8">
              <InputField
                type={"text"}
                value={inputValue2}
                placeholder="Enter First Name"
                onChangeText={(text) => setInputValue2(text)}
              />
            </Input>

            <Button className="w-full" onPress={handleSubmit}>
              <ButtonText>Submit</ButtonText>
            </Button>
          </VStack>
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
  );
};
export default InputDemo;
