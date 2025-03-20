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
import moment from "moment";
import CustomButton from "@/components/CustomButton";
import { CheckCheck, File, Phone, Trash } from "@tamagui/lucide-icons";
import { EyeExamReport as IEyeExamReport } from "@/interfaces/PatientRecord";
import EyeExamReport from "@/constants/PDFTemplates";
import * as Print from "expo-print";
import { useState } from "react";
import { Alert, RefreshControl } from "react-native";
import LoadingModal from "@/components/LoadingModal";
import { switchStatusColor } from "@/utils/helpers";
import { RecordId } from "@/types/Record";
import DestructiveButton from "@/components/DestructiveButton";
import useDeleteSubmission from "@/hooks/useDeleteSubmission";
import { useUser } from "@clerk/clerk-expo";

type ViewSubmissionParams = {
	submissionId: string;
};

type SubmissionDetails = {
	submission: Submission;
	message: string;
};

export const fetchSubmissionDetails = async (
	submissionId: string
): Promise<SubmissionDetails> => {
	const { data }: { data: SubmissionDetails } = await axios.get(
		`${SERVER}/submission/get/${submissionId}`
	);
	return data;
};

const ViewSubmission = () => {
	const { submissionId } = useGlobalSearchParams<ViewSubmissionParams>();
	const [selectedPrinter, setSelectedPrinter] = useState<any>();
	const [isExporting, setIsExporting] = useState(false);
	const deleteSubmission = useDeleteSubmission();
	const { user } = useUser();
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["submission", submissionId],
		queryFn: () => fetchSubmissionDetails(submissionId),
		enabled: !!submissionId,
		staleTime: 1000 * 60 * 5,
	});

	if (isLoading || !data) return <Loading />;
	if (error) return <Text>Error loading submission</Text>;

	const recordId = data?.submission?.recordId as RecordId;
	if (!recordId) return;

	const {
		firstName,
		lastName,
		middleName,
		age,
		patient_id,
		_id,
		imageUrl,
		contactInformation,
	} = recordId.patientId;
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

	const handleDeleteSubmission = async () => {
		await deleteSubmission
			.mutateAsync({
				submissionId: data.submission._id,
				moduleId: data.submission.moduleId,
				clinicianId: user?.publicMetadata._id as string,
			})
			.then((res) => {
				Alert.alert("Success", res.data.message.toString());
				router.back();
			})
			.catch((error) => {
				Alert.alert(
					"Error",
					"An error occurred while deleting submission."
				);
			});
	};

	const confirmDeleteSubmission = () => {
		Alert.alert(
			"Are you sure you want to delete this submission?",
			"This action cannot be undone.",
			[
				{
					text: "Cancel",
					onPress: () => {},
				},
				{
					text: "Yes, Delete",
					onPress: () => handleDeleteSubmission(),
				},
			]
		);
	};

	return (
		<>
			<ScrollView
				backgroundColor={"white"}
				flex={1}
				contentContainerStyle={{ padding: "$3", gap: "$3" }}
				refreshControl={
					<RefreshControl
						refreshing={isLoading}
						onRefresh={refetch}
					/>
				}
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
							color={"white"}
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
							<Avatar.Fallback
								justifyContent="center"
								alignItems="center"
								backgroundColor={"$gray3"}
							>
								<SizableText>
									{firstName.charAt(0).toUpperCase()}
									{lastName.charAt(0).toUpperCase()}
								</SizableText>
							</Avatar.Fallback>
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
							<XStack gap="$2">
								<Phone size={16} color={"gray"} />
								<SizableText fontSize={"$3"}>
									{contactInformation.mobile}
								</SizableText>
							</XStack>
						</YStack>
					</XStack>
					<CustomButton
						onPress={viewPatient}
						buttonText="View Record Details"
						marginTop="$3"
					/>
				</View>
				{data.submission.corrections.length > 0 && (
					<View gap="$3">
						<Heading size={"$5"}>Corrections</Heading>
						<YStack gap="$2">
							{data.submission.corrections.map(
								(correction, index) => (
									<View
										key={index}
										padding="$2"
										borderWidth={1}
										borderColor={"$gray3"}
										borderRadius={"$4"}
										backgroundColor={
											correction.resolved
												? "$green3"
												: "$background"
										}
									>
										<SizableText fontWeight="bold">
											{correction.fieldName}
										</SizableText>
										<SizableText>
											Current:{" "}
											<SizableText fontStyle="italic">
												{correction.currentValue}
											</SizableText>
										</SizableText>
										<SizableText>
											Correction:{" "}
											<SizableText fontStyle="italic">
												{correction.correction}
											</SizableText>
										</SizableText>
										{correction.resolved ? (
											<XStack
												gap="$1"
												alignItems="center"
												justifyContent="flex-end"
											>
												<CheckCheck
													size={16}
													color={"$green9"}
												/>
												<SizableText color={"$green9"}>
													Resolved
												</SizableText>
											</XStack>
										) : (
											<XStack
												gap="$2"
												alignItems="center"
												mt="$1"
												justifyContent="flex-end"
											>
												<SizableText fontStyle="italic">
													Pending...
												</SizableText>
											</XStack>
										)}
									</View>
								)
							)}
						</YStack>
					</View>
				)}
			</ScrollView>
			<View backgroundColor={"white"} padding="$3" gap="$3">
				<CustomButton
					buttonText="Export"
					icon={<File />}
					disabled={
						data?.submission.status !== SubmissionStatus.APPROVED
					}
					onPress={exportRecord}
				/>
				<DestructiveButton
					text="Delete Submission"
					icon={Trash}
					onPress={() => confirmDeleteSubmission()}
				/>
			</View>
			<LoadingModal isVisible={isExporting} text="Exporting..." />
			<LoadingModal
				isVisible={deleteSubmission.isPending}
				text="Deleting..."
			/>
		</>
	);
};

export default ViewSubmission;
