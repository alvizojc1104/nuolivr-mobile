import { useAuth, useUser } from "@clerk/clerk-expo";
import {
  AlertTriangle,
  BadgeCheck,
  Banknote,
  ChevronRight,
  ClipboardList,
  HelpCircle,
  MessageSquare,
  NotepadText,
  Phone,
} from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Alert } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import {
  Heading,
  YStack,
  XStack,
  Avatar,
  Text,
  Spacer,
  Button,
  SizableText,
  YGroup,
  ListItem,
  Theme,
  Circle,
} from "tamagui";

const Home = () => {
  const { isLoaded, user } = useUser();
  const { signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  if (!isLoaded) return

  const logOut = () => {
    setIsLoading(true);
    try {
      signOut();
      router.replace("/");
    } catch (error) {
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [{ text: "Cancel", style: 'cancel' }, { text: "Confirm", onPress: logOut}])
  }

  return (
    <>
      <YStack flex={1} gap={10} theme={"active"} padding={15}>
        <Spinner visible={isLoading} />
        <XStack
          width={"100%"}
          paddingVertical={5}
          paddingHorizontal={5}
          alignItems="center"
        >
          <Avatar circular size="$7">
            <Avatar.Image src={user?.imageUrl} />
          </Avatar>
          <Spacer />
          <YStack>
            <Heading size={"$7"}>{`${user?.firstName ? user.firstName : "Loading..."} ${user?.lastName ? user?.lastName : "Loading..."}`}</Heading>

            <Link href="/profile" asChild>
              <SizableText>View Profile</SizableText>
            </Link>
          </YStack>
        </XStack>

        <Spacer />
        <Button
          size="$10"
          width={"100%"}
          alignSelf="center"
          elevate
          justifyContent="flex-start"
          theme="blue_active"
        >
          <XStack alignItems="center">
            <Circle>
              <ClipboardList size="$4" />
            </Circle>
            <Spacer />
            <YStack>
              <Heading>Health Records</Heading>
              <Text fontSize={"$5"}>Lab Results and Moree</Text>
            </YStack>
          </XStack>
        </Button>
        <Spacer />
        <Heading>Settings</Heading>
        <YGroup elevate size="$5">
          <YGroup.Item>
            <ListItem
              icon={<Banknote />}
              iconAfter={<ChevronRight />}
              size="$5"
              pressTheme
              title="Legal"
            />
          </YGroup.Item>

          <YGroup.Item>
            <ListItem
              icon={<HelpCircle />}
              iconAfter={<ChevronRight />}
              size="$5"
              pressTheme
              title="Help and FAQs"
            />
          </YGroup.Item>

          <YGroup.Item>
            <ListItem
              icon={<AlertTriangle />}
              iconAfter={<ChevronRight />}
              size="$5"
              pressTheme
              title="Emergency Contact Details"
            />
          </YGroup.Item>

          <YGroup.Item>
            <ListItem
              icon={<BadgeCheck />}
              iconAfter={<ChevronRight />}
              size="$5"
              pressTheme
              title="Account"
            />
          </YGroup.Item>

          <YGroup.Item>
            <ListItem
              icon={<MessageSquare />}
              iconAfter={<ChevronRight />}
              size="$5"
              pressTheme
              title="Feedback"
            />
          </YGroup.Item>
        </YGroup>

        <YStack flex={1} />
        <Button
          size="$5"
          width={"100%"}
          alignSelf="center"
          theme="red_active"
          fontWeight={900}
          onPress={handleLogout}
        >
          Logout
        </Button>
      </YStack>
    </>
  );
};

export default Home;
