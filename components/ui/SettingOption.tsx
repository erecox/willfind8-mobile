// components/SettingOption.js
import React, { PropsWithChildren } from "react";
import { TouchableOpacity } from "react-native";
import { ListItem, Icon, Badge } from "@rneui/themed";

const SettingOption = ({
  title,
  icon,
  value,
  badgeCount,
  onPress,
}: PropsWithChildren & {
  title: string;
  icon: string;
  value?: string;
  badgeCount?: number | string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <ListItem bottomDivider>
        <Icon name={icon} size={24} />
        <ListItem.Content
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <ListItem.Title>{title}</ListItem.Title>
          <ListItem.Subtitle numberOfLines={1} style={{ maxWidth: "50%" }}>
            {value}
          </ListItem.Subtitle>
        </ListItem.Content>
        {badgeCount ? <Badge value={badgeCount} status="error" /> : null}
        <ListItem.Chevron />
      </ListItem>
    </TouchableOpacity>
  );
};

export default SettingOption;
