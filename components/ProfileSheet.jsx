import {
  LogOut,
  Moon,
  CircleUserRound,
} from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Sheet,
  YStack,
  XStack,
  SizableText,
  YGroup,
  ListItem,
  Heading,
  Separator,
  Switch,
} from "tamagui";

const BottomSheetExample = ({
  setIsSheetOpen,
  isSheetOpen,
}) => {

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };
  return (
      <Sheet
        modal
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        dismissOnSnapToBottom
        zIndex={100_000}
        animation="medium"
        snapPointsMode="mixed"
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle width="$4" height={5} alignSelf="center" />

        <Sheet.Frame
          backgroundColor="$background"
          borderTopLeftRadius={20}
          borderTopRightRadius={20}
          justifyContent="flex-start"
          alignItems="center"
        >
          <YStack width="100%" alignItems="flex-start">
            <Heading margin="$4">Menu</Heading>
            <YGroup width="100%" backgroundColor="$background">
              <Separator flex={1} />
              <YGroup.Item>
                <ListItem
                  pressTheme
                  size="$5"
                  backgroundColor="$background"
                  onPress={() => {
                    router.push("/profile");
                    setIsSheetOpen(false);
                  }}
                >
                  <XStack alignItems="center" gap="$4">
                    <CircleUserRound />
                    <SizableText size="$5">View Profile</SizableText>
                  </XStack>
                </ListItem>
                <ListItem pressTheme size="$5" backgroundColor="$background">
                  <XStack alignItems="center" gap="$4" width="100%">
                    <Moon />
                    <SizableText size="$5">Dark Mode</SizableText>
                    <XStack flex={1} />
                    <Switch>
                      <Switch.Thumb animation="quick" />
                    </Switch>
                  </XStack>
                </ListItem>
                <Separator flex={1} />
                <ListItem
                  pressTheme
                  size="$5"
                  backgroundColor="$background"
                  onPress={() => router.replace("/login")}
                >
                  <XStack alignItems="center" gap="$4">
                    <LogOut color="$red9" />
                    <SizableText size="$5" color="$red9">
                      Logout
                    </SizableText>
                  </XStack>
                </ListItem>
              </YGroup.Item>
            </YGroup>
          </YStack>
        </Sheet.Frame>
      </Sheet>
  );
};

export default BottomSheetExample;
