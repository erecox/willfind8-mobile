import React, { useState, useEffect } from "react";
import { ScrollView } from "@/components/ui/scroll-view";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Avatar, AvatarImage, AvatarFallbackText } from "@/components/ui/avatar";
import { useAuthStore } from "@/hooks/useAuth";
import { useAppToast } from "@/hooks/useToast";
import { sellerService } from "@/utils/sellerService";
import { Redirect } from "expo-router";
import { 
  StoreIcon,
  StarIcon,
  ShieldCheckIcon,
  EditIcon,
  PlusIcon,
  TrendingUpIcon,
  MessageSquareIcon,
  EyeIcon,
  PackageIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  GlobeIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon
} from "lucide-react-native";
import { SellerProfile, VerificationStatus } from "@/types";
import { CreateSellerProfileModal } from "@/components/modals/create-seller-profile";

export default function BusinessInformationScreen() {
  const { user, refreshUser } = useAuthStore();
  const { showError, showSuccess } = useAppToast();
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [stats, setStats] = useState({
    totalAds: 0,
    activeAds: 0,
    totalViews: 0,
    totalMessages: 0,
    averageRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showCreateProfile, setShowCreateProfile] = useState(false);

  if (!user) return <Redirect href={'/(auth)/login'} />;

  useEffect(() => {
    loadSellerData();
  }, []);

  const loadSellerData = async () => {
    try {
      setLoading(true);
      
      // Try to get seller profile
      try {
        const profile = await sellerService.getSellerProfile();
        setSellerProfile(profile);
        
        // Get stats if profile exists
        const statsData = await sellerService.getSellerStats();
        setStats(statsData);
      } catch (error: any) {
        // If no seller profile exists, that's okay
        if (error.status !== 404) {
          console.error('Error loading seller data:', error);
        }
      }
    } catch (error: any) {
      showError('Error', 'Failed to load business information');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSellerProfile = () => {
    setShowCreateProfile(true);
  };

  const handleCreateProfileSuccess = async () => {
    setShowCreateProfile(false);
    await loadSellerData();
    showSuccess('Success', 'Business profile created successfully!');
  };

  const handleEditProfile = () => {
    // Navigate to edit seller profile screen
    console.log('Navigate to edit seller profile');
  };

  const handleStartVerification = () => {
    // Navigate to verification screen
    console.log('Navigate to verification screen');
  };

  const getVerificationStatusBadge = (status?: VerificationStatus) => {
    if (!status) {
      return (
        <Badge action="muted" variant="solid" size="sm">
          <Icon as={AlertCircleIcon} className="text-typography-50 mr-1" size="xs" />
          <BadgeText>Not Started</BadgeText>
        </Badge>
      );
    }

    switch (status) {
      case VerificationStatus.PENDING:
        return (
          <Badge action="warning" variant="solid" size="sm">
            <Icon as={ClockIcon} className="text-warning-50 mr-1" size="xs" />
            <BadgeText>Pending</BadgeText>
          </Badge>
        );
      case VerificationStatus.APPROVED:
        return (
          <Badge action="success" variant="solid" size="sm">
            <Icon as={CheckCircleIcon} className="text-success-50 mr-1" size="xs" />
            <BadgeText>Verified</BadgeText>
          </Badge>
        );
      case VerificationStatus.REJECTED:
        return (
          <Badge action="error" variant="solid" size="sm">
            <Icon as={XCircleIcon} className="text-error-50 mr-1" size="xs" />
            <BadgeText>Rejected</BadgeText>
          </Badge>
        );
      case VerificationStatus.EXPIRED:
        return (
          <Badge action="muted" variant="solid" size="sm">
            <Icon as={AlertCircleIcon} className="text-typography-50 mr-1" size="xs" />
            <BadgeText>Expired</BadgeText>
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderSocialMediaLinks = (socialMedia: any) => {
    if (!socialMedia) return null;

    const platforms = [
      { key: 'facebook', icon: FacebookIcon, color: 'text-blue-600' },
      { key: 'instagram', icon: InstagramIcon, color: 'text-pink-600' },
      { key: 'twitter', icon: TwitterIcon, color: 'text-blue-400' },
      { key: 'linkedin', icon: LinkedinIcon, color: 'text-blue-700' },
    ];

    const activePlatforms = platforms.filter(platform => socialMedia[platform.key]);

    if (activePlatforms.length === 0) return null;

    return (
      <HStack space="sm" className="mt-2">
        {activePlatforms.map(platform => (
          <Icon 
            key={platform.key}
            as={platform.icon} 
            className={platform.color} 
            size="sm" 
          />
        ))}
      </HStack>
    );
  };

  if (loading) {
    return (
      <ScrollView className="bg-background-50" contentContainerClassName="p-4">
        <Text className="text-center text-typography-600">Loading...</Text>
      </ScrollView>
    );
  }

  // If no seller profile exists, show create profile screen
  if (!sellerProfile) {
    return (
      <ScrollView className="bg-background-50" contentContainerClassName="p-4 pb-6">
        <Card className="p-6">
          <VStack space="lg" className="items-center">
            <Icon as={StoreIcon} className="text-primary-600" size="xl" />
            <VStack space="sm" className="items-center">
              <Heading size="lg" className="text-center">
                Become a Seller
              </Heading>
              <Text size="sm" className="text-typography-600 text-center">
                Create your business profile to start selling on WillFind8
              </Text>
            </VStack>
            
            <VStack space="md" className="w-full">
              <Text className="font-medium">Benefits of becoming a seller:</Text>
              <VStack space="sm">
                <HStack space="sm" className="items-center">
                  <Icon as={CheckCircleIcon} className="text-success-600" size="sm" />
                  <Text size="sm">Reach thousands of potential customers</Text>
                </HStack>
                <HStack space="sm" className="items-center">
                  <Icon as={CheckCircleIcon} className="text-success-600" size="sm" />
                  <Text size="sm">Build your business reputation with reviews</Text>
                </HStack>
                <HStack space="sm" className="items-center">
                  <Icon as={CheckCircleIcon} className="text-success-600" size="sm" />
                  <Text size="sm">Get verified seller badge for trust</Text>
                </HStack>
                <HStack space="sm" className="items-center">
                  <Icon as={CheckCircleIcon} className="text-success-600" size="sm" />
                  <Text size="sm">Access to seller analytics and insights</Text>
                </HStack>
              </VStack>
            </VStack>

            <Button className="w-full" onPress={handleCreateSellerProfile}>
              <ButtonIcon as={PlusIcon} />
              <ButtonText>Create Business Profile</ButtonText>
            </Button>
          </VStack>
        </Card>

        <CreateSellerProfileModal
          isOpen={showCreateProfile}
          onClose={() => setShowCreateProfile(false)}
          onSuccess={handleCreateProfileSuccess}
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      className="bg-background-50" 
      contentContainerClassName="p-4 pb-6"
      showsVerticalScrollIndicator={false}
    >
      {/* Business Profile Header */}
      <Card className="p-6">
        <VStack space="lg">
          <HStack className="items-center justify-between">
            <HStack className="items-center flex-1" space="md">
              <Avatar size="lg">
                <AvatarImage source={{ uri: user.avatar }} />
                <AvatarFallbackText>
                  {sellerProfile.businessName?.charAt(0) || user.firstName?.charAt(0) || 'B'}
                </AvatarFallbackText>
              </Avatar>
              <VStack className="flex-1">
                <Heading size="md" className="text-typography-900">
                  {sellerProfile.businessName || 'Business Name'}
                </Heading>
                <Text size="sm" className="text-typography-600">
                  {sellerProfile.businessType || 'Business Type'}
                </Text>
                <HStack className="items-center" space="xs">
                  <Icon as={StarIcon} className="text-warning-500" size="sm" />
                  <Text size="sm" className="font-medium">
                    {sellerProfile.rating.toFixed(1)}
                  </Text>
                  <Text size="sm" className="text-typography-600">
                    ({sellerProfile.totalReviews} reviews)
                  </Text>
                </HStack>
              </VStack>
            </HStack>
            <Button variant="outline" size="sm" onPress={handleEditProfile}>
              <ButtonIcon as={EditIcon} />
              <ButtonText>Edit</ButtonText>
            </Button>
          </HStack>

          {sellerProfile.description && (
            <Text size="sm" className="text-typography-700">
              {sellerProfile.description}
            </Text>
          )}

          {sellerProfile.website && (
            <HStack className="items-center" space="sm">
              <Icon as={GlobeIcon} className="text-primary-600" size="sm" />
              <Text size="sm" className="text-primary-600">
                {sellerProfile.website}
              </Text>
            </HStack>
          )}

          {renderSocialMediaLinks(sellerProfile.socialMedia)}
        </VStack>
      </Card>

      {/* Verification Status */}
      <Card className="mt-4 p-6">
        <VStack space="lg">
          <HStack className="items-center justify-between">
            <HStack className="items-center" space="md">
              <Icon as={ShieldCheckIcon} className="text-primary-600" size="md" />
              <VStack>
                <Text className="font-medium">Verification Status</Text>
                <Text size="sm" className="text-typography-600">
                  Verify your business to build trust
                </Text>
              </VStack>
            </HStack>
            <VStack className="items-end" space="sm">
              {getVerificationStatusBadge(sellerProfile.verification?.status)}
              {(!sellerProfile.verification || sellerProfile.verification.status === VerificationStatus.REJECTED) && (
                <Button variant="outline" size="sm" onPress={handleStartVerification}>
                  <ButtonText>
                    {sellerProfile.verification?.status === VerificationStatus.REJECTED ? 'Retry' : 'Start Verification'}
                  </ButtonText>
                </Button>
              )}
            </VStack>
          </HStack>

          {sellerProfile.verification?.status === VerificationStatus.REJECTED && sellerProfile.verification.notes && (
            <Box className="bg-error-50 p-3 rounded-md">
              <Text size="sm" className="text-error-800 font-medium">
                Verification Rejected
              </Text>
              <Text size="sm" className="text-error-700 mt-1">
                {sellerProfile.verification.notes}
              </Text>
            </Box>
          )}

          {sellerProfile.verification?.status === VerificationStatus.PENDING && (
            <Box className="bg-warning-50 p-3 rounded-md">
              <Text size="sm" className="text-warning-800">
                Your verification is being reviewed. This usually takes 2-3 business days.
              </Text>
            </Box>
          )}
        </VStack>
      </Card>

      {/* Business Statistics */}
      <Card className="mt-4 p-6">
        <VStack space="lg">
          <Heading size="sm">Business Statistics</Heading>
          
          <VStack space="md">
            <HStack className="justify-between">
              <HStack className="items-center" space="sm">
                <Icon as={PackageIcon} className="text-primary-600" size="sm" />
                <Text size="sm">Total Ads</Text>
              </HStack>
              <Text size="sm" className="font-medium">{stats.totalAds}</Text>
            </HStack>

            <HStack className="justify-between">
              <HStack className="items-center" space="sm">
                <Icon as={TrendingUpIcon} className="text-success-600" size="sm" />
                <Text size="sm">Active Ads</Text>
              </HStack>
              <Text size="sm" className="font-medium">{stats.activeAds}</Text>
            </HStack>

            <HStack className="justify-between">
              <HStack className="items-center" space="sm">
                <Icon as={EyeIcon} className="text-info-600" size="sm" />
                <Text size="sm">Total Views</Text>
              </HStack>
              <Text size="sm" className="font-medium">{stats.totalViews.toLocaleString()}</Text>
            </HStack>

            <HStack className="justify-between">
              <HStack className="items-center" space="sm">
                <Icon as={MessageSquareIcon} className="text-warning-600" size="sm" />
                <Text size="sm">Messages</Text>
              </HStack>
              <Text size="sm" className="font-medium">{stats.totalMessages}</Text>
            </HStack>

            <HStack className="justify-between">
              <HStack className="items-center" space="sm">
                <Icon as={StarIcon} className="text-warning-500" size="sm" />
                <Text size="sm">Average Rating</Text>
              </HStack>
              <Text size="sm" className="font-medium">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'No ratings yet'}
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </Card>

      {/* Quick Actions */}
      <Card className="mt-4 p-6">
        <VStack space="lg">
          <Heading size="sm">Quick Actions</Heading>
          
          <VStack space="sm">
            <Button variant="outline" className="justify-start">
              <ButtonIcon as={PackageIcon} />
              <ButtonText>Manage My Ads</ButtonText>
            </Button>

            <Button variant="outline" className="justify-start">
              <ButtonIcon as={MessageSquareIcon} />
              <ButtonText>View Messages</ButtonText>
            </Button>

            <Button variant="outline" className="justify-start">
              <ButtonIcon as={StarIcon} />
              <ButtonText>View Reviews</ButtonText>
            </Button>

            <Button variant="outline" className="justify-start">
              <ButtonIcon as={TrendingUpIcon} />
              <ButtonText>Business Analytics</ButtonText>
            </Button>
          </VStack>
        </VStack>
      </Card>

      {/* Business Tips */}
      <Card className="mt-4 p-6">
        <VStack space="md">
          <Heading size="sm">Tips to Grow Your Business</Heading>
          <VStack space="sm">
            <Text size="sm" className="text-typography-600">
              • Complete your business verification to build trust
            </Text>
            <Text size="sm" className="text-typography-600">
              • Add high-quality photos to your ads
            </Text>
            <Text size="sm" className="text-typography-600">
              • Respond quickly to customer messages
            </Text>
            <Text size="sm" className="text-typography-600">
              • Keep your business information up to date
            </Text>
            <Text size="sm" className="text-typography-600">
              • Encourage satisfied customers to leave reviews
            </Text>
          </VStack>
        </VStack>
      </Card>

      {/* Modals */}
      <CreateSellerProfileModal
        isOpen={showCreateProfile}
        onClose={() => setShowCreateProfile(false)}
        onSuccess={handleCreateProfileSuccess}
      />
    </ScrollView>
  );
}
