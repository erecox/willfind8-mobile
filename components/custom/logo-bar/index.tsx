

import { Badge, BadgeText } from "@/components/ui/badge";
import { HStack } from "@/components/ui/hstack";
import { BellIcon, Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Image as ExpoImage } from "expo-image";

interface LogoBarProps {
    notifications?: number;
    onBadgePress?: () => void;
}

export function LogoBar({ notifications, onBadgePress }: LogoBarProps) {

    return (
        <HStack className="justify-between items-center">
            <ExpoImage
                source={require('@/assets/images/willfind-logo-full.png')}
                alt="logo_image"
                className="h-[25px] w-[150px]"
            />

            <Pressable onPress={onBadgePress} className="rounded-xl h-[32px] w-[32px] p-[5px] items-center bg-background">
                {(notifications ?? 0) > 0 && <Badge size="sm" className='z-10 absolute self-end -mt-2 bg-red-600 rounded-full' variant="solid" >
                    <BadgeText size="sm" className='text-white'>{notifications}</BadgeText>
                </Badge>}
                <Icon as={BellIcon} className="dark:color-gray-500" />
            </Pressable>
        </HStack>
    )
}