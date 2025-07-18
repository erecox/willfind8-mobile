import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { MessageCircleIcon } from "@/components/ui/icon";
import { PhoneCallIcon } from "lucide-react-native";
import React from "react";

export function BottomFabs({ }) {

    return (
        <HStack className="absolute bottom-0 z-100 w-full bg-background-0">
            <Button variant="outline" className="w-1/2 rounded-none">
                <ButtonIcon as={MessageCircleIcon} />
                <ButtonText>Chat</ButtonText>
            </Button>
            <Button className="w-1/2 rounded-none">
                <ButtonIcon as={PhoneCallIcon} />
                <ButtonText>Call Now</ButtonText>
            </Button>
        </HStack>
    )
}