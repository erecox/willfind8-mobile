import { FavouriteIcon, Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import React from "react";

interface props {
    active?: boolean;
    onToggleActive?: (active: boolean) => void;
}

export function FavouriteButton({ active, onToggleActive }: props) {

    return (
        <Pressable onPress={() => onToggleActive && onToggleActive(!active)} className="absolute right-6 top-6">
            <Icon className={`shadow-hard-1 ${active ? 'fill-primary-500' : ''}`} color="white" size="lg" as={FavouriteIcon} />
        </Pressable>
    )
}