import { Camera, CameraView } from "expo-camera";
import { router, Stack } from "expo-router";
import {
	ActivityIndicator,
	AppState,
	Platform,
	SafeAreaView,
	StatusBar,
	StyleSheet,
} from "react-native";
import { Overlay } from "./Overlay";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { SizableText, View } from "tamagui";
import { theme } from "@/theme/theme";
import { useAttendance } from "@/hooks/useAttendance";
import { QRCodeData } from "@/context/AttendanceContext";
import { useMutation } from "@tanstack/react-query";
import api from "@/utils/axios";
import { Alert } from "react-native";
import LoadingModal from "@/components/LoadingModal";
import { isAxiosError } from "axios";

export default function Home() {
	const qrLock = useRef(false);
	const appState = useRef(AppState.currentState);
	const { isLoaded, user } = useUser();
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const { setAttendanceData } = useAttendance();
	const fetchQrCodeData = useMutation({
		mutationKey: ["qr-code"],
		mutationFn: async (data: QRCodeData) => {
			const response = await api.post("/qr-code/scan", {
				...data,
				studentId: user?.publicMetadata._id,
			});
			return response.data;
		},
		onSuccess: (data) => {
			setAttendanceData(data);
			router.push("/student/attendance/module-selection");
		},
		onError: (error) => {
			if (isAxiosError(error)) {
				console.log(JSON.stringify(error));
				Alert.alert("Notice", error.response?.data.message, [
					{
						text: "OK",
						onPress: () => {
							qrLock.current = false;
							router.back();
						},
					},
				]);
			}
		},
	});

	useEffect(() => {
		// Request camera permissions
		const requestPermissions = async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === "granted");
		};

		requestPermissions();
	}, []);

	useEffect(() => {
		const subscription = AppState.addEventListener(
			"change",
			(nextAppState) => {
				if (
					appState.current.match(/inactive|background/) &&
					nextAppState === "active"
				) {
					qrLock.current = false;
				}
				appState.current = nextAppState;
			}
		);

		return () => {
			subscription.remove();
		};
	}, []);

	if (!isLoaded || hasPermission === null) {
		return (
			<View flex={1} alignItems="center" justifyContent="center">
				<ActivityIndicator size={"large"} color={theme.cyan10} />
			</View>
		);
	}

	if (hasPermission === false) {
		return (
			<View flex={1} alignItems="center" justifyContent="center">
				<SizableText color={"$red10"}>No access to camera</SizableText>
			</View>
		);
	}

	const onQrCodeScan = (data: QRCodeData) => {
		fetchQrCodeData.mutate(data);
	};

	return (
		<SafeAreaView style={StyleSheet.absoluteFillObject}>
			<Stack.Screen
				options={{
					title: "Scan QR Code",
					headerShown: false,
				}}
			/>
			{Platform.OS === "android" ? <StatusBar hidden /> : null}
			<CameraView
				style={StyleSheet.absoluteFillObject}
				facing="back"
				onBarcodeScanned={async ({ data }: any) => {
					if (data && !qrLock.current) {
						qrLock.current = true;
						setTimeout(() => {
							try {
								const parsedData = JSON.parse(data);
								onQrCodeScan(parsedData);
							} catch (error) {
								Alert.alert(
									"Invalid QR Code",
									"The scanned QR code is not in the correct format. Please try again with a valid attendance QR code.",
									[
										{
											text: "OK",
											onPress: () => {
												qrLock.current = false;
											},
										},
									]
								);
							}
						}, 200);
					}
				}}
			/>
			<Overlay />
			<LoadingModal isVisible={fetchQrCodeData.isPending} />
		</SafeAreaView>
	);
}
