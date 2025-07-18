import { Divider } from "@/components/ui/divider";
import { HelpCircleIcon } from "@/components/ui/icon";
import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetIcon,
    ActionsheetItem,
    ActionsheetItemText,
    ActionsheetSectionHeaderText,
    ActionsheetSectionList
} from "@/components/ui/select/select-actionsheet";
import { ExternalPathString, RelativePathString, router } from "expo-router";
import { BadgeHelpIcon, HelpingHandIcon, LucideIcon } from "lucide-react-native";

interface props {
    handleClose?: () => void;
    showActionsheet?: boolean;
}
interface SheetItem {
    title: string;
    icon: LucideIcon,
    onPress: () => void;
}

const data: SheetItem[] = [
    {
        title: "Report Seller",
        icon: HelpingHandIcon,
        onPress: () => router.push({ pathname: '/(account)/customer-support' })
    }
];

export function ProductActionSheet({ handleClose, showActionsheet }: props) {

    const DATA = [{
        title: 'Action', data,
    }];

    return (
        <Actionsheet isOpen={showActionsheet} onClose={handleClose} snapPoints={[35]}>
            <ActionsheetBackdrop />
            <ActionsheetContent>
                <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                </ActionsheetDragIndicatorWrapper>
                <ActionsheetSectionList
                    sections={DATA}
                    keyExtractor={(item: any, index) => item + index}

                    renderItem={({ item }: any) => (
                        <>
                            <ActionsheetItem onPress={() => { if (handleClose) handleClose(); item?.onPress() }}>
                                <ActionsheetIcon as={HelpingHandIcon} />
                                <ActionsheetItemText>{item.title}</ActionsheetItemText>
                            </ActionsheetItem>
                            <Divider />
                        </>
                    )}

                />
            </ActionsheetContent>
        </Actionsheet>
    );
}