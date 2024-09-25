import React from "react";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { Heading } from "tamagui";

const _layout = () => {
  const colorScheme = useColorScheme();
  const sceneBackgroundColor =
    colorScheme === "dark"
      ? "hsl(212, 35.0%, 9.2%)" // Dark mode background color
      : "'hsla(0, 0%, 100%, 0)'"; // Light mode background color

  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        contentStyle: { backgroundColor: sceneBackgroundColor, },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerTitle: () => <Heading>Patient's Detail</Heading>, headerTitleAlign: 'center' }}
      />
      <Stack.Screen name="schedule" options={{ headerTitle: () => <Heading>Select Schedule</Heading>, headerTitleAlign: 'center' }}/>
      <Stack.Screen name="review"  options={{ headerTitle: () => <Heading>Book Appointment</Heading>, headerTitleAlign: 'center' }} />
    </Stack>
  );
};

export default _layout;
