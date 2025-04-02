import { theme } from "@/theme/theme";
import { TouchableNativeFeedback } from "react-native";
import { SizableText, View, XStack, XStackProps, YStack } from "tamagui";

interface RippleListItemProps extends XStackProps {
	title: string;
	description: string;
	icon: any;
	fn: () => void;
}

interface IconWrapperProps {
	icon: React.ReactNode;
	backgroundColor: string;
}

export const RippleListItem = ({
	title,
	description,
	icon,
	fn,
	...props
}: RippleListItemProps) => {
	return (
		<TouchableNativeFeedback onPress={fn}>
			<XStack
				alignItems="center"
				paddingHorizontal="$4"
				gap="$3"
				paddingVertical="$2"
				{...props}
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

export const IconWrapper = ({ icon, backgroundColor }: IconWrapperProps) => {
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
