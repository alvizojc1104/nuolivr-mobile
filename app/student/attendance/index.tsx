import LoadingModal from "@/components/LoadingModal";
import { useAttendance } from "@/hooks/useAttendance";
import { theme } from "@/theme/theme";
import api from "@/utils/axios";
import { useUser } from "@clerk/clerk-expo";
import { QrCode } from "@tamagui/lucide-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { router } from "expo-router";
import React, { useEffect } from "react";
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

	const recentTimeIns = useQuery({
		queryKey: ["recent-time-ins"],
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

	useEffect(() => {
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
			`Are you sure you want to submit time-out in ${moduleName}?`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "OK",
					onPress: async () =>
						await timeOutMutation.mutateAsync(attendanceId),
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
							<TouchableNativeFeedback
								onPress={() =>
									handleTimeOut(
										attendance._id,
										attendance.moduleId.name
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
											<SizableText
												size={"$1"}
												color="$gray10"
												ellipse
											>
												Click to submit time out.
											</SizableText>
										</View>
									</Card.Header>
								</Card>
							</TouchableNativeFeedback>
						)}
					/>
				</>
			)}
			<LoadingModal
				isVisible={timeOutMutation.isPending}
				text="Submitting time-out..."
			/>
		</View>
	);
};

export default Index;
