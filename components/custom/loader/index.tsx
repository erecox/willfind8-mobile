import React from 'react';
import LottieView from 'lottie-react-native';
import { View } from 'react-native';

export default function Loader() {
  const l = require('@/assets/animations/wf8_loader_lottie.json');
  return (
    <View className="flex-1 absolute w-full h-full items-center justify-center opacity-70 bg-background-600 dark:bg-background-700">
      <LottieView
        source={l}
        autoPlay
        loop
        style={{ width: 100, height: 100, }}
      />
    </View>
  );
}
