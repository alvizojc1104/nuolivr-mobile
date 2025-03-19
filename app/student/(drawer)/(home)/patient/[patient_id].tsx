import Title from "@/components/Title";
import View from "@/components/View";
import {
	CheckCircle2,
	ChevronRight,
	Trash,
	UserRound,
} from "@tamagui/lucide-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, RefreshControl } from "react-native";
import {
	Avatar,
	AvatarFallback,
	ListItem,
	SizableText,
	XStack,
	YStack,
} from "tamagui";
import Animated, { FadeIn } from "react-native-reanimated";
import { theme } from "@/theme/theme";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SERVER } from "@/constants/link";
import axios from "axios";
import { PatientInformation } from "@/types/PatientInformation";
import { useUser } from "@clerk/clerk-expo";
import DestructiveButton from "@/components/DestructiveButton";
import LoadingModal from "@/components/LoadingModal";

const fetchPatientById = async (patientId: string) => {
	const response = await axios.get(`${SERVER}/patient/get/${patientId}`);

	return response.data as PatientInformation;
};

const ViewPatient = () => {
	const { patient_id }: any = useLocalSearchParams();
	const { user } = useUser();
	const [refreshing, setRefreshing] = useState(false);
	const [loadingModal, setLoadingModal] = useState(false);
	const patientQuery = useQuery({
		queryKey: ["patient", patient_id],
		queryFn: () => fetchPatientById(patient_id),
		staleTime: 1000 * 60 * 5,
		enabled: !!patient_id,
	});

	const deletePatient = useMutation({
		mutationFn: async () => {
			const response = await axios.delete(
				`${SERVER}/patient/delete/${user?.publicMetadata._id}/${patient_id}`
			);

			return response.data;
		},
	});

	useFocusEffect(
		useCallback(() => {
			patientQuery.refetch();
		}, [])
	);

	const fullName = useMemo(() => {
		return `${patientQuery.data?.firstName} ${
			patientQuery.data?.middleName || ""
		} ${patientQuery.data?.lastName || ""}`.trim();
	}, [patientQuery.data]);

	const refreshPage = async () => {
		setRefreshing(true);
		patientQuery.refetch();
		setRefreshing(false);
	};

	const handleRoutes = useCallback(
		(link: string) => {
			const params = {
				fullName: `${patientQuery.data?.firstName} ${patientQuery.data?.lastName}`,
				patientId: patientQuery.data?._id,
				recordId: patientQuery.data?.records[0]?._id || null,
				pid: patientQuery.data?.patient_id,
			};
			switch (link) {
				case "eye-triage":
					router.push({
						pathname: "/student/(pcr)/eye-triage",
						params: params,
					});
					break;
				case "initial-observation":
					router.push({
						pathname: "/student/(pcr)/initial-observation",
						params: params,
					});
					break;
				case "preliminary-examination":
					router.push({
						pathname: "/student/preliminary-examination",
						params: params,
					});
					break;
				case "visual-acuity":
					router.push({
						pathname:
							"/student/preliminary-examination/visual-acuity",
						params: params,
					});
					break;
				case "phorometry":
					router.push({
						pathname: "/student/preliminary-examination/phorometry",
						params: params,
					});
					break;
				case "external-eye-examination":
					router.push({
						pathname:
							"/student/preliminary-examination/external-eye-examination",
						params: params,
					});
					break;
				case "ophthalmoscopy":
					router.push({
						pathname:
							"/student/preliminary-examination/ophthalmoscopy",
						params: params,
					});
					break;
				default:
					break;
			}
		},
		[patientQuery.data]
	);

	if (patientQuery.isLoading || !patientQuery.data) {
		return (
			<View flex={1} alignItems="center" paddingTop="$4">
				<ActivityIndicator size={"large"} color={theme.cyan10} />
			</View>
		);
	}

	if (patientQuery.error) {
		return (
			<View flex={1} alignItems="center" justifyContent="center">
				<SizableText color="red">{`Error: ${patientQuery.error.message}`}</SizableText>
			</View>
		);
	}

	const getRecordSubtitle = (
		recordType: keyof PatientInformation["records"][0]
	) => {
		if (
			patientQuery.data &&
			typeof patientQuery.data.records[0]?.[recordType] === "object" &&
			(
				patientQuery.data.records[0]?.[recordType] as {
					isComplete: boolean;
				}
			)?.isComplete
		) {
			return (
				"updated " +
				moment(
					(
						patientQuery.data.records[0]?.[recordType] as {
							updatedAt: string;
						}
					).updatedAt
				)
					.startOf("s")
					.fromNow()
			);
		} else {
			return "Start";
		}
	};

	const handleDeletePatient = () => {
		setLoadingModal(true);
		deletePatient
			.mutateAsync()
			.then(() => {
				Alert.alert(
					"Success",
					"The patient has been removed successfully!",
					[{ text: "OK", onPress: () => router.back() }]
				);
			})
			.catch((error) => {
				Alert.alert(
					"An unknown error occurred while deleting the patient.",
					"Please try again later."
				);
			})
			.finally(() => {
				setLoadingModal(false);
			});
	};

	const confirmDelete = () => {
		Alert.alert(
			"Delete Patient",
			"Are you sure you want to delete this patient?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					onPress: handleDeletePatient,
				},
			]
		);
	};

	return (
		<View flex={1} bg={"white"}>
			<Animated.ScrollView
				entering={FadeIn}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={refreshPage}
					/>
				}
				style={{ flex: 1 }}
				contentContainerStyle={{ gap: 2 }}
			>
				<View padded>
					<XStack alignItems="center" gap="$5">
						<Avatar borderRadius={"$4"} size={"$10"}>
							{patientQuery.data ? (
								<Avatar.Image
									src={patientQuery.data?.imageUrl}
									objectFit="contain"
								/>
							) : (
								<UserRound />
							)}
							<AvatarFallback
								justifyContent="center"
								alignItems="center"
								backgroundColor={"$gray3"}
							>
								<SizableText>
									{patientQuery.data.firstName[0].toUpperCase()}
									{patientQuery.data.lastName[0].toUpperCase()}
								</SizableText>
							</AvatarFallback>
						</Avatar>
						<YStack flex={1}>
							<SizableText>{fullName}</SizableText>
							<SizableText
								size={"$2"}
								color={"$gray10"}
								adjustsFontSizeToFit
							>
								Patient ID: {patientQuery.data?.patient_id}
							</SizableText>
							<SizableText size={"$2"} color={"$gray10"}>
								Age: {patientQuery.data?.age}
							</SizableText>
							<SizableText size={"$2"} color={"$gray10"}>
								Added on:{" "}
								{moment(patientQuery.data.createdAt).format(
									"MMMM D, YYYY"
								)}
							</SizableText>
						</YStack>
					</XStack>
				</View>
				<View padded>
					<Title text={`Full Name`} />
					<SizableText mb="$3">{fullName}</SizableText>
					<Title text="Birthday" />
					<SizableText mb="$3">
						{moment(patientQuery.data.birthdate).format(
							"MMMM D, YYYY"
						)}
					</SizableText>
					<Title text="Occupation/Course" />
					<SizableText mb="$3">
						{patientQuery.data?.occupationOrCourse}
					</SizableText>
					<Title text="Hobbies/Avocation" />
					<SizableText mb="$3">
						{patientQuery.data?.hobbiesOrAvocation}
					</SizableText>
					<Title text="Address" />
					<SizableText mb="$3">
						{patientQuery.data?.contactInformation.fullAddress}
					</SizableText>
					<Title text="Email" />
					<SizableText mb="$3">
						{patientQuery.data?.contactInformation.emailAddress}
					</SizableText>
					<Title text="Mobile Number" />
					<SizableText>
						{patientQuery.data?.contactInformation.mobile}
					</SizableText>
				</View>
				<View padded gap="$2">
					<Title text="RECORD" />
					<ListItem
						bordered
						borderRadius={"$5"}
						backgroundColor={
							patientQuery.data.records[0]?.eyeTriage?.isComplete
								? "$green2"
								: "$bacground0"
						}
						theme={
							patientQuery.data.records[0]?.eyeTriage?.isComplete
								? "green_active"
								: null
						}
						onPress={() => handleRoutes("eye-triage")}
						pressTheme
						title="Eye Triage"
						subTitle={getRecordSubtitle("eyeTriage")}
						iconAfter={
							patientQuery.data.records[0]?.eyeTriage
								?.isComplete ? (
								<CheckCircle2 color={"green"} />
							) : (
								<ChevronRight />
							)
						}
					/>
					<ListItem
						bordered
						borderRadius={"$5"}
						backgroundColor={
							patientQuery.data.records[0]?.patientCaseRecord
								?.isComplete
								? "$green2"
								: "$bacground0"
						}
						theme={
							patientQuery.data.records[0]?.patientCaseRecord
								?.isComplete
								? "green_active"
								: null
						}
						onPress={() => handleRoutes("initial-observation")}
						pressTheme
						title="Patient Case Record"
						subTitle={getRecordSubtitle("patientCaseRecord")}
						iconAfter={
							patientQuery.data.records[0]?.patientCaseRecord
								?.isComplete ? (
								<CheckCircle2 color={"green"} />
							) : (
								<ChevronRight />
							)
						}
					/>
					<ListItem
						bordered
						borderRadius={"$5"}
						backgroundColor={
							patientQuery.data.records[0]?.preliminaryExamination
								?.isComplete
								? "$green2"
								: "$bacground0"
						}
						theme={
							patientQuery.data.records[0]?.preliminaryExamination
								?.isComplete
								? "green_active"
								: null
						}
						onPress={() => handleRoutes("preliminary-examination")}
						pressTheme
						title="Preliminary Examination"
						subTitle={getRecordSubtitle("preliminaryExamination")}
						iconAfter={
							patientQuery.data.records[0]?.preliminaryExamination
								?.isComplete ? (
								<CheckCircle2 color={"green"} />
							) : (
								<ChevronRight />
							)
						}
					/>
					<ListItem
						bordered
						borderRadius={"$5"}
						backgroundColor={
							patientQuery.data.records[0]?.visualAcuity
								?.isComplete
								? "$green2"
								: "$bacground0"
						}
						theme={
							patientQuery.data.records[0]?.visualAcuity
								?.isComplete
								? "green_active"
								: null
						}
						onPress={() => handleRoutes("visual-acuity")}
						pressTheme
						title="Visual Acuity"
						subTitle={getRecordSubtitle("visualAcuity")}
						iconAfter={
							patientQuery.data.records[0]?.visualAcuity
								?.isComplete ? (
								<CheckCircle2 color={"green"} />
							) : (
								<ChevronRight />
							)
						}
					/>
					<ListItem
						bordered
						borderRadius={"$5"}
						backgroundColor={
							patientQuery.data.records[0]?.phorometry?.isComplete
								? "$green2"
								: "$bacground0"
						}
						theme={
							patientQuery.data.records[0]?.phorometry?.isComplete
								? "green_active"
								: null
						}
						onPress={() => handleRoutes("phorometry")}
						pressTheme
						title="Phorometry"
						subTitle={getRecordSubtitle("phorometry")}
						iconAfter={
							patientQuery.data.records[0]?.phorometry
								?.isComplete ? (
								<CheckCircle2 color={"green"} />
							) : (
								<ChevronRight />
							)
						}
					/>
					<ListItem
						bordered
						borderRadius={"$5"}
						backgroundColor={
							patientQuery.data.records[0]?.externalEyeExamination
								?.isComplete
								? "$green2"
								: "$bacground0"
						}
						theme={
							patientQuery.data.records[0]?.externalEyeExamination
								?.isComplete
								? "green_active"
								: null
						}
						onPress={() => handleRoutes("external-eye-examination")}
						pressTheme
						title="External Eye Examination"
						subTitle={getRecordSubtitle("externalEyeExamination")}
						iconAfter={
							patientQuery.data.records[0]?.externalEyeExamination
								?.isComplete ? (
								<CheckCircle2 color={"green"} />
							) : (
								<ChevronRight />
							)
						}
					/>
					<ListItem
						bordered
						borderRadius={"$5"}
						backgroundColor={
							patientQuery.data.records[0]?.ophthalmoscopy
								?.isComplete
								? "$green2"
								: "$bacground0"
						}
						theme={
							patientQuery.data.records[0]?.ophthalmoscopy
								?.isComplete
								? "green_active"
								: null
						}
						onPress={() => handleRoutes("ophthalmoscopy")}
						pressTheme
						title="Ophthalmoscopy"
						subTitle={getRecordSubtitle("ophthalmoscopy")}
						iconAfter={
							patientQuery.data.records[0]?.ophthalmoscopy
								?.isComplete ? (
								<CheckCircle2 color={"green"} />
							) : (
								<ChevronRight />
							)
						}
					/>
					<DestructiveButton
						marginTop="$3"
						text="Delete Patient"
						onPress={confirmDelete}
						icon={Trash}
					/>
				</View>
			</Animated.ScrollView>
			<LoadingModal
				isVisible={loadingModal}
				text="Removing patient..."
				setIsVisible={setLoadingModal}
			/>
		</View>
	);
};

export default ViewPatient;
