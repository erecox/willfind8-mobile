import React from "react";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Heading } from "@/components/ui/heading";
import { ChevronRightIcon, Icon } from "@/components/ui/icon";

interface propType {
  onPress?: () => void;
}

export function ListAllHeader({ onPress }: propType) {
  return (
    <Card className="py-1">
      <HStack className="justify-end">
        <Pressable
          onPress={onPress}
          className="flex flex-row items-center gap-1"
        >
          <Heading size="xs">List Products</Heading>
          <Icon as={ChevronRightIcon} />
        </Pressable>
      </HStack>
    </Card>
  );
}
