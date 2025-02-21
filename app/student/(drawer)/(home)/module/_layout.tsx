import React from "react";
import { Stack } from "expo-router";
import { theme } from "@/theme/theme";
import { SizableText, View, XStack, YStack } from "tamagui";

const Layout = () => {
	return (
		<Stack
			screenOptions={{
				statusBarTranslucent: true,
				headerShown: true,
				statusBarColor: theme.cyan10,
				headerStyle: { backgroundColor: theme.cyan10 },
				headerTintColor: "white",
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					headerTitle: () => (
						<SizableText color={"white"}>My Modules</SizableText>
					),
					headerTitleAlign: "center",
				}}
			/>
			<Stack.Screen
				name="[moduleId]"
				options={({ route }) => ({
					title: route?.params?.moduleName || "Module",
					headerTintColor: "white",
					headerTitle: () => (
						<XStack alignItems="center" gap="$3" flex={1}>
							<View
								backgroundColor={theme.cyan5}
								padding="$2"
								borderRadius={"$1"}
								justifyContent="center"
								alignItems="center"
							>
								<SizableText color={theme.cyan10}>
									{route?.params?.iconText}
								</SizableText>
							</View>
							<YStack justifyContent="space-around">
								<SizableText color={"white"}>
									{route?.params?.moduleName || "Module"}
								</SizableText>
								<SizableText
									marginTop={-3}
									color={"white"}
									fontSize={"$2"}
								>
									Submissions
								</SizableText>
							</YStack>
						</XStack>
					),
				})}
			/>
			<Stack.Screen
				name="select-record"
				options={{
					headerTitle: () => (
						<SizableText color={"white"}>
							Submit new record
						</SizableText>
					),
				}}
			/>
			<Stack.Screen
				name="view-submission"
				options={({ route }) => ({
					headerTitle: () => (
						<SizableText color={"white"}>
							Submission Details
						</SizableText>
					),
				})}
			/>
		</Stack>
	);
};

export default Layout;
