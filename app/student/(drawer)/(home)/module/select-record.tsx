import Loading from "@/components/Loading";
import { SERVER } from "@/constants/link";
import { SelectRecord } from "@/interfaces/select-record";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { router, useGlobalSearchParams } from "expo-router";
import moment from "moment";
import React, { useEffect, useState, memo, Dispatch, SetStateAction, FC, useCallback } from "react";
import { RefreshControl, TouchableNativeFeedback } from "react-native";
import { Avatar, Heading, ListItem, ScrollView, Sheet, SizableText, View, XStack } from "tamagui";
import { View as RNView } from 'react-native'
import { CheckCircle, ChevronRight, Dot, PlusCircle } from "@tamagui/lucide-icons";
import { gray } from "@/theme/theme";
import CustomButton from "@/components/CustomButton";

const MyPatients = () => {
	const { user } = useUser();
	const { moduleId } = useGlobalSearchParams();
	const [records, setRecords] = useState<SelectRecord[] | null>(null);
	const [refreshing, setRefreshing] = useState(false);
	const [openSheet, setOpenSheet] = useState<boolean>(false)
	useEffect(() => {
		fetchData();
	}, [user?.id]);

	const fetchData = async () => {
		try {
			const { data } = await axios.get(`${SERVER}/record/get/all`, {
				params: { clinicianId: user?.id },
			});
			setRecords(data);
		} catch (error: any) {
			setRecords(error.response.data.message);
		}
	};

	const refreshPage = async () => { };

	const submitRecord = async (recordId: string) => {
		try {
			const body = {
				moduleId: moduleId,
				clinicianId: user?.publicMetadata._id,
				recordId: recordId,
			};
			const { data } = await axios.post(`${SERVER}/submission/new`);
			console.log(data);
			router.back();
		} catch (error: any) {
			console.log(error.response.data.message);
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
								onPress={() => setOpenSheet(!openSheet)}
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
											<SizableText>{fullName}</SizableText>
											<Dot color={`${record.isComplete ? "green" : "red"}`} />
										</XStack>
									}
									subTitle={`added ${moment(
										record?.createdAt
									).startOf('s').fromNow()}`}
									iconAfter={<SizableText color={`${record.isComplete ? "green" : "red"}`}>View</SizableText>}
								/>
							</TouchableNativeFeedback>
							<RecordDetailsBottomSheet openSheet={openSheet} setOpenSheet={setOpenSheet} record={record} />
						</RNView>

					);
				})}
		</ScrollView>
	);
};

const RecordDetailsBottomSheet = memo(({ record, openSheet, setOpenSheet }: { record: SelectRecord, openSheet: boolean, setOpenSheet: Dispatch<SetStateAction<boolean>> }) => {
	return (
		<Sheet
			modal
			dismissOnOverlayPress
			snapPointsMode="percent"
			snapPoints={[80, 50, 30]}
			animation={"quicker"}
			open={openSheet}
			onOpenChange={setOpenSheet}>
			<Sheet.Overlay
				animation="quicker"
				bg="$shadow2"
				enterStyle={{ opacity: 0 }}
				exitStyle={{ opacity: 0 }}
			/>
			<Sheet.Handle width={"10%"} height={5} alignSelf={"center"} />
			<Sheet.Frame>
				<SheetContent record={record} setOpenSheet={setOpenSheet} />
			</Sheet.Frame>
		</Sheet>
	)
});

enum RecordType {
	EyeTriage = "eye-triage",
	InitialObservation = "initial-observation",
	PreliminaryExamination = "preliminary-examination",
	VisualAcuity = "visual-acuity",
	Phorometry = "phorometry",
	ExternalEyeExamination = "external-eye-examination",
	Ophthalmoscopy = "ophthalmoscopy"
}


const SheetContent = memo(({ record, setOpenSheet }: { record: SelectRecord, setOpenSheet: Dispatch<SetStateAction<boolean>> }) => {
	const handleRoutes = useCallback((link: string) => {
		const params = {
			fullName: `${record.patientId.firstName} ${record.patientId?.lastName}`,
			patientId: record.patientId._id,
			recordId: record.patientId.records[0]?._id || null,
			pid: record.patientId._id
		};
		switch (link) {
			case RecordType.EyeTriage:
				router.push({ pathname: "/student/(pcr)/eye-triage", params: params });
				break;
			case RecordType.InitialObservation:
				router.push({ pathname: "/student/(pcr)/initial-observation", params: params });
				break;
			case RecordType.PreliminaryExamination:
				router.push({ pathname: "/student/preliminary-examination", params: params });
				break;
			case RecordType.VisualAcuity:
				router.push({ pathname: "/student/preliminary-examination/visual-acuity", params: params });
				break;
			case RecordType.Phorometry:
				router.push({ pathname: "/student/preliminary-examination/phorometry", params: params });
				break;
			case RecordType.ExternalEyeExamination:
				router.push({ pathname: "/student/preliminary-examination/external-eye-examination", params: params });
				break;
			case RecordType.Ophthalmoscopy:
				router.push({ pathname: "/student/preliminary-examination/ophthalmoscopy", params: params });
				break;
			default:
				break;
		}
		setOpenSheet(false)
	}, [record]);
	const fullName = [
		record?.patientId.firstName,
		record?.patientId.middleName,
		record?.patientId.lastName,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<Sheet.ScrollView paddingHorizontal="$5" paddingVertical="$3" contentContainerStyle={{gap:"$4"}}>
			<XStack justifyContent="space-between" alignItems="center" marginBottom="$1">
				<SizableText fontWeight={900}>Patient Record</SizableText>
				<SizableText fontSize={"$1"}>Submitted: {moment(record.createdAt).format("MMM D, YYYY")}</SizableText>
			</XStack>
			<XStack alignItems="flex-start" gap="$4">
				<Avatar size={"$7"} circular objectFit="cover">
					<Avatar.Image src={record.patientId.imageUrl} />
				</Avatar>
				<View>
					<SizableText >{fullName}</SizableText>
					<SizableText color={gray.gray10}>{record.patientId.patient_id}</SizableText>
					<SizableText color={gray.gray10}>Age: {record.patientId.age}</SizableText>
				</View>
			</XStack>
			<View gap="$3" >
				<SizableText>Examinations:</SizableText>
				<RecordListItems record={record} handleRoutes={handleRoutes} />
				{!record.isComplete && <SizableText color={"red"}>Please complete the examinatons first.</SizableText>}
				<CustomButton buttonText="Submit" onPress={() => alert(`submit ${record._id}`)} disabled={!record.isComplete} />
			</View>
		</Sheet.ScrollView>
	)
})

const RecordListItems = ({ record, handleRoutes, }: { record: SelectRecord, handleRoutes: (link: string) => void }) => {
	return (
		<View gap="$3">
			<ListItem
				bordered
				borderRadius={"$5"}
				backgroundColor={record.eyeTriage.isComplete ? "$green2" : "$background0"}
				theme={record.eyeTriage.isComplete ? "green_active" : "red_active"}
				onPress={() => handleRoutes(RecordType.EyeTriage)}
				title="Eye Triage"
				iconAfter={record.eyeTriage.isComplete ? <SizableText color={"green"}>Done</SizableText> : <SizableText color={"red"}>Incomplete</SizableText>}
			/>
			<ListItem
				bordered
				borderRadius={"$5"}
				backgroundColor={record.patientId?.records[0]?.patientCaseRecord?.isComplete ? "$green2" : "$background0"}
				theme={record.patientId.records[0]?.patientCaseRecord?.isComplete ? "green_active" : "red_active"}
				onPress={() => handleRoutes(RecordType.InitialObservation)}
				title="Patient Case Record"
				iconAfter={record.patientId.records[0]?.patientCaseRecord?.isComplete ? <SizableText color={"green"}>Done</SizableText> : <SizableText color={"red"}>Incomplete</SizableText>}
			/>
			<ListItem
				bordered
				borderRadius={"$5"}
				backgroundColor={record.patientId.records[0]?.preliminaryExamination?.isComplete ? "$green2" : "$background0"}
				theme={record.patientId.records[0]?.preliminaryExamination?.isComplete ? "green_active" : "red_active"}
				onPress={() => handleRoutes(RecordType.PreliminaryExamination)}
				title="Preliminary Examination"
				iconAfter={record.patientId.records[0]?.preliminaryExamination?.isComplete ? <SizableText color={"green"}>Done</SizableText> : <SizableText color={"red"}>Incomplete</SizableText>}
			/>
			<ListItem
				bordered
				borderRadius={"$5"}
				backgroundColor={record.patientId.records[0]?.visualAcuity?.isComplete ? "$green2" : "$background0"}
				theme={record.patientId.records[0]?.visualAcuity?.isComplete ? "green_active" : "red_active"}
				onPress={() => handleRoutes(RecordType.VisualAcuity)}
				title="Visual Acuity"
				iconAfter={record.patientId.records[0]?.visualAcuity?.isComplete ? <SizableText color={"green"}>Done</SizableText> : <SizableText color={"red"}>Incomplete</SizableText>}
			/>
			<ListItem
				bordered
				borderRadius={"$5"}
				backgroundColor={record.patientId.records[0]?.phorometry?.isComplete ? "$green2" : "$background0"}
				theme={record.patientId.records[0]?.phorometry?.isComplete ? "green_active" : "red_active"}
				onPress={() => handleRoutes(RecordType.Phorometry)}
				title="Phorometry"
				iconAfter={record.patientId.records[0]?.phorometry?.isComplete ? <SizableText color={"green"}>Done</SizableText> : <SizableText color={"red"}>Incomplete</SizableText>}
			/>
			<ListItem
				bordered
				borderRadius={"$5"}
				backgroundColor={record.patientId.records[0]?.externalEyeExamination?.isComplete ? "$green2" : "$background0"}
				theme={record.patientId.records[0]?.externalEyeExamination?.isComplete ? "green_active" : "red_active"}
				onPress={() => handleRoutes(RecordType.ExternalEyeExamination)}
				title="External Eye Examination"
				iconAfter={record.patientId.records[0]?.externalEyeExamination?.isComplete ? <SizableText color={"green"}>Done</SizableText> : <SizableText color={"red"}>Incomplete</SizableText>}
			/>
			<ListItem
				bordered
				borderRadius={"$5"}
				backgroundColor={record.patientId.records[0]?.ophthalmoscopy?.isComplete ? "$green2" : "$background0"}
				theme={record.patientId.records[0]?.ophthalmoscopy?.isComplete ? "green_active" : "red_active"}
				onPress={() => handleRoutes(RecordType.Ophthalmoscopy)}
				title="Ophthalmoscopy"
				iconAfter={record.patientId.records[0]?.ophthalmoscopy?.isComplete ? <SizableText color={"green"}>Done</SizableText> : <SizableText color={"red"}>Incomplete</SizableText>}
			/>
		</View>


	)
}

export default MyPatients;
