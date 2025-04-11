import React, { useState } from "react";
import {
	Alert,
	FlatList,
	SafeAreaView,
	StyleSheet,
	TouchableNativeFeedback,
} from "react-native";
import { useAttendance } from "@/hooks/useAttendance";
import {
	Avatar,
	Button,
	Card,
	Circle,
	H4,
	Paragraph,
	SizableText,
	Spinner,
	View,
	XStack,
	YStack,
} from "tamagui";
import { ArrowLeft, Timer } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { Module } from "@/context/AttendanceContext";
import { theme } from "@/theme/theme";
import { useMutation } from "@tanstack/react-query";
import api from "@/utils/axios";
import { useUser } from "@clerk/clerk-expo";
import CustomButton from "@/components/CustomButton";
import LoadingModal from "@/components/LoadingModal";

interface TimeInProps {
	studentClinicianId: string;
	facultyId: string;
	moduleId: string;
	timeIn: Date;
	timeOut: Date;
}

export default function ModuleSelection() {
	const { user } = useUser();
	const { attendanceData } = useAttendance();
	const [showTimeInOrOut, setShowTimeInOrOut] = useState<string>("");

	const timeIn = useMutation({
		mutationKey: ["time-in"],
		mutationFn: async (data: Partial<TimeInProps>) => {
            
			const stageData = {
				studentClinicianId: data.studentClinicianId,
				moduleId: data.moduleId,
				facultyId: data.facultyId,
				timeIn: data.timeIn,
			};
			const response = await api.post("/attendance/time-in", stageData);
			return response.data;
		},
		onSuccess: (data) => {
			Alert.alert("Success", "Time in successful", [
				{
					text: "OK",
					onPress: () => {
						router.push("/student/attendance");
					},
				},
			]);
		},
		onError: (error) => {
			Alert.alert("Error", JSON.stringify(error));
		},
	});
	const timeOut = useMutation({
		mutationKey: ["time-out"],
		mutationFn: async (data: Partial<TimeInProps>) => {
			const stageData = {
				studentClinicianId: data.studentClinicianId,
				facultyId: attendanceData.facultyId,
				moduleId: data.moduleId,
				timeOut: data.timeOut,
			};
			const response = await api.post("/attendance/time-out", {
				...stageData,
			});
			return response.data;
		},
		onSuccess: (data) => {
			Alert.alert("Success", "Time out successful", [
				{
					text: "OK",
					onPress: () => {
						router.push("/student/attendance");
					},
				},
			]);
		},
		onError: (error) => {
			Alert.alert(
				"Error",
				"An unknown error occurred. Please try again later."
			);
			console.log(error, null, 2);
		},
	});
	const handleModuleSelect = (module: Module) => {
		setShowTimeInOrOut(module._id);
	};

	const handleTimeIn = async () => {
		try {
		} catch (error) {}
	};

	const handleTimeOut = async () => {};

	const goBack = () => {
		router.back();
	};

	if (Object(attendanceData).length === 0) {
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<View flex={1} padding="$4" backgroundColor="$background">
					<XStack marginBottom="$4" alignItems="center">
						<Button icon={ArrowLeft} onPress={goBack} circular />
						<H4 marginLeft="$4">Select Module</H4>
					</XStack>
					<YStack
						flex={1}
						justifyContent="center"
						alignItems="center"
					>
						<Paragraph>No modules available</Paragraph>
					</YStack>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View flex={1} padding="$4" backgroundColor="$background">
				<SizableText marginBottom="$4">
					Select a module to time in:
				</SizableText>
				{attendanceData.studentModules?.length === 0 ? (
					<YStack
						flex={1}
						justifyContent="center"
						alignItems="center"
					>
						<Paragraph>No modules available</Paragraph>
					</YStack>
				) : (
					<FlatList
						data={attendanceData.studentModules}
						keyExtractor={(item) => item._id}
						renderItem={({ item }) => (
							<TouchableNativeFeedback
								onPress={() => handleModuleSelect(item)}
							>
								<Card
									marginBottom="$2"
									borderWidth={0.3}
									borderColor={"$gray8"}
									backgroundColor={"white"}
								>
									<XStack
										alignItems="center"
										gap="$4"
										justifyContent="flex-start"
										padding="$4"
									>
										{item.imageUrl ? (
											<Avatar circular size="$8">
												<Avatar.Image
													src={item.imageUrl}
												/>
											</Avatar>
										) : (
											<View
												padding="$2"
												width={"$6"}
												height={"$6"}
												alignItems="center"
												justifyContent="center"
												borderRadius={999}
												backgroundColor={theme.cyan3}
											>
												<SizableText
													color={theme.cyan10}
												>
													{item.acronym}
												</SizableText>
											</View>
										)}
										<YStack>
											<SizableText
												size={"$6"}
												fontWeight={"bold"}
											>
												{item.name}
											</SizableText>
											<SizableText
												size={"$1"}
												color={"$gray10"}
											>
												Time In:{" "}
												{item.timeIn
													? new Date(
															item.timeIn
													  ).toLocaleTimeString()
													: "Not yet"}
											</SizableText>
											<SizableText
												size={"$1"}
												color={"$gray10"}
											>
												Time Out:{" "}
												{item.timeOut
													? new Date(
															item.timeOut
													  ).toLocaleTimeString()
													: "Not yet"}
											</SizableText>
										</YStack>
									</XStack>
									{showTimeInOrOut === item._id ? (
										<CustomButton
											buttonText="Time In"
											onPress={() =>
												timeIn.mutateAsync({
													studentClinicianId: user
														?.publicMetadata
														._id as string,
													moduleId: item._id,
													timeIn: new Date(),
													facultyId: item.createdBy,
												})
											}
											marginHorizontal="$4"
											marginBottom="$4"
											icon={
												<Timer
													color="white"
													size={20}
												/>
											}
										/>
									) : null}
								</Card>
							</TouchableNativeFeedback>
						)}
						contentContainerStyle={styles.listContainer}
					/>
				)}
			</View>
			<LoadingModal
				isVisible={timeIn.isPending}
				text="Loading time-in..."
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	listContainer: {
		paddingBottom: 16,
	},
});
