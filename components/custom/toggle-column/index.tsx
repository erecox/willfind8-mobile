import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Grid2X2Icon, ListIcon } from "lucide-react-native";
import React from "react";

interface props {
    toggleColumns: (isGrid: boolean) => void;
    isGrid?: boolean;
}
export function ToggleColumnButton({ toggleColumns, isGrid }: props) {
    return (
        <Pressable
            className="p-1 bg-secondary-500 dark:bg-background-500 rounded"
            onPress={() => toggleColumns(!isGrid)}
        >
            {isGrid ? (
                <Icon className="color-white" size="lg" as={ListIcon} />
            ) : (
                <Icon className="color-white" size="lg" as={Grid2X2Icon} />
            )}
        </Pressable>
    )
}