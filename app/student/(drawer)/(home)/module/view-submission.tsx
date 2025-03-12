import { SERVER } from "@/constants/link";
import axios from "axios";
import { router, useGlobalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import {
	Avatar,
	Heading,
	ScrollView,
	Separator,
	SizableText,
	Text,
	View,
	XStack,
	YStack,
} from "tamagui";
import { Submission, SubmissionStatus } from "./Submissions";
import Loading from "@/components/Loading";
import { PatientRecord } from "@/types/Record";
import moment from "moment";
import CustomButton from "@/components/CustomButton";
import { File } from "@tamagui/lucide-icons";
import { EyeExamReport as IEyeExamReport } from "@/interfaces/PatientRecord";
import EyeExamReport from "@/constants/PDFTemplates";
import * as Print from "expo-print";
import { useState } from "react";
import { Alert } from "react-native";
import LoadingModal from "@/components/LoadingModal";
import { gray } from "@/theme/theme";

type ViewSubmissionParams = {
	submissionId: string;
};

type SubmissionDetails = {
	submission: Submission;
	message: string;
};

// Function to fetch submission details
export const fetchSubmissionDetails = async (
	submissionId: string
): Promise<SubmissionDetails> => {
	const { data }: { data: SubmissionDetails } = await axios.get(
		`${SERVER}/submission/get/${submissionId}`
	);
	return data;
};

const switchStatusColor = (status: string) => {
	switch (status) {
		case SubmissionStatus.APPROVED:
			return "green";
		case SubmissionStatus.FOR_APPROVAL:
			return "gold";
		case SubmissionStatus.FOR_REVALIDATION:
			return "orange";
		case SubmissionStatus.REJECTED:
			return "red";
		default:
			return "black";
	}
};

const ViewSubmission = () => {
	const { submissionId } = useGlobalSearchParams<ViewSubmissionParams>();
	const [selectedPrinter, setSelectedPrinter] = useState<any>();
	const [isExporting, setIsExporting] = useState(false);

	const { data, isLoading, error } = useQuery({
		queryKey: ["submission", submissionId],
		queryFn: () => fetchSubmissionDetails(submissionId),
		enabled: !!submissionId, // Prevents fetching if no ID is available
	});

	if (isLoading) return <Loading />;
	if (error) return <Text>Error loading submission</Text>;

	const recordId = data?.submission?.recordId as PatientRecord;
	if (!recordId) return;

	const { firstName, lastName, middleName, age, patient_id, _id, imageUrl } =
		recordId.patientId;
	const fullName = [firstName, middleName, lastName]
		.filter(Boolean)
		.join(" ");

	const viewPatient = () => {
		router.push({
			pathname: `/student/patient/[patient_id]`,
			params: { patient_id: _id, patientName: fullName },
		});
	};

	const exportRecord = async () => {
		try {
			const response = await axios.get(
				`${SERVER}/record/${recordId._id}`
			);

			const record: IEyeExamReport = response.data;
			print(record);
		} catch (error) {
			Alert.alert(
				"Error",
				"An error occured while exporting. Please try again later."
			);
		}
	};

	const print = async (record: IEyeExamReport) => {
		try {
			setIsExporting(true);
			await Print.printAsync({
				html: EyeExamReport(record),
				printerUrl: selectedPrinter?.url,
			});
		} catch (error) {
			Alert.alert(
				"Error",
				"An error occured while exporting. Please try again later."
			);
		} finally {
			setIsExporting(false);
		}
	};
	console.log("submission id", submissionId);

	return (
		<>
			<ScrollView
				backgroundColor={"white"}
				flex={1}
				contentContainerStyle={{ padding: "$3", gap: "$3" }}
			>
				<XStack justifyContent="space-between">
					<View
						padding="$1"
						backgroundColor={switchStatusColor(
							data?.submission.status || ""
						)}
						borderRadius={"$4"}
					>
						<SizableText
							textTransform="uppercase"
							paddingHorizontal="$4"
							size={"$2"}
							color={
								data?.submission.status ===
								SubmissionStatus.APPROVED
									? "white"
									: "black"
							}
						>
							{data?.submission.status}
						</SizableText>
					</View>
					<SizableText fontSize={"$1"}>
						Submitted:{" "}
						{moment(recordId.createdAt).format("MMMM D, YYYY")}
					</SizableText>
				</XStack>
				<View>
					<Heading size={"$5"} marginBottom="$2">
						Patient Information
					</Heading>
					<Separator marginBottom="$3" />
					<XStack alignItems="flex-start" gap="$4">
						<Avatar borderRadius={"$4"} size={"$10"}>
							<Avatar.Image src={imageUrl} objectFit="contain" />
						</Avatar>
						<YStack flex={1}>
							<SizableText fontSize={"$3"}>
								Name: {fullName}
							</SizableText>
							<SizableText fontSize={"$3"} adjustsFontSizeToFit>
								ID: {patient_id}
							</SizableText>
							<SizableText fontSize={"$3"}>
								Age: {age}
							</SizableText>
						</YStack>
					</XStack>
					<CustomButton
						onPress={viewPatient}
						buttonText="View Record Details"
						marginTop="$3"
					/>
					{data?.submission.status !== SubmissionStatus.APPROVED && (
						<View
							paddingVertical="$1"
							backgroundColor={gray.gray3}
							paddingHorizontal="$2"
							marginTop="$5"
							borderRadius={"$5"}
						>
							<SizableText textAlign="center">
								Status:{" "}
								<SizableText fontStyle="italic">
									Waiting for approval...
								</SizableText>
							</SizableText>
						</View>
					)}
					
				</View>
			</ScrollView>
			<View backgroundColor={"white"} padding="$3" gap="$3">
				<CustomButton
					buttonText="Export"
					icon={<File />}
					onPress={exportRecord}
					
				/>
			</View>
			<LoadingModal isVisible={isExporting} text="Exporting..." />
		</>
	);
};

export default ViewSubmission;
