import CustomButton from "@/components/CustomButton";
import Loading from "@/components/Loading";
import { SERVER } from "@/constants/link";
import useStore from "@/hooks/useStore";
import { SelectRecord } from "@/interfaces/select-record";
import { PatientRecord } from "@/types/Record";
import { useUser } from "@clerk/clerk-expo";
import { Plus } from "@tamagui/lucide-icons";
import axios from "axios";
import { router, useGlobalSearchParams, useNavigation } from "expo-router";
import moment from "moment";
import React, { memo, useEffect, useState } from "react";
import { RefreshControl, TouchableNativeFeedback } from "react-native";
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
	recordId: PatientRecord;
	moduleId: string;
	clinicianId: string;
	status: SubmissionStatus;
	createdAt: string;
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

const Submissions: React.FC = () => {
	const [submissions, setSubmissions] = React.useState<any[] | null>(null);
	const { user } = useUser();
	const { moduleId } = useGlobalSearchParams();
	const [refresh, setRefresh] = useState(false);

	useEffect(() => {
		fetchSubmissions();
		return () => {};
	}, []);

	const fetchSubmissions = async () => {
		try {
			const { data } = await axios.get(`${SERVER}/submissions`, {
				params: {
					moduleId: moduleId,
					clinicianId: user?.publicMetadata._id,
				},
			});
			setSubmissions(data.submissions);
		} catch (error: any) {
			Alert.alert("Error", error.response.data.message);
			console.error(error.response.data.message);
		}
	};
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
		setSubmissions(null);
		fetchSubmissions();
		setRefresh(false);
	};

	return (
		<>
			<ScrollView
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
				{submissions === null && <Loading />}
				{submissions && submissions.length === 0 && <NoSubmissions />}
				<SubmissionItems
					submissions={submissions}
					viewSubmissionDetails={viewSubmissionDetails}
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
		</>
	);
};

const SubmissionItems = memo(
	({
		submissions,
		viewSubmissionDetails,
	}: {
		submissions: Submission[] | null;
		viewSubmissionDetails: (submissionId: string) => void;
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
											backgroundColor={"gray"}
										/>
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
