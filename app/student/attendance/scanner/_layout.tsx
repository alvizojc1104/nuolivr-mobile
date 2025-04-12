import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Heading, SizableText } from "tamagui";
import { theme } from "@/theme/theme";

const _layout = () => {
      return (
            <Stack
                  screenOptions={{
                        headerShown: false
                  }}
            >
                  <Stack.Screen
                        name="index"
                        options={{
                              headerShown: false
                        }}
                  />
            </Stack>
      );
};

export default _layout;
