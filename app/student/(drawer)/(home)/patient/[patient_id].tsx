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
import { PatientRecord } from '@/interfaces/PatientRecord';
import axios from 'axios';
import { SERVER } from '@/constants/link';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

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

  type RecordType = Exclude<keyof PatientRecord, "">;

  const getRecordSubtitle = (recordType: RecordType) => {
    if (typeof patient.records[0]?.[recordType] === 'object' && patient.records[0]?.[recordType]?.isComplete) {
      return moment(patient.records[0]?.[recordType]?.updatedAt).startOf("s").fromNow()
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

      const record: PatientRecord = response.data
      print(record);

    } catch (error) {
      Alert.alert(
        "Error",
        "An error occured while exporting. Please try again later."
      )
    }
  }

  const document = (record: PatientRecord) => {
    return `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Eye Examination Report</title>
    <style>
      @page {
        size: A4;
        padding: 10mm;
      }

      body {
        font-family: Arial, sans-serif;
        font-size: 8pt;
        line-height: 1.2;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      .patient-image {
        width: 80pt;
        height: 80pt;
        object-fit: contain;
      }

      .logo {
        width: 70px;
        height: 70px;
        margin-right: 10px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 7pt;
      }
      th,
      td {
        border: .5px solid #ddd;
        padding: 3px;
        text-align: left;
        vertical-align: middle;
      }
      th {
        background-color: #f2f2f2;
      }

      .center{
        text-align: center;
      }

      .keys {
        width: fit-content;
      }

      .flex {
        display: flex;
      }

      .flex-col{
        flex-direction: column;
      }

      .justify-center {
        justify-content: center;
      }

      .items-start {
        align-items: flex-start;
      }

      .text-center {
        text-align: center;
      }

      .mb-4{
        margin-bottom: 1rem;
      }

      .font-bold {
        font-weight: bold;
      }

      .font-semibold {
        font-weight:bold;
      }

      .bg-gray-200 {
        background-color: #f2f2f2;
      }

      .mb-2{
        margin-bottom: .5rem;
      }

      .mt-2 {
        margin-top: .5rem;
      }

      .gap-2{
        gap: .5rem;
      }

      .header-title{
        line-height: .5;
        font-size: 9pt;
      }

      header{
        display: flex;
        width: 100%;
        justify-content: space-between;
      }

      .content {
        text-align: start;
        vertical-align: text-top;
      }
    </style>
  </head>
  <body>
    <header>
      <div class="flex flex-row align w-full justify-start gap-4 items-center">
        <img
          src="https://national-u.edu.ph/wp-content/uploads/2018/12/cropped-NU-Shield_FC_RGB_POS_AW.png"
          alt="National University Logo"
          class="logo"
        />
        <div class="header-title">
          <p class="font-bold">National University - Mall of Asia</p>
          <p>School of Optometry</p>
          <p>Coral Way, Pasay, Metro Manila</p>
        </div>
      </div>
      <img
        class="patient-image"
        src="https://firebasestorage.googleapis.com/v0/b/nu-vision-696f6.appspot.com/o/Patient%20Photos%2F1737880974752?alt=media&token=fa46921d-4ef1-4a88-8118-7247d6a179b3"
        alt="patient photo"
        srcset="patient photo"
      />
    </header>
    <main>
      <p class="text-center mb-4 font-bold header-title">Patient Case Record</p>
      <section class="flex gap-2">
        <table>
          <tr>
            <th colspan="2">PATIENT</th>
          </tr>
          <tr>
            <td class="keys">Name:</td>
            <td>John Mike Cuestas Alvizo</td>
          </tr>
          <tr>
            <td class="keys">Patient ID:</td>
            <td>#PID7</td>
          </tr>
          <tr>
            <td class="keys">Age:</td>
            <td>23</td>
          </tr>
          <tr>
            <td class="keys" colspan="1">Gender:</td>
            <td>Male</td>
          </tr>
          <tr>
            <td class="keys">Occupation:</td>
            <td>Frontend Developer</td>
          </tr>
          <tr>
            <td class="keys">Contact:</td>
            <td>09623175170</td>
          </tr>
          <tr>
            <td class="keys">Email:</td>
            <td>mikealvizo44@gmail.com</td>
          </tr>
        </table>
        <table>
          <tr>
            <th colspan="2">CLINICIAN</th>
          </tr>
          <tr>
            <td class="keys">Name:</td>
            <td>Camila Mora Ragos</td>
          </tr>
          <tr>
            <td class="keys">Position:</td>
            <td>Student</td>
          </tr>
          <tr>
            <td class="keys">Student ID:</td>
            <td>2022-152313</td>
          </tr>
          <tr>
            <td class="keys">Email Address:</td>
            <td>ragosmm@gmail.com</td>
          </tr>
          <tr>
            <td class="keys">Mobile No.</td>
            <td>+639623175170</td>
          </tr>
          <tr>
            <td class="keys">Date Examined:</td>
            <td>February 4, 2025</td>
          </tr>
        </table>
      </section>
      <section class="mt-2">
        <p class="font-semibold mb-2 w-full bg-gray-200 mt-2 text-center">
          EYE TRIAGE
        </p>
        <section class="flex gap-2">
          <table class="flex-2">
            <tr>
              <th>SYMPTOM</th>
              <th>Status</th>
            </tr>
            <tr>
              <td>Experiencing Symptoms</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>Pain/Itching/Discomfort</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>Flashes or Floaters</td>
              <td>No</td>
            </tr>
            <tr>
              <td>Recent Illnesses</td>
              <td>No</td>
            </tr>
            <tr>
              <td>Exposed to Chemical Irritants/Allergens</td>
              <td>No</td>
            </tr>
          </table>
        </section>
        <section>
          <p class="font-semibold mb-2 w-full bg-gray-200 mt-2 text-center">
            PRELIMINARY EXAMINATION
          </p>
          <table class="flex-4">
            <tr>
              <th colspan="1" class="w-[10%]">INITIAL OBSERVATION</th>
              <th colspan="1" class="w-[20%]">Details</th>
              <th class="w-[30%]">MEDICAL HISTORY</th>
              <th class="w-[20%]">Details</th>
            </tr>
            <tr>
              <td>Facial Symmetry</td>
              <td>symmetrical</td>
              <td>Hypersensitivity</td>
              <td>oensk</td>
            </tr>
            <tr>
              <td>Head Position</td>
              <td>tilted-left</td>
              <td>Medical Allergies</td>
              <td>ofbwow</td>
            </tr>
            <tr>
              <td>Odor</td>
              <td>pungent</td>
              <td>Medical Dosage</td>
              <td>irbdj</td>
            </tr>
            <tr>
              <td>Patient Gait</td>
              <td>non-ambulatory</td>
              <td>Medical Duration</td>
              <td>ifbdb</td>
            </tr>
            <tr>
              <td>Skin Color</td>
              <td>medium</td>
              <td>Medicine Type</td>
              <td>idb</td>
            </tr>
            <tr>
              <td>Speech</td>
              <td>normal</td>
              <td colspan="2"></td>
            </tr>
            <tr>
                <TH COLSPAN="1">COMPLAINTS/HISTORY</TH>
              <th colspan="3">Details</th>
            </tr>
            <tr>
              <td>Visual Complaints</td>
              <td colspan="3">ueheiejsjw, nds, jsbs</td>
            </tr>
            <tr>
              <td>Non-Visual Complaints</td>
              <td colspan="3">hsbsisnuwbwja, hsbsba</td>
            </tr>
            <tr>
              <td>Family Ocular History</td>
              <td colspan="3">Cataract, Glaucoma, Astigmatism</td>
            </tr>
            <tr>
              <td>Social History</td>
              <td colspan="3">Smoke (Duration: 10 days)</td>
            </tr>
            <tr>
                <TH COLSPAN="4">CONTACT LENS HISTORY</TH>
            </tr>
            <tr>
              <td colspan="1" class="w-[20%]">Brand</td>
              <td colspan="1">vcc</td>
              <td colspan="1" class="w-[20%]">Prescription</td>
              <td colspan="1">hv</td>
            </tr>
            <tr>
              <td>Dosage</td>
              <td>ihrj</td>
              <td>Type</td>
              <td>igcc</td>
            </tr>
            <tr>
              <td>Duration</td>
              <td>hg</td>
              <td>Uses Eyedrop</td>
              <td>no</td>
            </tr>
            <tr>
              <td>Frequency</td>
              <td>88</td>
              <td>Using or Wearing Contact Lens</td>
              <td>no</td>
            </tr>
          <tr>
            <TH COLSPAN="4">SPECTACLE HISTORY</TH>
          </tr>
          <tr>
            <td colspan="1" class="w-[30%] border-top-0">Duration</td>
            <td colspan="3">g</td>
          </tr>
          <tr>
            <td>Frequency</td>
            <td colspan="3">98</td>
          </tr>
          <tr>
            <td>Prescription</td>
            <td colspan="3">j</td>
          </tr>
          <tr>
            <td>Using or Wearing Spectacle</td>
            <td colspan="3">no</td>
          </tr>
        </table>
      </section>
      <section class="mt-2">
        <table>
          <tr>
            <TH COLSPAN="3">PUPILLARY DISTANCE</TH>
          </tr>
          <tr>
            <td class="w-[30]%" rowspan="2">Monocular</td>
            <th  class="w-[35%] font-semibold">Right (OD)</th>
            <th class="w-[35%] font-semibold">Left (OS)</th>
          </tr>
          <tr>
            <td  class="w-[35%]">mod</td>
            <td class="w-[35%]">mos</td>
          </tr>
          <tr>
            <td class="w-[50]%" rowspan="2">Binocular</td>
            <th class="w-[35%] font-semibold">Far</th>
            <th  class="w-[35%] font-semibold">Near</th>
          </tr>
          <tr>
            <td class="w-[35%]">mos</td>
            <td  class="w-[35%]">mod</td>
          </tr>
          <tr>
            <TH>OCULAR DOMINANCE</TH>
            <th  class="w-[35%] font-semibold">Right (OD)</th>
            <th class="w-[35%] font-semibold">Left (OS)</th>
          </tr>
          <tr>
            <td>Dominant Eye</td>
            <td>domod</td>
            <td>domos</td>
          </tr>
          <tr>
            <td>Dominant Hand</td>
            <td>hand right</td>
            <td>hand left</td>
          </tr>
          <tr>
            <td class="h-[20pt]" colspan="3" rowspan="2">Notes: {notes} </td>
          </tr>
        </table>
        <table class="mt-2">
          <tr>
            <th colspan="3">CORNEAL REFLEX</th>
          </tr>
          <tr>
            <td class="text-center">OD</td>
            <td class="text-center">OS</td>
            <td class="text-center" style="width: 50%;">Notes</td>
          </tr>
          <tr>
            <td class="text-center">
              <img src="https://national-u.edu.ph/wp-content/uploads/2018/12/cropped-NU-Shield_FC_RGB_POS_AW.png" alt="National University Logo" class="logo"/>
            </td>
            <td class="text-center">
              <img src="https://national-u.edu.ph/wp-content/uploads/2018/12/cropped-NU-Shield_FC_RGB_POS_AW.png" alt="National University Logo" class="logo"/>
            </td>
            <td style="text-align:start; vertical-align: top;">Notes</td>
          </tr>
        </table>
        <p class="my-4 font-semibold">Physiologic Diplopia: {write physiological diplopia} </p>
        <table>
          <tr>
            <th rowspan="2" colspan="1">COVER TEST</th>
            <th class="center" colspan="2">Far</th>
            <th class="center" colspan="2">Near</th>
          </tr>
          <tr>
            <th class="center">OD</th>
            <th class="center">OS</th>
            <th class="center">OD</th>
            <th class="center">OS</th>
          </tr>
          <tr>
            <td>Unilateral</td>
            <td class="center">uni far od</td>
            <td class="center">uni far os</td>
            <td class="center">uni near od</td>
            <td class="center">uni near os</td>
          </tr>
          <tr>
            <td>Alternate</td>
            <td class="center">alter far od</td>
            <td class="center">alter far os</td>
            <td class="center">alter near od</td>
            <td class="center">alter near os</td>
          </tr>
          <tr>
            <td colspan="5">Notes: {notes here}</td>
          </tr>
        </table>

        <table class="mt-2">
          <tr>
            <th colspan="3" class="text-center">PUPILLARY FUNCTION</th>
          </tr>
          <tr>
            <th class="text-center">Direct</th>
            <th class="text-center">Indirect</th>
            <th class="text-center">Notes</th>
          </tr>
          <tr>
            <td class="text-center">direct content</td>
            <td class="text-center">indirect content</td>
            <td class="text-center">notes content</td>
          </tr>
        </table>
      </section>
      <section class="flex justify-between gap-2 mt-2">
        <table style="width: 200%;">
          <tr>
            <th colspan="2">OCULAR MOTILITY</th>
          </tr>
          <tr>
            <td class="text-center">OD</td>
            <td class="text-center">OS</td>
          </tr>
          <tr>
            <td class="text-center">
              <img src="https://national-u.edu.ph/wp-content/uploads/2018/12/cropped-NU-Shield_FC_RGB_POS_AW.png" alt="National University Logo" class="logo"/>
            </td>
            <td class="text-center">
              <img src="https://national-u.edu.ph/wp-content/uploads/2018/12/cropped-NU-Shield_FC_RGB_POS_AW.png" alt="National University Logo" class="logo"/>
            </td>
          </tr>
        </table>
        <table>
          <tr>
            <th>MOTILITY TEST</th>
          </tr>
          <tr>
            <td class="content">• Broad H: ${record.preliminaryExamination.motilityTest.version.broadH}<br /><br />• Saccades: ${record.preliminaryExamination.motilityTest.version.saccades} <br/><br />• Pursuit: ${record.preliminaryExamination.motilityTest.version.pursuit}</td>
          </tr>
        </table>
        <table>
          <tr>
            <th colspan="2">STEREOPSIS</th>
          </tr>
          <tr>
            <td style="text-align: start; vertical-align: text-top;" colspan="2">stereopsis</td>
          </tr>
          <tr>
            <th colspan="2">COLOR VISION (Ishihara)</th>
          </tr>
          <tr>
            <th class="text-center">OD</th>
            <th class="text-center">OS</th>
          </tr>
          <tr>
            <td class="text-center">od</td>
            <td class="text-center">os</td>
          </tr>
        </table>
      </section>
      <section class="mt-2">
        <table>
          <tr>
            <th class="text-center" colspan="4">NEAR POINT ACCOMMODATION</th>
          </tr>
          <tr>
            <td class="font-bold">Trial</td>
            <td class="text-center font-bold">OD</td>
            <td class="text-center font-bold">OS</td>
            <td class="text-center font-bold">OU</td>
          </tr>            
          </tr>
            <td>1st Trial</td>
            <td class="text-center">od1</td>
            <td class="text-center">os1</td>
            <td class="text-center">ou1</td>
          </tr>
          <tr>
            <td>2nd Trial</td>
            <td class="text-center">od2</td>
            <td class="text-center">os2</td>
            <td class="text-center">ou2</td>
          </tr>
          <tr>
            <td>3rd Trial</td>
            <td class="text-center">od3</td>
            <td class="text-center">os3</td>
            <td class="text-center">ou3</td>
          </tr>
        </table>
        <div class="flex gap-2">
        <table class="mt-2">
          <tr>
            <th colspan="2">NEAR POINT CONVERGENCE</th>
          </tr>
          <tr>
            <td>Trial</td>
            <td class="text-center font-bold">OU</td>
          </tr>
          <tr>
            <td>1st Trial</td>
            <td>ou1</td>
          </tr>
          <tr>
            <td>2nd Trial</td>
            <td>ou2</td>
          </tr>
          <tr>
            <td>3rd Trial</td>
            <td>ou3</td>
          </tr>
        </table>
        <div style="width: 100%; display: flex; gap: 4rem; justify-content: center; font-size: 10pt;">
          <div class="flex gap-2" style="align-items: center; justify-content: center;">
            <input type="checkbox" name="subjective" id="subjective" >
            <label for="subjective">Subjective</label>
          </div>
          <div class="flex gap-2" style="align-items: center; justify-content: center;">
            <input type="checkbox" name="objective" id="objective">
            <label for="objective">Objective</label>
          </div>
        </div>
      </div>
      </section>
      <section class="mt-2">
        <table>
          <tr>
            <th colspan="4" class="text-center">VISUAL ACUITY</th>
          </tr>
          <tr>
            <th></th>
            <th class="text-center" style="flex: 1;">Unaided</th>
            <th class="text-center" style="flex: 1;">Aided</th>
            <th class="text-center" style="flex: 1;">Pinhole</th>
          </tr>
          <tr>
            <th>Distance</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
          <tr>
            <td>OD</td>
            <td class="text-center">unaided od</td>
            <td class="text-center">adided od</td>
            <td class="text-center">pinhole od</td>
          </tr>
          <tr>
            <td>OS</td>
            <td class="text-center">unaided os</td>
            <td class="text-center">adided os</td>
            <td class="text-center">pinhole os</td>
          </tr>
          <tr>
            <td>OU</td>
            <td class="text-center">unaided ou</td>
            <td class="text-center">adided ou</td>
            <td class="text-center">pinhole ou</td>
          </tr>
          <tr>
            <th>Near</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
          <tr>
            <td>OD</td>
            <td class="text-center">unaided ou</td>
            <td class="text-center">adided ou</td>
            <td class="text-center">pinhole ou</td>
          </tr>
          <tr>
            <td>OS</td>
            <td class="text-center">unaided ou</td>
            <td class="text-center">adided ou</td>
            <td class="text-center">pinhole ou</td>
          </tr>
          <tr>
            <td>OU</td>
            <td class="text-center">unaided ou</td>
            <td class="text-center">adided ou</td>
            <td class="text-center">pinhole ou</td>
          </tr>
          <tr>
            <th colspan="4">Notes</th>
          </tr>
          <tr>
            <td colspan="4">{Note}</td>
          </tr>
        </table>
      </section>
      <section class="mt-2">
        <table>
          <tr>
            <th colspan="5" class="text-center">REFRACTION</th>
          </tr>
          <tr>
            <td style="width: 25%;">OD</td>
            <td>Dsph = {dsph}</td>
            <td>Dcyl x {dcyl x}</td>
            <td>VA x {va}</td>
          </tr>
          <tr>
            <td style="width: 25%;">OS</td>
            <td>Dsph = {dsph}</td>
            <td>Dcyl x {dcyl x}</td>
            <td>VA x {va}</td>
          </tr>
          <tr>
            <th colspan="2">Add</th>
            <th colspan="2">Reading Range</th>
          </tr>
          <tr>
            <td colspan="2">add content</td>
            <td colspan="2">reading range</td>
          </tr>
          <tr>
            <th colspan="2">Modifications</th>
            <th>Keratometry</th>
            <th>Autorefractometer</th>
          </tr>
          <tr>
            <td colspan="2">Modification details</td>
            <td>Keratometry details</td>
            <td>Autorefractometer details</td>
          </tr>
          <tr>
            <th colspan="4">FINAL RX</th>
          </tr>
          <tr>
            <td colspan="4" style="background-color:beige;text-transform: uppercase; padding-left: 1rem;">this is the final recommendation</td>
          </tr>
          <tr>
            <th colspan="2">DIAGNOSIS</th>
            <th colspan="2">RECOMMENDATION</th>
          </tr>
          <tr>
            <td colspan="2">diagnosis</td>
            <td colspan="2">recomm</td>
          </tr>
          <tr>
            <td colspan="4" style="text-align: end; padding-right: 1rem;"><span style="font-weight: bold; margin-right: .5rem;">Refracted by:</span>{John MIke Alvizo}</td>
          </tr>
        </table>
      </section>
      <section class="mt-2">
        <p class="font-semibold mb-2 w-full bg-gray-200 mt-4 text-center">
          PHOROMETRY
        </p>
        <table>
          <tr>
            <th colspan="4" class="text-center">PHORIA</th>
          </tr>
          <tr>
            <th class="text-center" colspan="2" style="width: 50%;">Distance</th>
            <th class="text-center" colspan="2">Near</th>
          </tr>
          <tr>
            <td colspan="2">HORIZONTAL (VT# 3): <span class="font-bold">{hvt3}</span></td>
            <td colspan="2">HORIZONTAL (VT# 13A): <span class="font-bold">{hvt13a}</span></td>
          </tr>
          <tr>
            <td colspan="2">HORIZONTAL (VT# 8): <span class="font-bold">{hvt8}</span></td>
            <td colspan="2">HORIZONTAL (VT# 13B): <span class="font-bold">{hvt13b}</span></td>
          </tr>
          <tr>
            <td colspan="2">VERTICAL (VT# 12): <span class="font-bold">{vvt12}</span></td>
            <td colspan="2">VERTICAL (VT# 18): <span class="font-bold">{vvt18}</span></td>
          </tr>
          <tr>
            <th colspan="4" class="text-center">DUCTION</th>
          </tr>
          <tr>
            <th class="text-center" colspan="2" style="width: 50%;">Distance</th>
            <th class="text-center" colspan="2">Near</th>
          </tr>
          <tr>
            <td colspan="2"><sup>s</sup>BD: <span class="font-bold">OD {__/__}&nbsp;&nbsp;OS {__/__}</span></td>
            <td colspan="2"><sup>s</sup>BU: <span class="font-bold">OD {__/__}&nbsp;&nbsp;OS {__/__}</span></td>
          </tr>
          <tr>
            <td colspan="2"><sup>I</sup>BD: <span class="font-bold">OD {__/__}&nbsp;&nbsp;OS {__/__}</span></td>
            <td colspan="2"><sup>I</sup>BU: <span class="font-bold">OD {__/__}&nbsp;&nbsp;OS {__/__}</span></td>
          </tr>
          <tr>
            <th colspan="4" class="text-center">VERGENCE</th>
          </tr>
          <tr>
            <th class="text-center" colspan="2" style="width: 50%;">Distance</th>
            <th class="text-center" colspan="2">Near</th>
          </tr>
          <tr>
            <td colspan="2">BO (VT# 9): <span class="font-bold">{hvt9}</span></td>
            <td colspan="2">BO (VT# 16A): <span class="font-bold">{hvt13a}</span></td>
          </tr>
          <tr>
            <td colspan="2">BO (VT# 10): <span class="font-bold">{hvt8}</span></td>
            <td colspan="2">BO (VT# 16B): <span class="font-bold">{hvt13b}</span></td>
          </tr>
          <tr>
            <td colspan="2">BI (VT# 11): <span class="font-bold">{vvt12}</span></td>
            <td colspan="2">BI (VT# 17A): <span class="font-bold">{vvt18}</span></td>
          </tr>
          <tr>
            <td></td>
            <td colspan="2">BI (VT# 17B): <span class="font-bold">{vvt18}</span></td>
          </tr>
          <tr>
            <th colspan="4" class="text-center">CROSS-CYLINDER</th>
          </tr>
          <tr>
            <th class="text-center" colspan="2" style="width: 50%;">Distance</th>
            <th class="text-center" colspan="2">Near</th>
          </tr>
          <tr>
            <td colspan="2">Dissociated: <span class="font-bold">OD {__/__}</span></td>
            <td colspan="2">Binocular: <span class="font-bold">OS {__/__}</span></td>
          </tr>
          <tr>
            <td colspan="2">Phoria: <span class="font-bold">OD {__/__}</span></td>
            <td colspan="2">Phoria: <span class="font-bold">OS {__/__}</span></td>
          </tr>
        </table>
      </section>
    </main>
  </body>
</html>

    `
  }

  const print = async (record: PatientRecord) => {
    await Print.printAsync({
      html: document(record),
      printerUrl: selectedPrinter?.url
    })
  };

  const printToFile = async (record: PatientRecord) => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html: document(record) });
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
