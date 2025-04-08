import { theme } from "@/theme/theme";
import { ActivityIndicator } from "react-native";
import { YStack } from "tamagui";

const StartPage = () => {
	return (
		<YStack flex={1} justifyContent="center" alignItems="center">
			<ActivityIndicator size="large" color={theme.cyan10}/>
		</YStack>
	);
};

export default StartPage;
