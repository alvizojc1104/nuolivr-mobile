import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Heading, SizableText } from "tamagui";
import { theme } from "@/theme/theme";

const _layout = () => {
	return (
		<Stack
			screenOptions={{
				headerStyle: { backgroundColor: theme.cyan10 },
				statusBarStyle: "light",
				headerTintColor: "white",
				statusBarAnimation: "fade",
				statusBarTranslucent: true,
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					headerTitle: () => (
						<Heading size={"$7"} color={"white"}>
							Attendance
						</Heading>
					),
				}}
			/>
			<Stack.Screen
				name="module-selection"
				options={{
					headerTitle: () => (
						<Heading size={"$7"} color={"white"}>
							Select Module
						</Heading>
					),
				}}
			/>

			<Stack.Screen
				name="scanner"
				options={{
					headerShown: false,
					statusBarAnimation:"fade"
				}}
			/>
		</Stack>
	);
};

export default _layout;
