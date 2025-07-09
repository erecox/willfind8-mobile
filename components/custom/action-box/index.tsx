import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { ChevronRightIcon, Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import React from "react";
import { TouchableOpacity } from "react-native";

interface ActionBoxProps {
    as: React.ElementType;
    title: string;
    className?: string;
    onPress?: () => void;
};

export function ActionBox({ as, title, className, onPress }: ActionBoxProps) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={.5}>
            <Card className={`w-full bg-background-0 ${className}`}>
                <HStack className="w-full items-center justify-between">
                    <HStack className="gap-2 items-center">
                        <Icon as={as} />
                        <Text className="self-start">{title}</Text>
                    </HStack>
                    <Icon as={ChevronRightIcon} />
                </HStack>
            </Card>
        </TouchableOpacity>
    );
}