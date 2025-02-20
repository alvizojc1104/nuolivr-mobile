import Loading from "@/components/Loading";
import { SERVER } from "@/constants/link";
import { SelectRecord } from "@/interfaces/select-record";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { router, useGlobalSearchParams } from "expo-router";
import moment from "moment";
import React, {
	useEffect,
	useState,
	memo,
	Dispatch,
	SetStateAction,
	FC,
	useCallback,
} from "react";
import { Alert, RefreshControl, TouchableNativeFeedback } from "react-native";
import {
	Avatar,
	Heading,
	ListItem,
	ScrollView,
	Sheet,
	SizableText,
	View,
	XStack,
} from "tamagui";
import { View as RNView } from "react-native";
import {
	Check,
	CheckCircle,
	CheckCircle2,
	ChevronRight,
	Dot,
	PlusCircle,
	XCircle,
} from "@tamagui/lucide-icons";
import { gray } from "@/theme/theme";
import CustomButton from "@/components/CustomButton";
import LoadingModal from "@/components/LoadingModal";
import useStore from "@/hooks/useStore";

const MyPatients = () => {
	const { user } = useUser();
	const [records, setRecords] = useState<SelectRecord[] | null>(null);
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [openSheetId, setOpenSheetId] = useState<string | null>(null);
	const { selectedModuleId } = useStore();

	useEffect(() => {
		fetchData();
	}, [user?.id]);

	const fetchData = async () => {
		try {
			const { data } = await axios.get(`${SERVER}/record/get/all`, {
				params: { clinicianId: user?.id },
			});
			setRecords(data);
			console.log(data[0].isComplete);
		} catch (error: any) {
			setRecords(error.response.data.message);
		}
	};

	const refreshPage = async () => {
		setRefreshing(true);
		await fetchData();
		setRefreshing(false);
	};

	const submitRecord = async (recordId: string) => {
		try {
			setLoading(true);
			const body = {
				moduleId: selectedModuleId,
				clinicianId: user?.publicMetadata._id,
				recordId: recordId,
			};
			const { data } = await axios.post(`${SERVER}/submission/new`, body);
			console.log(JSON.stringify(data));
			setOpenSheetId(null);
		} catch (error: any) {
			Alert.alert(
				"Submit Failed",
				error.response.data.message + selectedModuleId
			);
			console.log(error.response.data.message);
		} finally {
			setLoading(false);
		}
	};

	if (!records) {
		return <Loading />;
	}

	return (
		<ScrollView
			flex={1}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={refreshPage}
				/>
			}
			contentContainerStyle={{ backgroundColor: "white" }}
		>
			<LoadingModal text="Submitting..." isVisible={loading} />
			{!records && <SizableText padding="$4">{records}</SizableText>}
			{records &&
				records.map((record) => {
					const fullName = [
						record?.patientId.firstName,
						record?.patientId.middleName,
						record?.patientId.lastName,
					]
						.filter(Boolean)
						.join(" ");

					return (
						<RNView key={record._id}>
							<TouchableNativeFeedback
								background={TouchableNativeFeedback.Ripple(
									"#ccc",
									false
								)}
								onPress={() => setOpenSheetId(record._id)}
							>
								<ListItem
									backgroundColor={"$background0"}
									icon={
										<Avatar size={"$4"} circular>
											<Avatar.Image
												src={record.patientId.imageUrl}
											/>
										</Avatar>
									}
									title={
										<XStack>
											<SizableText>
												{fullName}
											</SizableText>
											<Dot
												color={`${
													record.isComplete
														? "green"
														: "red"
												}`}
											/>
										</XStack>
									}
									subTitle={`added ${moment(record?.createdAt)
										.startOf("s")
										.fromNow()}`}
									iconAfter={
										record.isComplete ? (
											<CheckCircle2 color={"green"} />
										) : (
											<XCircle color={"red"} />
										)
									}
								/>
							</TouchableNativeFeedback>
							<RecordDetailsBottomSheet
								openSheet={openSheetId === record._id}
								setOpenSheet={() => setOpenSheetId(null)}
								record={record}
								isDone={record.isComplete}
								submitRecord={submitRecord}
							/>
						</RNView>
					);
				})}
		</ScrollView>
	);
};

const RecordDetailsBottomSheet = memo(
	({
		record,
		openSheet,
		setOpenSheet,
		isDone,
		submitRecord,
	}: {
		record: SelectRecord;
		openSheet: boolean;
		isDone: boolean;
		setOpenSheet: Dispatch<SetStateAction<boolean>>;
		submitRecord: (recordId: string) => void;
	}) => {
		return (
			<Sheet
				modal
				dismissOnSnapToBottom
				dismissOnOverlayPress
				snapPointsMode="fit"
				animation={"quicker"}
				open={openSheet}
				onOpenChange={setOpenSheet}
			>
				<Sheet.Overlay
					animation="quicker"
					enterStyle={{ opacity: 0 }}
					exitStyle={{ opacity: 0 }}
				/>
				<Sheet.Handle width={"10%"} height={5} alignSelf={"center"} />
				<Sheet.Frame>
					<SheetContent
						record={record}
						setOpenSheet={setOpenSheet}
						isDone={isDone}
						submitRecord={submitRecord}
					/>
				</Sheet.Frame>
			</Sheet>
		);
	}
);

enum RecordType {
	EyeTriage = "eye-triage",
	InitialObservation = "initial-observation",
	PreliminaryExamination = "preliminary-examination",
	VisualAcuity = "visual-acuity",
	Phorometry = "phorometry",
	ExternalEyeExamination = "external-eye-examination",
	Ophthalmoscopy = "ophthalmoscopy",
}

const SheetContent = memo(
	({
		record,
		setOpenSheet,
		isDone,
		submitRecord,
	}: {
		record: SelectRecord;
		setOpenSheet: Dispatch<SetStateAction<boolean>>;
		isDone: boolean;
		submitRecord: (recordId: string) => void;
	}) => {
		const handleRoutes = useCallback(
			(link: string) => {
				const params = {
					fullName: `${record.patientId.firstName} ${record.patientId?.lastName}`,
					patientId: record.patientId._id,
					recordId: record._id || null,
					pid: record.patientId._id,
				};
				switch (link) {
					case RecordType.EyeTriage:
						router.push({
							pathname: "/student/(pcr)/eye-triage",
							params: params,
						});
						break;
					case RecordType.InitialObservation:
						router.push({
							pathname: "/student/(pcr)/initial-observation",
							params: params,
						});
						break;
					case RecordType.PreliminaryExamination:
						router.push({
							pathname: "/student/preliminary-examination",
							params: params,
						});
						break;
					case RecordType.VisualAcuity:
						router.push({
							pathname:
								"/student/preliminary-examination/visual-acuity",
							params: params,
						});
						break;
					case RecordType.Phorometry:
						router.push({
							pathname:
								"/student/preliminary-examination/phorometry",
							params: params,
						});
						break;
					case RecordType.ExternalEyeExamination:
						router.push({
							pathname:
								"/student/preliminary-examination/external-eye-examination",
							params: params,
						});
						break;
					case RecordType.Ophthalmoscopy:
						router.push({
							pathname:
								"/student/preliminary-examination/ophthalmoscopy",
							params: params,
						});
						break;
					default:
						break;
				}
				setOpenSheet(false);
			},
			[record]
		);
		const fullName = [
			record?.patientId.firstName,
			record?.patientId.middleName,
			record?.patientId.lastName,
		]
			.filter(Boolean)
			.join(" ");

		return (
			<Sheet.ScrollView
				paddingHorizontal="$5"
				paddingVertical="$3"
				contentContainerStyle={{ gap: "$4" }}
			>
				<XStack
					justifyContent="space-between"
					alignItems="center"
					marginBottom="$1"
				>
					<SizableText
						fontWeight={900}
						color={record.isComplete ? "green" : "red"}
					>
						{record.isComplete ? "Ready to submit" : "Incomplete"}
					</SizableText>
					<SizableText fontSize={"$1"}>
						Record Created :{" "}
						{moment(record.createdAt).format("MMM D, YYYY")}
					</SizableText>
				</XStack>
				<XStack alignItems="flex-start" gap="$4">
					<Avatar size={"$7"} circular objectFit="cover">
						<Avatar.Image src={record.patientId.imageUrl} />
					</Avatar>
					<View>
						<SizableText>{fullName}</SizableText>
						<SizableText color={gray.gray10}>
							{record.patientId.patient_id}
						</SizableText>
						<SizableText color={gray.gray10}>
							Age: {record.patientId.age}
						</SizableText>
					</View>
				</XStack>
				<View gap="$3">
					<SizableText>Examinations:</SizableText>
					<RecordListItems
						record={record}
						handleRoutes={handleRoutes}
					/>
					{!isDone && (
						<SizableText color={"red"}>
							Please complete the examinatons first.
						</SizableText>
					)}
					<CustomButton
						buttonText="Submit"
						onPress={() => submitRecord(record._id)}
						disabled={!isDone}
					/>
				</View>
			</Sheet.ScrollView>
		);
	}
);

const RecordListItems = ({
	record,
	handleRoutes,
}: {
	record: SelectRecord;
	handleRoutes: (link: string) => void;
}) => {
	return (
		<View gap="$3">
			<ListItem
				bordered
				borderRadius={"$5"}
				backgroundColor={
					record.eyeTriage.isComplete ? "$green2" : "$background0"
				}
				theme={
					record.eyeTriage.isComplete ? "green_active" : "red_active"
				}
				onPress={() => handleRoutes(RecordType.EyeTriage)}
				title="Eye Triage"
				iconAfter={
					record.eyeTriage.isComplete ? (
						<CheckCircle2 color={"green"} />
					) : (
						<XCircle color={"red"} />
					)
				}
			/>
			<ListItem
				bordered
				borderRadius={"$5"}
				backgroundColor={
					record.patientCaseRecord?.isComplete
						? "$green2"
						: "$background0"
				}
				theme={
					record.patientCaseRecord?.isComplete
						? "green_active"
						: "red_active"
				}
				onPress={() => handleRoutes(RecordType.InitialObservation)}
				title="Patient Case Record"
				iconAfter={
					record.patientCaseRecord?.isComplete ? (
						<CheckCircle2 color={"green"} />
					) : (
						<XCircle color={"red"} />
					)
				}
			/>
			<ListItem
				bordered
				borderRadius={"$5"}
				backgroundColor={
					record.preliminaryExamination?.isComplete
						? "$green2"
						: "$background0"
				}
				theme={
					record.preliminaryExamination?.isComplete
						? "green_active"
						: "red_active"
				}
				onPress={() => handleRoutes(RecordType.PreliminaryExamination)}
				title="Preliminary Examination"
				iconAfter={
					record.preliminaryExamination?.isComplete ? (
						<CheckCircle2 color={"green"} />
					) : (
						<XCircle color={"red"} />
					)
				}
			/>
			<ListItem
				bordered
				borderRadius={"$5"}
				backgroundColor={
					record.visualAcuity?.isComplete ? "$green2" : "$background0"
				}
				theme={
					record.visualAcuity?.isComplete
						? "green_active"
						: "red_active"
				}
				onPress={() => handleRoutes(RecordType.VisualAcuity)}
				title="Visual Acuity"
				iconAfter={
					record.visualAcuity?.isComplete ? (
						<CheckCircle2 color={"green"} />
					) : (
						<XCircle color={"red"} />
					)
				}
			/>
			<ListItem
				bordered
				borderRadius={"$5"}
				backgroundColor={
					record.phorometry?.isComplete ? "$green2" : "$background0"
				}
				theme={
					record.phorometry?.isComplete
						? "green_active"
						: "red_active"
				}
				onPress={() => handleRoutes(RecordType.Phorometry)}
				title="Phorometry"
				iconAfter={
					record.phorometry?.isComplete ? (
						<CheckCircle2 color={"green"} />
					) : (
						<XCircle color={"red"} />
					)
				}
			/>
			<ListItem
				bordered
				borderRadius={"$5"}
				backgroundColor={
					record.externalEyeExamination?.isComplete
						? "$green2"
						: "$background0"
				}
				theme={
					record.externalEyeExamination?.isComplete
						? "green_active"
						: "red_active"
				}
				onPress={() => handleRoutes(RecordType.ExternalEyeExamination)}
				title="External Eye Examination"
				iconAfter={
					record.externalEyeExamination?.isComplete ? (
						<CheckCircle2 color={"green"} />
					) : (
						<XCircle color={"red"} />
					)
				}
			/>
			<ListItem
				bordered
				borderRadius={"$5"}
				backgroundColor={
					record.ophthalmoscopy?.isComplete
						? "$green2"
						: "$background0"
				}
				theme={
					record.ophthalmoscopy?.isComplete
						? "green_active"
						: "red_active"
				}
				onPress={() => handleRoutes(RecordType.Ophthalmoscopy)}
				title="Ophthalmoscopy"
				iconAfter={
					record.ophthalmoscopy?.isComplete ? (
						<CheckCircle2 color={"green"} />
					) : (
						<XCircle color={"red"} />
					)
				}
			/>
		</View>
	);
};

export default MyPatients;
