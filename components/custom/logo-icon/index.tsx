
import React from "react";
import { Image } from "@/components/ui/image";

export function LogoIcon ({className}:{className?:string}){

    return (<Image alt="Logo" source={require('@/assets/images/willfind8-icon.png')} />);
}