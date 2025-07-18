import { FavouriteIcon, Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import React from "react";

interface props {
    active?: boolean;
    size?: "xl" | "2xs" | "xs" | "sm" | "md" | "lg" | "2xl";
    className?: string;
    onToggleActive?: (active: boolean) => void;
}

export function FavouriteButton({ active, size = "xl", className = "absolute right-3 top-3", onToggleActive }: props) {

    return (
        <Pressable onPress={() => onToggleActive && onToggleActive(!active)} className={className}>
            <Icon className={`shadow-hard-1 ${active ? 'fill-primary-500' : ''}`} color="white" size={size} as={FavouriteIcon} />
        </Pressable>
    )
}