import AsyncStorage from "@react-native-async-storage/async-storage";
import { Lock, LogOut, Moon, UserX } from "@tamagui/lucide-icons";
import { useState } from "react";
import {
	Alert,
	Appearance,
	Platform,
	TouchableNativeFeedback,
	useColorScheme,
} from "react-native";
import {
	ScrollView,
	SizableText,
	View,
	Heading,
	XStack,
	YStack,
} from "tamagui";
import LoadingModal from "@/components/LoadingModal";
import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { theme } from "@/theme/theme";

interface RippleListItemProps {
	title: string;
	description: string;
	icon: any;
	fn: () => void;
}

interface IconWrapperProps {
	icon: React.ReactNode;
	backgroundColor: string;
}

const Settings = () => {
	const { isLoaded } = useAuth();
	const colorScheme = useColorScheme();
	const [scheme, setScheme] = useState<any>(colorScheme);
	const [isLoading, _] = useState(false);

	if (!isLoaded) {
		return;
	}

	const toggleTheme = async () => {
		const newScheme = scheme === "dark" ? "light" : "dark";
		setScheme(newScheme);
		await AsyncStorage.setItem("colorScheme", JSON.stringify(newScheme)); //* Save the new scheme
		if (Platform.OS !== "web") Appearance.setColorScheme(newScheme);
	};

	return (
		<>
			<LoadingModal isVisible={isLoading} text="Logging out..." />
			<ScrollView flex={1}>
				<Heading marginHorizontal="$4" marginTop="$3">
					Account
				</Heading>
				<RippleListItem
					title="Change Password"
					description="Update your password."
					icon={
						<IconWrapper
							key={"lock"}
							backgroundColor={theme.cyan3}
							icon={<Lock size={20} color={theme.cyan10} />}
						/>
					}
					fn={() => router.push("/student/settings/change-password")}
				/>
				<RippleListItem
					title="Delete Account"
					description="Delete your account."
					icon={
						<IconWrapper
							key={"lock"}
							backgroundColor={theme.cyan3}
							icon={<UserX size={20} color={theme.cyan10} />}
						/>
					}
					fn={() => router.push("/student/settings/delete-account")}
				/>
			</ScrollView>
		</>
	);
};

const RippleListItem = ({
	title,
	description,
	icon,
	fn,
}: RippleListItemProps) => {
	return (
		<TouchableNativeFeedback onPress={fn}>
			<XStack
				alignItems="center"
				paddingHorizontal="$4"
				gap="$3"
				paddingVertical="$2"
			>
				<View
					backgroundColor={theme.cyan3}
					borderRadius="$4"
					height={"$4"}
					width={"$4"}
					alignItems="center"
					justifyContent="center"
				>
					{icon}
				</View>
				<YStack
					flex={1}
					justifyContent="center"
					alignItems="flex-start"
				>
					<SizableText fontSize="$4">{title}</SizableText>
					<SizableText fontSize="$2" color="$gray10">
						{description}
					</SizableText>
				</YStack>
			</XStack>
		</TouchableNativeFeedback>
	);
};

const IconWrapper = ({ icon, backgroundColor }: IconWrapperProps) => {
	return (
		<View
			backgroundColor={backgroundColor || theme.cyan3}
			borderRadius="$4"
			height={"$4"}
			width={"$4"}
			alignItems="center"
			justifyContent="center"
		>
			{icon}
		</View>
	);
};

export default Settings;
