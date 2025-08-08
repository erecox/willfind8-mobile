
import React from 'react';
import FacebookSvg from "@/assets/icons/icons8-facebook.svg";

export const FacebookIcon = ({ size = 'md' }: { size?: 'xs' | 'md' | 'lg' }) => {
  const dim = {
    'xs': 16,
    'md': 24,
    'lg': 32
  };

  return (
    <FacebookSvg width={dim[size]} height={dim[size]} />
  );
};
