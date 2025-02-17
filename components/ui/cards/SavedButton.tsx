import { Button, lightColors } from "@rneui/themed";

export default function SavedButton({
  onPress,
  active,
}: {
  onPress?: (e: any) => void;
  active?: boolean;
}) {
  return (
    <Button
      onPress={onPress}
      type="clear"
      icon={{
        name: "bookmark",
        size: 24,
        color: active ? lightColors.success : lightColors.black,
      }}
      buttonStyle={{ paddingHorizontal: 0, marginHorizontal: 0 }}
    />
  );
}
