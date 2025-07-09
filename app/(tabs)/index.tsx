import React, { useRef } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { componentsList } from "@/utils/list";
import { Box } from "@/components/ui/box";
import { Image as ExpoImage } from "expo-image";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { cssInterop } from "nativewind";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { BellIcon, ChevronRightIcon, Icon, SearchIcon } from "@/components/ui/icon";
import useThemeMode from "@/hooks/useThemeMode";
import { Animated, FlatList, Platform, View } from "react-native";
import { Divider } from "@/components/ui/divider";
import { Input, InputField, InputIcon } from "@/components/ui/input";
import { Badge, BadgeText } from "@/components/ui/badge";

cssInterop(SafeAreaView, { className: "style" });
cssInterop(ExpoImage, { className: "style" });

const ComponentCard = ({ component, onPress }: any) => {
  const { themeMode }: any = useThemeMode();
  return (
    <Pressable
      className={`flex-1  bg-background-0 w-full h-full sm:gap-2 gap-1 flex flex-col lg:p-4 ${themeMode === "light" ? "lg:shadow-[0px_0px_4.374px_0px_rgba(38,38,38,0.10)] data-[hover=true]:lg:border data-[hover=true]:border-outline-100" : "lg:shadow-soft-1 lg:border border-outline-50 data-[hover=true]:border-outline-200"}`}
      onPress={onPress}
    >
      <Box className="bg-background-0 px-3 lg:px-6 py-[14px] lg:py-7 aspect-[17/12]">
        <ExpoImage
          source={{
            uri: themeMode === "light" ? component.url : component.darkUrl,
          }}
          alt={component.title}
          className={`flex-1 rounded `}
          cachePolicy="memory-disk"
        />
      </Box>
      <HStack className="justify-between px-1.5 mt-1">
        <Text className="text-typography-900 font-medium sm:text-base text-sm lg:text-xl">
          {component.title}
        </Text>
      </HStack>
    </Pressable>
  );
};

interface HeaderProps {
  translateY: any;
  logoOpacity: any;
}

const Header: React.FC<HeaderProps> = ({ translateY, logoOpacity }) => {
  const { themeMode }: any = useThemeMode();
  return (
    <Animated.View style={[{ position: 'absolute', zIndex: 100, left: 0, right: 0, top: 0 }, { transform: [{ translateY }] }]}>
      <VStack className="w-full h-[100px] p-[10px] border-10 bg-primary-100">
        <Animated.View style={{ opacity: logoOpacity }}>
          <HStack className="justify-between items-center">
            <ExpoImage
              source={{
                uri:
                  themeMode === "light"
                    ? "https://i.imgur.com/9bvua6C.png"
                    : "https://i.imgur.com/EUqtUMu.png",
              }}
              alt="logo_image"
              className="h-[25px] w-[150px]"
            />
            <Pressable className="rounded-xl h-[32px] w-[32px] p-[5px] bg-background-50">
              <Badge size="sm" className='z-10 absolute self-end -mt-2.5 bg-red-600 rounded-full' variant="solid" >
                <BadgeText size="sm" className='text-white'>2</BadgeText>
              </Badge>
              <Icon as={BellIcon} />
            </Pressable>
          </HStack>
        </Animated.View>
        <Input className="px-1 mt-2 rounded-xl">
          <InputIcon as={SearchIcon} />
          <InputField className="" placeholderClassName="color-primary-0" placeholder="Search..." />
        </Input>
      </VStack>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<FlatList>(null); // Ref for the FlatList
  const scrollOffsetRef = useRef(0);

  const translateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -65],
    extrapolate: "clamp",
  });

  const hideLogo = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={{ paddingTop: useSafeAreaInsets().top }} className="flex-1 bg-primary-50 mb-0 pb-0">
      <VStack className="flex-1">
        <Header translateY={translateY} logoOpacity={hideLogo} />
        <Animated.FlatList
          ref={scrollRef}
          contentContainerClassName="pt-[100px] px-[10]"
          className={`${Platform.OS === 'ios' ? "mb-[50px]" : ''} flex-1 bg-background-50`}
          numColumns={3}
          ItemSeparatorComponent={() => <Divider />}
          data={componentsList}
          renderItem={({ item }) => <ComponentCard component={item} />}

          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: true,
              listener: (event: any) => {
                const offset = event.nativeEvent.contentOffset.y;
                scrollOffsetRef.current = offset;
              },
            }
          )}
        />
      </VStack>
    </View>
  );
}
