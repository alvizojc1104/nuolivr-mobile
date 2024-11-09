import Title from '@/components/Title';
import View from '@/components/View';
import { usePatient } from '@/hooks/usePatient';
import { CheckCircle, ChevronRight, UserRound } from '@tamagui/lucide-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import moment from 'moment';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl } from 'react-native';
import { Avatar, ListItem, SizableText, XStack, YStack } from 'tamagui';
import Animated, { FadeIn } from 'react-native-reanimated';
import { theme } from '@/theme/theme';

const ViewPatient = () => {
	const { patient_id }: any = useLocalSearchParams();
	const { error, patient, fetchPatientById } = usePatient();
	const [refreshing, setRefreshing] = useState(false);
	const [disable, setDisable] = useState(false);

	const fullName = useMemo(() => {
		return `${patient?.firstName} ${patient?.middleName || ''} ${patient?.lastName || ''}`.trim();
	}, [patient]);

	useFocusEffect(
		useCallback(() => {
			setDisable(false);
			fetchPatientById(patient_id)
			return () => {
				setRefreshing(false);
			};
		}, [patient_id]) // Dependency on patient_id ensures it re-fetches if it changes
	);
	const refreshPage = async () => {
		setRefreshing(true);
		await fetchPatientById(patient_id);
		setRefreshing(false);
	};

	const handleRoutes = useCallback((link: string) => {
		const params = {
			fullName: `${patient?.firstName} ${patient?.lastName}`,
			patientId: patient?._id,
			recordId: patient?.records[0]?._id || null,
			pid: patient?.patient_id
		};
		switch (link) {
			case "eye-triage":
				router.push({ pathname: "/student/(pcr)/eye-triage", params: params });
				setDisable(true);
				break;
			case "initial-observation":
				router.push({ pathname: "/student/(pcr)/initial-observation", params: params });
				setDisable(true);
				break;
			case "preliminary-examination":
				router.push({ pathname: "/student/preliminary-examination", params: params });
				setDisable(true);
				break;
			case "visual-acuity":
				router.push({ pathname: "/student/preliminary-examination/visual-acuity", params: params });
				setDisable(true);
				break;
			case "phorometry":
				router.push({ pathname: "/student/preliminary-examination/phorometry", params: params });
				setDisable(true);
				break;
			case "external-eye-examination":
				router.push({ pathname: "/student/preliminary-examination/external-eye-examination", params: params });
				setDisable(true);
				break;
			default:
				break;
		}
	}, [patient]);

	if (error) {
		return (
			<View flex={1} alignItems='center' justifyContent='center'>
				<SizableText color="red">{`Error: ${error}`}</SizableText>
			</View>
		);
	}

	if (!patient) {
		return (
			<View flex={1} alignItems='center' paddingTop="$4">
				<ActivityIndicator size={"large"} color={theme.cyan10} />
			</View>
		)
	}

	return (
		<View flex={1}>
			<Animated.ScrollView
				entering={FadeIn}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={refreshPage} />
				}
				style={{ flex: 1 }}
				contentContainerStyle={{ gap: 2 }}
			>
				<View padded>
					<XStack alignItems='center' gap="$5">
						<Avatar borderRadius={"$4"} size={"$10"}>
							{patient ? (
								<Avatar.Image src={patient?.imageUrl} objectFit='contain' />
							) : (
								<UserRound />
							)}
						</Avatar>
						<YStack flex={1}>
							<SizableText>{fullName}</SizableText>
							<SizableText size={"$2"} color={"$gray10"} adjustsFontSizeToFit>Patient ID: {patient?.patient_id}</SizableText>
							<SizableText size={"$2"} color={"$gray10"}>Age: {patient?.age}</SizableText>
							<SizableText size={"$2"} color={"$gray10"}>Added on: {moment(patient?.createdAt).format("MMMM D, YYYY")}</SizableText>
						</YStack>
					</XStack>
				</View>
				<View padded>
					<Title text={`FIRST NAME, MIDDLE NAME, LAST NAME`} />
					<SizableText mb="$3">{fullName}</SizableText>
					<Title text='Birthday' />
					<SizableText mb="$3">{moment(patient?.birthdate).format("MMMM D, YYYY")}</SizableText>
					<Title text='Occupation/Course' />
					<SizableText mb="$3">{patient?.occupationOrCourse}</SizableText>
					<Title text='Hobbies/Avocation' />
					<SizableText mb="$3">{patient?.hobbiesOrAvocation}</SizableText>
					<Title text='Address' />
					<SizableText mb="$3">{patient?.contactInformation.fullAddress}</SizableText>
					<Title text='Email' />
					<SizableText mb="$3">{patient?.contactInformation.emailAddress}</SizableText>
					<Title text='Mobile Number' />
					<SizableText>{patient?.contactInformation.mobile}</SizableText>
				</View>
				<View padded gap="$3">
					<Title text='RECORD' />
					<ListItem
						disabled={disable}
						bordered
						borderRadius={"$5"}
						backgroundColor={patient?.records[0]?.eyeTriage.isComplete ? "$green2" : "$bacground0"}
						theme={patient?.records[0]?.eyeTriage.isComplete ? "green_active" : null}
						onPress={() => handleRoutes("eye-triage")}
						pressTheme
						title="Eye Triage"
						iconAfter={patient?.records[0]?.eyeTriage.isComplete ? <CheckCircle color={"green"} /> : <ChevronRight />}
					/>
					<ListItem
						disabled={disable}
						bordered
						borderRadius={"$5"}
						backgroundColor={patient?.records[0]?.patientCaseRecord.isComplete ? "$green2" : "$bacground0"}
						theme={patient?.records[0]?.patientCaseRecord.isComplete ? "green_active" : null}
						onPress={() => handleRoutes("initial-observation")}
						pressTheme
						title="Initial Observation"
						iconAfter={patient?.records[0]?.patientCaseRecord.isComplete ? <CheckCircle color={"green"} /> : <ChevronRight />}
					/>
					<ListItem
						disabled={disable}
						bordered
						borderRadius={"$5"}
						backgroundColor={patient?.records[0]?.preliminaryExamination?.isComplete ? "$green2" : "$bacground0"}
						theme={patient?.records[0]?.preliminaryExamination?.isComplete ? "green_active" : null}
						onPress={() => handleRoutes("preliminary-examination")}
						pressTheme
						title="Preliminary Examination"
						iconAfter={patient?.records[0]?.preliminaryExamination?.isComplete ? <CheckCircle color={"green"} /> : <ChevronRight />}
					/>
					<ListItem
						disabled={disable}
						bordered
						borderRadius={"$5"}
						backgroundColor={patient?.records[0]?.visualAcuity?.isComplete ? "$green2" : "$bacground0"}
						theme={patient?.records[0]?.visualAcuity?.isComplete ? "green_active" : null}
						onPress={() => handleRoutes("visual-acuity")}
						pressTheme
						title="Visual Acuity"
						iconAfter={patient?.records[0]?.visualAcuity?.isComplete ? <CheckCircle color={"green"} /> : <ChevronRight />}
					/>
					<ListItem
						disabled={disable}
						bordered
						borderRadius={"$5"}
						backgroundColor={patient?.records[0]?.phorometry?.isComplete ? "$green2" : "$bacground0"}
						theme={patient?.records[0]?.phorometry?.isComplete ? "green_active" : null}
						onPress={() => handleRoutes("phorometry")}
						pressTheme
						title="Phorometry"
						iconAfter={patient?.records[0]?.phorometry?.isComplete ? <CheckCircle color={"green"} /> : <ChevronRight />}
					/>
					<ListItem
						disabled={disable}
						bordered
						borderRadius={"$5"}
						backgroundColor={patient?.records[0]?.externalEyeExamination?.isComplete ? "$green2" : "$bacground0"}
						theme={patient?.records[0]?.externalEyeExamination?.isComplete ? "green_active" : null}
						onPress={() => handleRoutes("external-eye-examination")}
						pressTheme
						title="External Eye Examination"
						iconAfter={patient?.records[0]?.externalEyeExamination?.isComplete ? <CheckCircle color={"green"} /> : <ChevronRight />}
					/>
				</View>
			</Animated.ScrollView>
		</View>
	);
};

export default ViewPatient;
