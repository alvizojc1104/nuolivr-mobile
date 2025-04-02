import { theme } from "@/theme/theme";
import { Settings } from "@tamagui/lucide-icons";
import { router, Stack } from "expo-router";
import { Heading } from "tamagui";

const _layout = () => {
	const goToSettings = () => {
		router.push("/student/settings");
	};

	return (
		<Stack
			screenOptions={{
				headerTintColor: "white",
				headerStyle: { backgroundColor: theme.cyan10 },
				contentStyle: { backgroundColor: "white" },
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					headerShown: false,
					title: "Home",
					statusBarTranslucent: true,
					statusBarStyle: "dark",
				}}
			/>
			<Stack.Screen
				name="account"
				options={{
					headerTitle: () => (
						<Heading fontSize={"$7"} color={"white"}>My Account</Heading>
					),
					headerRight: () => (
						<Settings color={"white"} onPress={goToSettings} />
					),
					headerShadowVisible: false,
					statusBarTranslucent: true,
					statusBarStyle: "light",
				}}
			/>
			<Stack.Screen
				name="notifications"
				options={{
					headerTitle: () => (
						<Heading fontSize={"$7"} color={"white"}>Notifications</Heading>
					),
					headerShadowVisible: false,
					statusBarTranslucent: true,
					statusBarStyle: "light",
				}}
			/>
			<Stack.Screen name="(pcr)" options={{ headerShown: false }} />
			<Stack.Screen
				name="preliminary-examination"
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="patients"
				options={{
					headerTitle: () => (
						<Heading fontSize={"$7"} color={"white"}>My Patients</Heading>
					),
					statusBarTranslucent: true,
					statusBarStyle: "light",
				}}
			/>
			<Stack.Screen
				name="module"
				options={{
					headerShown: false,
					statusBarTranslucent: true,
					statusBarStyle: "light",
				}}
			/>
			<Stack.Screen
				name="settings"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="search-patient"
				options={{
					headerShown: false,
					presentation: "modal",
					statusBarTranslucent: true,
					statusBarStyle: "light",
				}}
			/>
			<Stack.Screen
				name="patient"
				options={{
					headerShown: false,
					statusBarTranslucent: true,
					statusBarStyle: "light",
				}}
			/>
		</Stack>
	);
};

export default _layout;
