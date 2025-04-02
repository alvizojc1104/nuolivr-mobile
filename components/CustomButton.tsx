import React from "react";
import { Button, ButtonProps, Spinner } from "tamagui";
import { theme } from "@/theme/theme";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
interface CustomButtonProps extends ButtonProps {
	loading?: boolean;
	onPress: () => void;
	buttonText?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
	loading = false,
	onPress,
	buttonText = "Continue",
	...props
}) => {
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
		<Animated.View style={[animatedStyle]}>
			<Button
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				disabled={loading}
				onPress={onPress}
				borderWidth={0}
				backgroundColor={theme.cyan10}
				color="white"
				pressStyle={{ backgroundColor: theme.cyan11 }}
				disabledStyle={{ opacity: 0.8 }}
				{...props}
			>
				{loading ? "Loading..." : buttonText}
			</Button>
		</Animated.View>
	);
};

export default CustomButton;
