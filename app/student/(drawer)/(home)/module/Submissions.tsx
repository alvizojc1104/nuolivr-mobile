import CustomButton from "@/components/CustomButton";
import Loading from "@/components/Loading";
import LoadingModal from "@/components/LoadingModal";
import { SERVER } from "@/constants/link";
import useDeleteSubmission from "@/hooks/useDeleteSubmission";
import { CorrectionItem, RecordId } from "@/types/Record";
import { useUser } from "@clerk/clerk-expo";
import { Plus } from "@tamagui/lucide-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { router, useFocusEffect, useGlobalSearchParams } from "expo-router";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
	Modal,
	RefreshControl,
	TouchableNativeFeedback,
	View as RNView,
	TouchableWithoutFeedback,
} from "react-native";
import { Alert } from "react-native";
import { Avatar, ScrollView, SizableText, View } from "tamagui";

export enum SubmissionStatus {
	FOR_APPROVAL = "for approval",
	APPROVED = "approved",
	FOR_REVALIDATION = "for revalidation",
	REJECTED = "rejected",
}

export type Submission = {
	_id: string;
	recordId: RecordId;
	moduleId: string;
	clinicianId: string;
	status: SubmissionStatus;
	corrections: CorrectionItem[];
	createdAt: string;
};
const switchStatusColor = (status: string) => {
	switch (status) {
		case SubmissionStatus.APPROVED:
			return "green";
		case SubmissionStatus.FOR_APPROVAL:
			return "yellow";
		case SubmissionStatus.FOR_REVALIDATION:
			return "blue";
		case SubmissionStatus.REJECTED:
			return "red";
		default:
			return "white";
	}
};

const Submissions: React.FC = () => {
	const { user } = useUser();
	const deleteSubmission = useDeleteSubmission();
	const { moduleId } = useGlobalSearchParams() as { moduleId: string };
	const [refresh, setRefresh] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedSubmission, setSelectedSubmission] =
		useState<Submission | null>(null);

	const submissionsQuery = useQuery({
		queryKey: ["submissions", moduleId, user?.publicMetadata._id],
		queryFn: async () => {
			const { data } = await axios.get(`${SERVER}/submissions`, {
				params: {
					moduleId: Array.isArray(moduleId) ? moduleId[0] : moduleId,
					clinicianId: user?.publicMetadata._id,
				},
			});
			return data.submissions;
		},
		enabled: !!moduleId && !!user,
		staleTime: 1000 * 60 * 5,
	});

	const submitNew = () => {
		router.push("/student/module/select-record");
	};

	const viewSubmissionDetails = (submissionId: string) => {
		router.push({
			pathname: `/student/module/view-submission`,
			params: { submissionId },
		});
	};

	const refreshPage = () => {
		setRefresh(true);
		submissionsQuery.refetch();
		setRefresh(false);
	};

	const handleLongPress = (submission: Submission) => {
		setSelectedSubmission(submission);
		setModalVisible(true);
	};

	const handleModalClose = () => {
		setModalVisible(false);
		setSelectedSubmission(null);
	};

	const confirmDelete = () => {
		Alert.alert(
			"Are you sure you want to delete this submission?",
			"This action cannot be undone.",
			[
				{
					text: "Cancel",
					onPress: () => handleModalClose(),
				},
				{
					text: "Yes, Delete",
					onPress: () => handleDelete(),
				},
			]
		);
	};

	const handleDelete = async () => {
		deleteSubmission
			.mutateAsync({
				clinicianId: user?.publicMetadata._id as string,
				moduleId: moduleId,
				submissionId: selectedSubmission?._id as string,
			})
			.then(() => {
				handleModalClose();
				submissionsQuery.refetch();
				Alert.alert("Success", "Submission deleted successfully!");
			});
	};

	return (
		<>
			<ScrollView
				contentContainerStyle={{ paddingBottom: 80 }}
				showsVerticalScrollIndicator={false}
				flex={1}
				height={"100%"}
				refreshControl={
					<RefreshControl
						refreshing={refresh}
						onRefresh={refreshPage}
					/>
				}
			>
				{submissionsQuery.isLoading && <Loading />}
				{submissionsQuery.data &&
					submissionsQuery.data.length === 0 && <NoSubmissions />}
				<SubmissionItems
					submissions={submissionsQuery.data}
					viewSubmissionDetails={viewSubmissionDetails}
					onLongPress={handleLongPress}
				/>
			</ScrollView>
			<CustomButton
				position="absolute"
				bottom={"$5"}
				right={"$5"}
				onPress={submitNew}
				buttonText="Submit new"
				iconAfter={<Plus color={"white"} />}
			/>
			<Modal animationType="fade" transparent visible={modalVisible}>
				<TouchableWithoutFeedback
					onPress={() => setModalVisible(false)}
				>
					<RNView
						style={{
							flex: 1,
							backgroundColor: "rgba(0, 0, 0, 0.5)",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<View
							backgroundColor={"white"}
							padding="$2"
							borderRadius="$4"
							width="80%"
						>
							<TouchableNativeFeedback onPress={confirmDelete}>
								<RNView style={{ padding: 10, width: "100%" }}>
									<SizableText>Delete</SizableText>
								</RNView>
							</TouchableNativeFeedback>
						</View>
					</RNView>
				</TouchableWithoutFeedback>
			</Modal>
			{deleteSubmission.isPending && (
				<LoadingModal isVisible text="Deleting..." />
			)}
		</>
	);
};

const SubmissionItems = memo(
	({
		submissions,
		viewSubmissionDetails,
		onLongPress,
	}: {
		submissions: Submission[] | null;
		viewSubmissionDetails: (submissionId: string) => void;
		onLongPress: (submission: Submission) => void;
	}) => {
		return (
			<>
				{submissions &&
					submissions.map((submission: Submission) => (
						<TouchableNativeFeedback
							key={submission._id}
							onPress={() =>
								viewSubmissionDetails(submission._id)
							}
							onLongPress={() => onLongPress(submission)}
						>
							<View
								paddingVertical="$3"
								paddingHorizontal="$4"
								flexDirection="row"
								borderBottomWidth={0.2}
								borderBottomColor={"lightgray"}
								gap="$3"
								justifyContent="space-between"
							>
								<View flexDirection="row" gap="$3">
									<Avatar circular objectFit="contain">
										<Avatar.Image
											src={
												submission.recordId.patientId
													.imageUrl
											}
										/>
										<Avatar.Fallback
											backgroundColor={"$gray4"}
											justifyContent="center"
											alignItems="center"
										>
											<SizableText>
												{`${submission.recordId.patientId.firstName[0]}${submission.recordId.patientId.lastName[0]}`}
											</SizableText>
										</Avatar.Fallback>
									</Avatar>
									<View>
										<SizableText>{`${submission.recordId.patientId.firstName} ${submission.recordId.patientId.lastName}`}</SizableText>
										<SizableText color={"gray"}>
											{
												submission.recordId.patientId
													.patient_id
											}
										</SizableText>
									</View>
								</View>
								<SizableText
									fontSize={"$1"}
									textTransform="uppercase"
									padding={2}
									color={switchStatusColor(submission.status)}
									textAlign="center"
								>
									{submission.status}
								</SizableText>
							</View>
						</TouchableNativeFeedback>
					))}
			</>
		);
	}
);

const NoSubmissions: React.FC = () => {
	return (
		<View flex={1} justifyContent="center" alignItems="center" padding="$5">
			<SizableText
				color="gray"
				textAlign="center"
				marginBottom="$3"
				fontSize="$4"
				fontWeight="bold"
				textTransform="uppercase"
			>
				No Submissions Yet
			</SizableText>
			<SizableText
				color="gray"
				textAlign="center"
				fontSize="$3"
				marginBottom="$5"
			>
				You have no submissions at the moment. To add a new submission,
				click the{" "}
				<SizableText fontWeight="bold" fontSize="$3" color={"gray"}>
					Submit new
				</SizableText>{" "}
				button below.
			</SizableText>
		</View>
	);
};

export default Submissions;
