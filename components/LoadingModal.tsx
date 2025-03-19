import React, { Dispatch, SetStateAction } from "react";
import {
	Modal,
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	ActivityIndicator,
	Text,
} from "react-native";
import { theme } from "@/theme/theme";

const LoadingModal = ({
	isVisible,
	setIsVisible,
	text,
}: {
	isVisible: boolean;
	setIsVisible?: Dispatch<SetStateAction<boolean>>;
	text?: string;
}) => {
	return (
		<Modal animationType="fade" transparent={true} visible={isVisible}>
			<TouchableWithoutFeedback
				onPress={() => setIsVisible && setIsVisible(false)}
			>
				<View style={styles.overlay}>
					<TouchableWithoutFeedback>
						<View style={styles.modalContainer}>
							<ActivityIndicator
								size={"large"}
								color={theme.cyan10}
							/>
							<Text>{text ? text : "Loading..."}.</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
		justifyContent: "center",
		alignItems: "center",
	},
	modalContainer: {
		display: "flex",
		flexDirection: "row",
		gap: 18,
		width: "85%",
		padding: 20,
		backgroundColor: "white",
		borderRadius: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		alignItems: "center",
	},
});

export default LoadingModal;
