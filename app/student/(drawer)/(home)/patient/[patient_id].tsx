import Title from '@/components/Title';
import View from '@/components/View';
import { usePatient } from '@/hooks/usePatient';
import { CheckCircle, ChevronRight, File, UserRound } from '@tamagui/lucide-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import moment from 'moment';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { Avatar, ListItem, SizableText, XStack, YStack } from 'tamagui';
import Animated, { FadeIn } from 'react-native-reanimated';
import { theme } from '@/theme/theme';
import CustomButton from '@/components/CustomButton';
import axios from 'axios';
import { SERVER } from '@/constants/link';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { EyeExamReport as IEyeExamReport } from '@/interfaces/PatientRecord';
import EyeExamReport from '@/constants/PDFTemplates';

const ViewPatient = () => {
  const { patient_id }: any = useLocalSearchParams();
  const { error, patient, fetchPatientById } = usePatient();
  const [refreshing, setRefreshing] = useState(false);
  const [disable, setDisable] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState<any>();


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
      case "ophthalmoscopy":
        router.push({ pathname: "/student/preliminary-examination/ophthalmoscopy", params: params });
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


  const getRecordSubtitle = (recordType: any) => {
    if (typeof patient.records[0]?.[recordType] === 'object' && patient.records[0]?.[recordType]?.isComplete) {
      return "updated "+ moment(patient.records[0]?.[recordType]?.updatedAt).startOf("s").fromNow()
    } else {
      return "Start"
    }
  };

  const exportRecord = async () => {
    console.log("export")
    console.log(`record id: ${patient.records[0]._id}`)

    try {
      const recordId = patient.records[0]._id;
      const response = await axios.get(`${SERVER}/record/${recordId}`)

      const record: IEyeExamReport = response.data
      print(record);

    } catch (error) {
      Alert.alert(
        "Error",
        "An error occured while exporting. Please try again later."
      )
    }
  }

  

  const print = async (record: IEyeExamReport) => {
    await Print.printAsync({
      html: EyeExamReport(record),
      printerUrl: selectedPrinter?.url
    })
  };

  const printToFile = async (record: IEyeExamReport) => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html: EyeExamReport(record) });
    console.log('File has been saved to:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  };

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
          <Title text={`Full Name`} />
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
        <View padded gap="$2">
          <Title text='RECORD' />
          <ListItem
            disabled={disable}
            bordered
            borderRadius={"$5"}
            backgroundColor={patient?.records[0]?.eyeTriage?.isComplete ? "$green2" : "$bacground0"}
            theme={patient?.records[0]?.eyeTriage?.isComplete ? "green_active" : null}
            onPress={() => handleRoutes("eye-triage")}
            pressTheme
            title="Eye Triage"
            subTitle={getRecordSubtitle("eyeTriage")}
            iconAfter={patient?.records[0]?.eyeTriage?.isComplete ? <CheckCircle color={"green"} /> : <ChevronRight />}
          />
          <ListItem
            disabled={disable}
            bordered
            borderRadius={"$5"}
            backgroundColor={patient?.records[0]?.patientCaseRecord?.isComplete ? "$green2" : "$bacground0"}
            theme={patient?.records[0]?.patientCaseRecord?.isComplete ? "green_active" : null}
            onPress={() => handleRoutes("initial-observation")}
            pressTheme
            title="Patient Case Record"
            subTitle={getRecordSubtitle("patientCaseRecord")}
            iconAfter={patient?.records[0]?.patientCaseRecord?.isComplete ? <CheckCircle color={"green"} /> : <ChevronRight />}
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
            subTitle={getRecordSubtitle("preliminaryExamination")}
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
            subTitle={getRecordSubtitle("visualAcuity")}
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
            subTitle={getRecordSubtitle("phorometry")}
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
            subTitle={getRecordSubtitle("externalEyeExamination")}
            iconAfter={patient?.records[0]?.externalEyeExamination?.isComplete ? <CheckCircle color={"green"} /> : <ChevronRight />}
          />
          <ListItem
            disabled={disable}
            bordered
            borderRadius={"$5"}
            backgroundColor={patient?.records[0]?.ophthalmoscopy?.isComplete ? "$green2" : "$bacground0"}
            theme={patient?.records[0]?.ophthalmoscopy?.isComplete ? "green_active" : null}
            onPress={() => handleRoutes("ophthalmoscopy")}
            pressTheme
            title="Ophthalmoscopy"
            subTitle={getRecordSubtitle("ophthalmoscopy")}
            iconAfter={patient?.records[0]?.ophthalmoscopy?.isComplete ? <CheckCircle color={"green"} /> : <ChevronRight />}
          />
        </View>

      </Animated.ScrollView>
      <CustomButton buttonText='Export' icon={<File />} onPress={exportRecord} margin="$3" />
    </View>
  );
};

export default ViewPatient;
