import React from "react";
import { Tabs } from "expo-router";
import { Paragraph, SizableText, XStack } from "tamagui";
import { ChevronRight, Home, Menu, NotebookText } from "@tamagui/lucide-icons";
import { useColorScheme, View } from "react-native";
import { TouchableOpacity } from "react-native";
import Header from "../../../components/CustomHeader";

const _layout = () => {
  const colorScheme = useColorScheme();

  const sceneBackgroundColor =
    colorScheme === "dark"
      ? "hsl(212, 35.0%, 9.2%)" // Dark mode background color
      : "hsla(0, 0%, 100%, 0)"; // Light mode background color

  const tabBarBackgroundColor =
    colorScheme === "dark"
      ? "hsl(212, 26.0%, 20.0%)" // Dark mode tab bar background color
      : "hsl(210, 98.8%, 94.0%)"; // Light mode tab bar background color

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 55,
        },
        tabBarActiveBackgroundColor: tabBarBackgroundColor,
        headerStyle: {
          backgroundColor:
            colorScheme === "dark"
              ? "hsl(211, 89.7%, 34.1%)"
              : "hsl(206, 81.9%, 65.3%)",
        },
      }}
      sceneContainerStyle={{
        backgroundColor: sceneBackgroundColor,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: () => <Header />,
          title: ({ color }) => (
            <Paragraph color={color} fontWeight={300} size="$1">
              Home
            </Paragraph>
          ),
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          headerTitle: () => (
            <XStack
              width="100%"
              height="100%"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <SizableText size="$5" fontWeight={700}>
                My Appointments
              </SizableText>
              <XStack flex={1} />
              <TouchableOpacity style={{ flexDirection: "row", alignItems:'center' }}>
                <SizableText size="$3">View History</SizableText>
                <ChevronRight size="$1"/>
              </TouchableOpacity>
            </XStack>
          ),
          tabBarIcon: ({ color, size }) => (
            <NotebookText color={color} size={size} />
          ),
          title: ({ color }) => (
            <Paragraph color={color} fontWeight={300} size="$1">
              Appointments
            </Paragraph>
          ),
          headerTitleAlign: "center",
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          headerTitle: () => (
            <SizableText size="$6" fontWeight={700}>
              More
            </SizableText>
          ),
          tabBarIcon: ({ color, size }) => <Menu color={color} size={size} />,
          title: ({ color }) => (
            <Paragraph color={color} fontWeight={300} size="$1">
              More
            </Paragraph>
          ),
          headerTitleAlign: "center",
        }}
      />
    </Tabs>
  );
};

export default _layout;
