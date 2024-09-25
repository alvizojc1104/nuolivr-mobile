import React, { useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Card,
  Heading,
  ListItem,
  Paragraph,
  ScrollView,
  SizableText,
  Square,
  Stack,
  XStack,
  YStack,
} from "tamagui";
import {
  BookA,
  ChevronRight,
  ClipboardList,
  Glasses,
  MessageSquare,
  Phone,
  ShoppingBag,
  View,
} from "@tamagui/lucide-icons";
import { StyleSheet, Image, Alert } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import Spinner from "react-native-loading-spinner-overlay";
import axios from "axios";

const Home = () => {
  const { signOut } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoaded || !isSignedIn) {
    setIsLoading(true);
  }

  useEffect(() => {
    const setRole = async () => {
      try {
        await axios.post("http://192.168.1.9:5001/api/role/setup", {
          user_id: user.id,
        });
      } catch (error) {
        Alert.alert("Error", "An error occured.")
      }
    };
    setRole();
  }, []);

  if (!user.fullName) {
    Alert.alert(
      "Account Setup",
      "Please finish setting up your account before using the app.",
      [
        { text: "Proceed", onPress: () => router.replace("/signup/name") },
        {
          text: "Cancel",
          onPress: () => {
            signOut();
            router.replace("");
          },
        },
      ]
    );
  }

  return (
    <Stack flex={1} alignContent="center">
      <Spinner visible={isLoading} />
      <Image
        source={require("../../../assets/images/welcomePage.png")}
        style={[styles.image, { zIndex: -5 }]}
        resizeMode="contain"
      />
      <ScrollView
        flex={1}
        contentContainerStyle={{ gap: "$3", paddingVertical: "$4" }}
      >
        <Card padded elevate marginHorizontal="$3">
          <XStack flex={1}>
            <YStack flex={1} justifyContent="space-around">
              <Paragraph size="$6" fontWeight={700}>
                NU Olivr
              </Paragraph>
              <Paragraph size="$2">
                Welcome to National University MOA's first Optometry App.{" "}
              </Paragraph>
              <Button
                size="$4"
                fontSize="$3"
                theme="active"
                maxWidth={300}
                minWidth={200}
              >
                Book Appointment Now
              </Button>
            </YStack>
            <Image
              source={require("../../../assets/images/eyeCheck.png")}
              resizeMode="contain"
              style={{
                height: 150,
                width: 150,
                bottom: -10,
                right: -15,
              }}
            />
          </XStack>
        </Card>
        <Card
          padding="$1"
          elevate
          marginBottom="$12"
          marginHorizontal="$3"
          paddingBottom="$1"
        >
          <SizableText
            marginLeft="$4"
            marginTop="$3"
            size="$6"
            fontWeight={700}
          >
            Services
          </SizableText>
          <Accordion
            width="100%"
            overflow="hidden"
            type="multiple"
            collapsible="true"
          >
            <Accordion.Item value="m1">
              <Accordion.Trigger borderWidth={0}>
                {({ open }) => (
                  <XStack alignItems="center" gap="$3">
                    <Square
                      padding="$2"
                      backgroundColor="$blue5"
                      borderRadius="$2"
                    >
                      <ClipboardList size="$2" color="$blue9" />
                    </Square>
                    <Heading size="$5" fontWeight={900}>
                      Appointment
                    </Heading>
                    <XStack flex={1} />
                    <Square animation="quick" rotate={open ? "90deg" : "0deg"}>
                      <ChevronRight size="$1" />
                    </Square>
                  </XStack>
                )}
              </Accordion.Trigger>
              <Accordion.Content
                backgroundColor="$blue4"
                borderTopWidth={1}
                borderTopColor="$gray8"
              >
                <Paragraph marginBottom="$2">
                  {"Schedule your eye check-up with our experts"}
                </Paragraph>
                <ListItem
                  borderRadius="$3"
                  pressTheme
                  size="$5"
                  icon={<BookA size="$1" />}
                >
                  Book Appointment
                </ListItem>
                <ListItem
                  marginTop="$2"
                  borderRadius="$3"
                  pressTheme
                  size="$5"
                  icon={<View size="$1" />}
                >
                  View Appointments
                </ListItem>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="m2">
              <Accordion.Trigger borderWidth={0}>
                {({ open }) => (
                  <XStack alignItems="center" gap="$3">
                    <Square
                      padding="$2"
                      backgroundColor="$green5"
                      borderRadius="$2"
                    >
                      <Phone size="$2" color="$green9" />
                    </Square>
                    <Heading size="$5" fontWeight={900}>
                      Consultation
                    </Heading>
                    <XStack flex={1} />
                    <Square animation="quick" rotate={open ? "90deg" : "0deg"}>
                      <ChevronRight size="$1" />
                    </Square>
                  </XStack>
                )}
              </Accordion.Trigger>
              <Accordion.Content
                backgroundColor="$blue4"
                borderTopWidth={1}
                borderTopColor="$gray8"
              >
                <Paragraph marginBottom="$2">
                  {"Get personalized advice from our eye care professionals."}
                </Paragraph>
                <ListItem
                  borderRadius="$3"
                  pressTheme
                  size="$5"
                  icon={<MessageSquare size="$1" />}
                >
                  Online Consultation
                </ListItem>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="m3">
              <Accordion.Trigger borderWidth={0}>
                {({ open }) => (
                  <XStack alignItems="center" gap="$3">
                    <Square
                      padding="$2"
                      backgroundColor="$red5"
                      borderRadius="$2"
                    >
                      <ShoppingBag size="$2" color="$red9" />
                    </Square>
                    <Heading size="$5" fontWeight={900}>
                      Shop
                    </Heading>
                    <XStack flex={1} />
                    <Square animation="quick" rotate={open ? "90deg" : "0deg"}>
                      <ChevronRight size="$1" />
                    </Square>
                  </XStack>
                )}
              </Accordion.Trigger>
              <Accordion.Content
                backgroundColor="$blue4"
                borderTopWidth={1}
                borderTopColor="$gray8"
              >
                <Paragraph marginBottom="$2">
                  {"Explore our selection of eyewear and accessories."}
                </Paragraph>
                <ListItem
                  borderRadius="$3"
                  pressTheme
                  size="$5"
                  icon={<Glasses size="$1" />}
                >
                  Browse Eyewear
                </ListItem>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Card>
      </ScrollView>
    </Stack>
  );
};
const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 260,
    position: "absolute",
    alignSelf: "center",
    bottom: -30,
  },
});

export default Home;
