import React from "react";
import { ScrollView } from "@/components/ui/scroll-view";
import { Box } from "@/components/ui/box";
import { StarIcon } from "@/components/ui/icon";
import {
  FileChartPieIcon,
  HeartHandshakeIcon,
  MessagesSquareIcon,
  ViewIcon
} from "lucide-react-native";
import { VStack } from "@/components/ui/vstack";
import { Divider } from "@/components/ui/divider";
import { ActionBox } from "@/components/custom/action-box";

export default function RecentlyViewedScreen() {

  return (
      <ScrollView
        className={`bg-background-200`}
        contentContainerClassName="p-3 pb-6"
      >

        <Box className="rounded-lg mt-5 w-full self-center">
          <VStack>
            <ActionBox as={FileChartPieIcon} title="My Ads" />
            <Divider />
            <ActionBox as={MessagesSquareIcon} title="Messages" />
            <Divider />
            <ActionBox as={StarIcon} title="Ratings & Reviews" />
            <Divider />
            <ActionBox as={HeartHandshakeIcon} title="Followed Sellers" />
            <Divider />
            <ActionBox as={ViewIcon} title="Recently Viewed" />
          </VStack>
        </Box>
      </ScrollView>
  );
}
