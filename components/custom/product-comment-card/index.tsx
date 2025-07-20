import { Comment, Thread } from "@/types";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { TouchableOpacity } from "react-native";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { AngryIcon, SmileIcon } from "lucide-react-native";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Box } from "@/components/ui/box";

interface props {
    threads: Thread[]
}
export function ProductCommentCard({
    threads
}: props) {

    return (
        <>
        <TouchableOpacity activeOpacity={.6}>
            <Card size="sm" className="rounded-15 mt-4 gap-1 bg-background-100">
                <HStack className="justify-between">
                    <Heading size="xs">Comments</Heading>
                    <HStack className="gap-1">
                        <Badge action="success" className="gap-1 px-0 bg-background-none">
                            <BadgeIcon as={SmileIcon} />
                            <BadgeText>4</BadgeText>
                        </Badge>
                        <Badge action="error" className="gap-1 px-0 bg-background-none">
                            <BadgeIcon as={AngryIcon} />
                            <BadgeText>2</BadgeText>
                        </Badge>
                    </HStack>
                </HStack>
                <HStack className="gap-1">
                    <Avatar size="xs" >
                        <AvatarFallbackText>None User</AvatarFallbackText>
                        <AvatarImage />
                    </Avatar>
                    <Box className="flex-1">
                        <Text size="xs" numberOfLines={2} >
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore aliquid vitae ut consequuntur ad vel fugit, accusantium sit optio excepturi, dignissimos eius, vero veniam. Culpa autem velit similique provident saepe?
                        </Text>
                    </Box>
                </HStack>
            </Card>
        </TouchableOpacity>
        
        </>
    )
}