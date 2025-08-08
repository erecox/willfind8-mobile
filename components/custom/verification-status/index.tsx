import React from "react";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { CheckCircleIcon, AlertCircleIcon, ClockIcon } from "lucide-react-native";

interface VerificationStatusProps {
  isVerified: boolean;
  isPending?: boolean;
  size?: "sm" | "md" | "lg";
}

export function VerificationStatus({ isVerified, isPending = false, size = "sm" }: VerificationStatusProps) {
  if (isPending) {
    return (
      <Badge action="warning" variant="solid" size={size}>
        <Icon as={ClockIcon} className="text-warning-50 mr-1" size="xs" />
        <BadgeText>Pending</BadgeText>
      </Badge>
    );
  }
  
  if (isVerified) {
    return (
      <Badge action="success" variant="solid" size={size}>
        <Icon as={CheckCircleIcon} className="text-success-50 mr-1" size="xs" />
        <BadgeText>Verified</BadgeText>
      </Badge>
    );
  }
  
  return (
    <Badge action="error" variant="solid" size={size}>
      <Icon as={AlertCircleIcon} className="text-error-50 mr-1" size="xs" />
      <BadgeText>Unverified</BadgeText>
    </Badge>
  );
}
