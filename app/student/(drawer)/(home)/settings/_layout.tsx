import { theme } from "@/theme/theme";
import { Stack } from "expo-router";
import React from "react";
import { Heading, SizableText } from "tamagui";

const Layout = () => {
	return (
		<Stack
			screenOptions={{
				headerStyle: { backgroundColor: theme.cyan10 },
				contentStyle: { backgroundColor: "white" },
				headerTintColor: "white",
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					headerTitle: () => (
						<Heading color={"white"} fontSize={"$7"}>
							Settings
						</Heading>
					),
					statusBarTranslucent: true,
					statusBarStyle: "light",
				}}
			/>
			<Stack.Screen
				name="delete-account"
				options={{
					headerTitle: () => (
						<Heading color={"white"} fontSize={"$7"}>
							Delete Account
						</Heading>
					),
					statusBarTranslucent: true,
					statusBarStyle: "light",
				}}
			/>
			<Stack.Screen
				name="change-password"
				options={{
					headerTitle: () => (
						<Heading color={"white"} fontSize={"$7"}>
							Change Password
						</Heading>
					),
					statusBarTranslucent: true,
					statusBarStyle: "light",
				}}
			/>
		</Stack>
	);
};

export default Layout;
