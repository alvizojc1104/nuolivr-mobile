import { useAuth, useUser } from "@clerk/clerk-expo";
import {
	DrawerContentScrollView,
	DrawerItem,
	DrawerItemList,
} from "@react-navigation/drawer";
import { LogOut, Settings, TimerOff, User } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { Alert, TouchableOpacity } from "react-native";
import {
	Avatar,
	Heading,
	SizableText,
	Switch,
	View,
	XStack,
	YStack,
} from "tamagui";
import { theme } from "@/theme/theme";

export default function CustomDrawerComponent(props: any) {
	const { user } = useUser();
	const { signOut } = useAuth();

	const onLogout = () => {
		Alert.alert("Logout", "Are you sure you want to log out?", [
			{ text: "No", style: "cancel" },
			{ text: "Yes", onPress: handleSignOut },
		]);
	};

	const handleSignOut = async () => {
		try {
			await signOut().then(() => {
				router.replace("/login");
			});
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	const openScanner = () => {
		router.push("/student/attendance/scanner");
	};

	const viewProfile = () => {
		router.push("/student/account");
	};

	return (
		<View flex={1}>
			<YStack
				height="30%"
				justifyContent="flex-end"
				alignItems="flex-start"
				padding="$3"
				backgroundColor={theme.cyan10}
			>
				<Avatar elevate circular size="$10">
					<Avatar.Image src={user?.imageUrl} />
				</Avatar>
				<TouchableOpacity onPress={viewProfile}>
					<Heading color="white">{user?.fullName}</Heading>
				</TouchableOpacity>
				<SizableText
					size="$3"
					color="$white1"
					textTransform="capitalize"
				>
					College of Optometry
				</SizableText>
				<SizableText size="$2" color="$gray7">
					{user?.primaryEmailAddress?.emailAddress}
				</SizableText>
			</YStack>
			<DrawerContentScrollView {...props} style={{ flex: 1 }}>
				<DrawerItemList {...props} />
				<DrawerItem
					label={() => <SizableText>Account</SizableText>}
					onPress={viewProfile}
					icon={({ color }) => <User color={color} />}
				/>
				<DrawerItem
					label={() => <SizableText>Time Out</SizableText>}
					onPress={openScanner}
					icon={({ color }) => <TimerOff color={color} />}
				/>
				<DrawerItem
					label={() => <SizableText>Settings</SizableText>}
					onPress={() => router.push("/student/settings")}
					icon={({ color }) => <Settings color={color} />}
				/>
				<DrawerItem
					label={() => <SizableText>Logout</SizableText>}
					onPress={onLogout}
					icon={() => <LogOut color="red" />}
				/>
			</DrawerContentScrollView>
		</View>
	);
}
