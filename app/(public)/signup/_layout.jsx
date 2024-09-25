import React from "react";
import { Stack } from "expo-router";
import { Heading } from "tamagui";
import { useColorScheme } from "react-native";

const _layout = () => {
  const colorScheme = useColorScheme();
  const sceneBackgroundColor =
    colorScheme === "dark"
      ? "hsl(212, 35.0%, 9.2%)" // Dark mode background color
      : "hsla(0, 0%, 100%, 0)"; // Light mode background color

  return (
    <Stack
      initialRouteName="account"
      screenOptions={{
        contentStyle: { backgroundColor: sceneBackgroundColor },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="name"
        options={{
          headerTitle: () => <Heading>Sign Up</Heading>,
          headerBackVisible: false
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          headerTitle: () => <Heading>Create Account</Heading>,
        }}
      />
      <Stack.Screen
        name="verify"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default _layout;
