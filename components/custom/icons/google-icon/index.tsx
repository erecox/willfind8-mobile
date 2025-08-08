import React from 'react';

import GoogleSvg from "@/assets/icons/icons8-google-48.svg";

export const GoogleIcon = ({ size = 'md' }: { size?: 'xs' | 'md' | 'lg' }) => {
  const dim = {
    'xs': 16,
    'md': 24,
    'lg': 32
  };

  return (
    <GoogleSvg width={dim[size]} height={dim[size]} />
  );
};
