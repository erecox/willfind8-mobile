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

export default function SettingsScreen() {

  return (
      <ScrollView
        className={`bg-background-200`}
        contentContainerClassName="p-3 pb-6"
      >

        <Box className="rounded-lg mt-5 w-full self-center">
          <VStack>
            <ActionBox as={FileChartPieIcon} title="Personal Information" />
            <Divider />
            <ActionBox as={MessagesSquareIcon} title="Phone number" />
            <Divider />
            <ActionBox as={StarIcon} title="Change Password" />
          </VStack>
        </Box>
      </ScrollView>
  );
}
