import { View, Text } from "react-native";
import React from "react";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { Button, ButtonProps } from "tamagui";

interface DestructiveButtonProps extends ButtonProps {
	icon: React.FC;
	onPress: () => void;
	text: string;
}
const DestructiveButton = ({
	icon,
	onPress,
	text,
	...props
}: DestructiveButtonProps) => {
	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	const handlePressIn = () => {
		scale.value = withSpring(0.95, { stiffness: 500 });
	};

	const handlePressOut = () => {
		scale.value = withSpring(1, { stiffness: 500 }); // Smooth bounce out
	};
	return (
		<Animated.View style={animatedStyle}>
			<Button
				{...props}
				width="100%"
				alignSelf="center"
				backgroundColor="$red10"
				color="white"
				icon={icon}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				onPress={onPress}
				pressStyle={{ backgroundColor: "$red10" }}
				borderWidth={0}
				disabled={props.disabled}
			>
				{text}
			</Button>
		</Animated.View>
	);
};

export default DestructiveButton;
