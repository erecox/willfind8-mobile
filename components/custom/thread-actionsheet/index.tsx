import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetFlatList
} from "@/components/ui/actionsheet";
import { Card } from "@/components/ui/card";

interface props<T> {
    handleClose?: () => void;
    showActionsheet?: boolean;
    data: T[]
}

export function ThreadActionsheet<T>({ handleClose, showActionsheet, data }: props<T>) {

    return (
        <Actionsheet isOpen={showActionsheet} onClose={handleClose} snapPoints={[35]}>
            <ActionsheetBackdrop />
            <ActionsheetContent>
                <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                </ActionsheetDragIndicatorWrapper>
                <ActionsheetFlatList
                    data={data} renderItem={() => (
                        <Card>

                        </Card>
                    )} />
            </ActionsheetContent>
        </Actionsheet>
    );
}