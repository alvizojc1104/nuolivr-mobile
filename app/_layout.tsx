import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { Slot, useRouter, useSegments } from "expo-router";
import { TamaguiProvider } from "tamagui";
import { tamaguiConfig } from "../tamagui.config";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { NotificationProvider } from "@/context/NotificationContext";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
	  shouldShowAlert: true,
	  shouldPlaySound: true,
	  shouldSetBadge: true,
	}),
    });
    
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const InitialLayout = () => {
	const { isLoaded, isSignedIn } = useAuth();
	const { user } = useUser();
	const segments = useSegments();
	const router = useRouter();
	const inStudentGroup = segments[0] === "student";

	useEffect(() => {
		if (!isLoaded) return;
		if (isSignedIn) {
			const role = user?.publicMetadata?.role as string[];
			if (role.includes("student-clinician") && !inStudentGroup) {
				router.replace("/student/(home)");
			}
		}
		router.replace("/login");
	}, [isLoaded, user]);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<TamaguiProvider config={tamaguiConfig}>
				<Slot />
			</TamaguiProvider>
		</GestureHandlerRootView>
	);
};

const tokenCache = {
	async getToken(key: string) {
		try {
			return SecureStore.getItemAsync(key);
		} catch (err) {
			return null;
		}
	},
	async saveToken(key: string, value: string) {
		try {
			return SecureStore.setItemAsync(key, value);
		} catch (err) {
			return;
		}
	},
};

const RootLayout = () => {
	const [loaded] = useFonts({
		Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
		InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	const queryClient = new QueryClient();

	if (!loaded) {
		return null;
	}

	return (
		<NotificationProvider>
			<ClerkProvider
				publishableKey={CLERK_PUBLISHABLE_KEY!}
				tokenCache={tokenCache}
			>
				<QueryClientProvider client={queryClient}>
					<InitialLayout />
				</QueryClientProvider>
			</ClerkProvider>
		</NotificationProvider>
	);
};

export default RootLayout;
