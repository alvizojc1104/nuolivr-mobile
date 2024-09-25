import React, { useState } from "react";
import {
  AlertDialog,
  Avatar,
  Button,
  Heading,
  Sheet,
  SizableText,
  XStack,
  YStack,
  Separator,
  ListItem,
  Switch,
} from "tamagui";
import { Bell, CircleUserRound, Moon, LogOut } from "@tamagui/lucide-icons";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Spinner from "react-native-loading-spinner-overlay";
import { router } from "expo-router";

const Header = () => {
  const { user } = useUser();
  const {signOut} = useAuth()
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const logOut = () => {
    setIsLoading(true);
    try {
      signOut();
      router.replace("");
      setIsOpen(false);
      setIsSheetOpen(false);
    } catch (error) {
      return;
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <React.Fragment>
      <Spinner visible={isLoading} />
      <XStack
        width="100%"
        height="100%"
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="$blue8"
      >
        <XStack alignItems="center" gap="$4" justifyContent="center">
          <Button circular size="$4" onPress={() => setIsSheetOpen(true)}>
            <Avatar circular size="$4">
              <Avatar.Image
                src={
                  user.imageUrl ||
                  "https://images.unsplash.com/photo-1531384441138-2736e62e0919?&w=100&h=100&dpr=2&q=80"
                }
              />
            </Avatar>
          </Button>
          <YStack>
            <SizableText size="$3" fontWeight={200} marginBottom={-5}>
              Hello
            </SizableText>
            <SizableText size="$5" fontWeight={700} ellipse>
              {user.firstName ? `${user.firstName}` : "Loading..."}
            </SizableText>
          </YStack>
        </XStack>
        <XStack flex={1} />
        <Button circular backgroundColor="$blue7" size="$4">
          <Bell size="$1" />
        </Button>
      </XStack>
      <Sheet
        modal
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        dismissOnSnapToBottom
        zIndex={100_000}
        animation="quicker"
        snapPointsMode="mixed"
      >
        <Sheet.Overlay
          animation="quick"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Sheet.Handle width="$4" height={5} alignSelf="center" />
        <Sheet.Frame
          borderTopLeftRadius={20}
          borderTopRightRadius={20}
          justifyContent="flex-start"
          alignItems="center"
        >
          <YStack width="100%" alignItems="flex-start">
            <Heading margin="$4">Menu</Heading>
            <Separator flex={1} />
            <ListItem
              pressTheme
              size="$5"
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
            <ListItem pressTheme size="$5">
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
            <ListItem pressTheme size="$5" onPress={() => setIsOpen(true)}>
              <XStack alignItems="center" gap="$4">
                <LogOut color="$red9" />
                <SizableText size="$5" color="$red9">
                  Logout
                </SizableText>
              </XStack>
            </ListItem>
          </YStack>
        </Sheet.Frame>
      </Sheet>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            key="overlay"
            animation="quickest"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <AlertDialog.Content
            elevate
            key="content"
            animation={[
              "quickest",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            x={0}
            scale={1}
            opacity={1}
            y={0}
            width="90%"
          >
            <YStack gap="$3">
              <AlertDialog.Title size="$7">Log Out</AlertDialog.Title>
              <AlertDialog.Description>
                Are you sure you want to log out?
              </AlertDialog.Description>

              <XStack gap="$3" justifyContent="flex-end">
                <AlertDialog.Cancel asChild>
                  <Button chromeless>Cancel</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button theme="red_active" onPress={logOut}>
                    Confirm
                  </Button>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </React.Fragment>
  );
};

export default Header;
