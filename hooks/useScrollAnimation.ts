import { useRef, useState } from "react";
import { Animated } from "react-native";

export const useScrollAnimation = () => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;
    const [scrolling, setScrolling] = useState(false);
    const scrollTimeout = useRef<number | null>(null);

    const showFab = scrollY.interpolate({
        inputRange: [0, 300],
        outputRange: [0, 1],
        extrapolate: "clamp",
    });

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        {
            useNativeDriver: true,
            listener: (e: any) => {
                if (!scrolling) {
                    setScrolling(true);
                    Animated.timing(buttonAnim, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }).start();
                }

                // Reset the timeout on each scroll
                if (scrollTimeout.current) {
                    clearTimeout(scrollTimeout.current);
                }

                // When scroll slows or stops (after 500ms), show the button
                scrollTimeout.current = setTimeout(() => {
                    setScrolling(false);
                    Animated.timing(buttonAnim, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }).start();
                }, 300);
            },
        }
    );

    return {
        showFab,
        scrolling,
        buttonAnim,
        handleScroll,
    };
};
