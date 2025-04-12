import LoadingModal from "@/components/LoadingModal";
import { useAttendance } from "@/hooks/useAttendance";
import { theme } from "@/theme/theme";
import api from "@/utils/axios";
import { useUser } from "@clerk/clerk-expo";
import { CheckCheck, QrCode } from "@tamagui/lucide-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	TouchableNativeFeedback,
	TouchableOpacity,
} from "react-native";
import { Card, SizableText, View, XStack } from "tamagui";

interface RecentTimeInsResponse {
	_id: string;
	studentClinicianId: string;
	facultyId: string;
	moduleId: Module;
	timeIn: string;
	timeOut: any;
	breakIn: Date;
	breakOut: Date;
	duration: number;
	status: string;
	remarks: string;
}
interface Module {
	_id: string;
	name: string;
	acronym: string;
	imageUrl: any;
	createdBy: string;
	updatedAt: string;
}

const Index = () => {
	const { attendanceData, setAttendanceData } = useAttendance();
	const { user } = useUser();
	const [showAttendanceOptions, setShowAttendanceOptions] = useState<string>("");

	const recentTimeIns = useQuery({
		queryKey: ["recentTimeIns"],
		queryFn: async () => {
			const response = await api.get("/attendance/recent/time-in", {
				params: {
					studentId: user?.publicMetadata._id,
				},
			});
			return response.data.activeTimeIns as RecentTimeInsResponse[];
		},
		enabled: !!user?.publicMetadata._id,
	});

	console.log(user?.publicMetadata._id)

	const timeOutMutation = useMutation({
		mutationFn: async (attendanceId: string) => {
			const response = await api.put(`/attendance/time-out`, {
				attendanceId: attendanceId,
			});
			return response.data;
		},
		onSuccess: () => {
			Alert.alert("Success", "Time out successful");
			recentTimeIns.refetch();
		},
		onError: (error: any) => {
			if (isAxiosError(error)) {
				Alert.alert(
					"Time Out Failed",
					error.response?.data.message,
					[
						{
							text: "OK",
						},
					],
					{ cancelable: true }
				);
			}
		},
	});

	const breakInMutation = useMutation({
		mutationFn: async (attendanceId: string) => {
			const response = await api.post(`/attendance/break-in`, {
				attendanceId: attendanceId,
			});
			return response.data;
		},
		onSuccess: () => {
			Alert.alert("Success", "Break in successful");
			recentTimeIns.refetch();
		},
		onError: (error: any) => {
			if (isAxiosError(error)) {
				Alert.alert(
					"Break In Failed",
					error.response?.data.message,
					[
						{
							text: "OK",
						},
					],
					{ cancelable: true }
				);
			}
		},
	});

	const breakOutMutation = useMutation({
		mutationFn: async (attendanceId: string) => {
			const response = await api.put(`/attendance/break-out`, {
				attendanceId: attendanceId,
			});
			return response.data;
		},
		onSuccess: () => {
			Alert.alert("Success", "Break out successful");
			recentTimeIns.refetch();
		},
		onError: (error: any) => {
			if (isAxiosError(error)) {
				Alert.alert(
					"Break Out Failed",
					error.response?.data.message,
					[
						{
							text: "OK",
						},
					],
					{ cancelable: true }
				);
			}
		},
	});

	useEffect(() => {
		recentTimeIns.refetch()
		return () => {
			setAttendanceData({});
		};
	}, []);

	const handleTimeIn = () => {
		if (Object.keys(attendanceData).length > 0) {
			router.push("/student/attendance/module-selection");
		} else {
			router.push("/student/attendance/scanner");
		}
	};

	const handleTimeOut = (attendanceId: string, moduleName: string) => {
		Alert.alert(
			"Time Out",
			`Are you sure you want to time out from ${moduleName}?`,
			[
				{
					text: "Cancel",
					onPress: () => {
						setShowAttendanceOptions("");
					},
					style: "cancel",
				},
				{
					text: "OK",
					onPress: () => {
						timeOutMutation.mutate(attendanceId);
					},
				},
			],
			{ cancelable: true }
		);
	};

	const handleShowAttendanceOptions = (attendanceId: string) => {
		setShowAttendanceOptions(attendanceId);
	}

	const handleBreakIn = (attendanceId: string, moduleName: string) => {
		Alert.alert(
			"Break In",
			`Are you sure you want to break in for ${moduleName}?`,
			[
				{
					text: "Cancel",
					onPress: () => {
						setShowAttendanceOptions("");
					},
					style: "cancel",
				},
				{
					text: "OK",
					onPress: () => {
						breakInMutation.mutate(attendanceId);
					},
				},
			],
			{ cancelable: true }
		);
	};

	const handleBreakOut = (attendanceId: string, moduleName: string) => {
		Alert.alert(
			"Break Out",
			`Are you sure you want to break out from ${moduleName}?`,
			[
				{
					text: "Cancel",
					onPress: () => {
						setShowAttendanceOptions("");
					},
					style: "cancel",
				},
				{
					text: "OK",
					onPress: () => {
						breakOutMutation.mutate(attendanceId);
					},
				},
			],
			{ cancelable: true }
		);
	};

	return (
		<View padding="$4" flex={1} backgroundColor="$background">
			<SizableText>View and manage your attendance records.</SizableText>
			<View gridColumn={2} gap="$4" marginTop="$4">
				<Card
					backgroundColor={"white"}
					borderWidth={0.3}
					borderColor={"$gray8"}
					borderRadius="$4"
				>
					<TouchableNativeFeedback onPress={handleTimeIn}>
						<Card.Header
							flexDirection="row"
							alignItems="center"
							gap="$3"
						>
							<QrCode size={"$4"} color="black" />
							<View>
								<SizableText size={"$5"} fontWeight={"bold"}>
									Time In
								</SizableText>
								<SizableText size={"$3"} color="$gray10">
									Click to time open the scanner
								</SizableText>
							</View>
						</Card.Header>
					</TouchableNativeFeedback>
				</Card>
			</View>
			{recentTimeIns.isLoading ||
				(recentTimeIns.isRefetching && (
					<ActivityIndicator
						size={"large"}
						color={theme.cyan10}
						style={{ marginTop: 20 }}
					/>
				))}
			{recentTimeIns.isError ? (
				<SizableText color="$red10" marginTop="$4" textAlign="center">
					{isAxiosError(recentTimeIns.error)
						? recentTimeIns.error.response?.data.message
						: "An error occurred while fetching recent time ins."}
				</SizableText>
			) : null}
			{recentTimeIns.isSuccess && (
				<>
					<XStack
						marginTop="$6"
						justifyContent="space-between"
						alignItems="center"
					>
						<SizableText>Recent time in</SizableText>
						<TouchableOpacity
							onPress={() => recentTimeIns.refetch()}
						>
							<SizableText color="$cyan10">Refresh</SizableText>
						</TouchableOpacity>
					</XStack>
					<FlatList
						data={recentTimeIns.data}
						keyExtractor={(item) => item._id}
						contentContainerStyle={{
							marginTop: 16,
							display: "flex",
							gap: 16,
							flexDirection: "column",
						}}
						renderItem={({ item: attendance }) => (
							<>
								<TouchableNativeFeedback
									onPress={() =>
										handleShowAttendanceOptions(
											attendance._id,
										)
									}
								>
									<Card
										backgroundColor={"white"}
										borderWidth={0.3}
										borderColor={"$gray8"}
										borderRadius="$4"
									>
										<Card.Header
											alignItems="center"
											gap="$3"
											flexDirection="row"
										>
											<View
												width={"$6"}
												height={"$6"}
												borderRadius={999}
												justifyContent="center"
												alignItems="center"
												backgroundColor={theme.cyan3}
											>
												<SizableText
													fontWeight="bold"
													ellipse
												>
													{attendance.moduleId.acronym}
												</SizableText>
											</View>
											<View>
												<SizableText
													size={"$5"}
													fontWeight={"bold"}
												>
													{attendance.moduleId.name}
												</SizableText>
												<SizableText
													size={"$1"}
													color="$gray10"
													ellipse
												>
													Time In:{" "}
													{new Date(
														attendance.timeIn
													).toLocaleString()}
												</SizableText>
												{attendance.breakIn && (
													<SizableText
														size={"$1"}
														color="$gray10"
														ellipse
													>
														Break In:{" "}
														{new Date(
															attendance.breakIn
														).toLocaleString()}
													</SizableText>
												)}
												{attendance.breakOut && (
													<SizableText
														size={"$1"}
														color="$gray10"
														ellipse
													>
														Break Out:{" "}
														{new Date(
															attendance.breakOut
														).toLocaleString()}
													</SizableText>
												)}
												{attendance.timeOut && (
													<SizableText
														size={"$1"}
														color="$gray10"
														ellipse
													>
														Time Out:{" "}
														{new Date(
															attendance.timeOut
														).toLocaleString()}
													</SizableText>
												)}
												{attendance.duration ? (
													<SizableText
														size={"$1"}
														color="$gray10"
														ellipse
													>
														Duration: {(attendance.duration / 60).toFixed(2)} hours
													</SizableText>
												) : null}

											</View>
										</Card.Header>
										{showAttendanceOptions === attendance._id ? (
											<XStack
												borderRadius="$4"
												alignItems="center"
												gap="$4"
												justifyContent="flex-end"
												mb="$4"
												mr="$4"
											>
												<TouchableOpacity
													style={{
														flex: 1, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"
													}}
													onPress={() =>
														handleTimeOut(attendance._id, attendance.moduleId.name)
													}
													disabled={attendance.timeOut ? true : false}

												>
													<SizableText
														color={"$red10"}
														padding="$2"
														opacity={attendance.timeOut ? 0.5 : 1}

													>
														Time Out
													</SizableText>
													{attendance.timeOut ? (
														<CheckCheck
															size={12}
															color={attendance.breakOut ? "$red10" : theme.cyan10}
														/>
													) : null}
												</TouchableOpacity>

												<TouchableOpacity
													style={{
														flex: 1, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"
													}}
													onPress={() =>
														handleBreakOut(
															attendance._id,
															attendance.moduleId.name
														)
													}
													disabled={attendance.breakOut ? true : false}

												>
													<SizableText
														color={attendance.breakOut ? "$green10" : theme.cyan10}
														opacity={attendance.breakOut ? 0.5 : 1}
														padding="$2"
													>
														Break Out

													</SizableText>
													{attendance.breakOut ? (

														<CheckCheck
															size={12}
															color={attendance.breakOut ? "$green10" : theme.cyan10}
														/>
													) : null}
												</TouchableOpacity>
												<TouchableOpacity
													style={{
														flex: 1, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"
													}}
													onPress={() =>
														handleBreakIn(
															attendance._id,
															attendance.moduleId.name
														)
													}
													disabled={attendance.breakIn ? true : false}

												>
													<SizableText
														color={attendance.breakIn ? "$green10" : theme.cyan10}
														opacity={attendance.breakIn ? 0.5 : 1}
														padding="$2"
													>
														Break In

													</SizableText>
													{attendance.breakIn ? (

														<CheckCheck
															size={12}
															color={attendance.breakIn ? "$green10" : theme.cyan10}
														/>
													) : null}
												</TouchableOpacity>
											</XStack>
										) : null}
									</Card>
								</TouchableNativeFeedback>
							</>

						)}
					/>
				</>
			)}
			<LoadingModal
				isVisible={timeOutMutation.isPending}
				text="Submitting time-out..."
			/>
			<LoadingModal
				isVisible={breakInMutation.isPending}
				text="Submitting break-in..."
			/>
			<LoadingModal
				isVisible={breakOutMutation.isPending}
				text="Submitting break-out..."
			/>
		</View>
	);
};

export default Index;
