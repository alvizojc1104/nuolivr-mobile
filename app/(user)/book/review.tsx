import { View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Heading,
  Label,
  ScrollView,
  Separator,
  SizableText,
  TextArea,
  XStack,
  YGroup,
  YStack,
} from "tamagui";
import { RadioGroup } from "tamagui";
import { CalendarCheck, CalendarClock } from "@tamagui/lucide-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment"
import Spinner from "react-native-loading-spinner-overlay";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";

interface PatientData {
  user_id: any;
  fullName: string;
  age: string;
  phoneNumber: string;
  occupation: string;
  gender: string;
  symptoms: string;
  isTakingMedication: boolean;
  medicationsIfAny: string;
  isDrugAllergy: boolean;
  drugAllergyIfAny: string;
  appointment_date?: string;
  appointment_time?: string;
}

const BookAppointment = () => {
  const { isLoaded, user } = useUser()
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [isLoading, setIsLoading] = useState(false)


  if (!isLoaded) return

  useEffect(() => {
    setIsLoading(true)
    const getPatientData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("@patientData");
        if (jsonValue != null) {
          const parsedData = JSON.parse(jsonValue);
          setPatientData({ ...parsedData, user_id: user?.id });
          setIsLoading(false)
        } else {
          // Set default values if nothing is stored in AsyncStorage
          setPatientData({
            user_id: user?.id,
            fullName: "",
            age: "",
            phoneNumber: "",
            occupation: "",
            gender: "",
            symptoms: "",
            isTakingMedication: false,
            medicationsIfAny: "",
            isDrugAllergy: false,
            drugAllergyIfAny: "",
            appointment_date: "",
            appointment_time: "",
          });
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load patient data");
      }

    };

    getPatientData();
  }, []);

  const onSubmitAppointmentRequest = async () => {
    if (!isLoaded) {
      Alert.alert("Error", "Clerk Error")
      return
    }
    setIsLoading(true)
    try {
      const body = {
        user_id: user?.id,
        fullName: patientData?.fullName,
        age: patientData?.age,
        phoneNumber: patientData?.phoneNumber,
        occupation: patientData?.occupation,
        gender: patientData?.gender,
        symptoms: patientData?.symptoms,
        isTakingMedications: patientData?.isTakingMedication,
        medicationsIfAny: patientData?.medicationsIfAny,
        isDrugAllergy: patientData?.isDrugAllergy,
        drugAllergyIfAny: patientData?.drugAllergyIfAny,
        appointment_date: patientData?.appointment_date,
        appointment_time: patientData?.appointment_time
      }
      await axios.post("http://192.168.1.9:5001/api/create/appointment", body)
        .then(() => {
          Alert.alert("Appointment Request Successful", "See Appointments Tab to view the status of your appointment request.")
          router.replace("/home/activity")
        })
        .catch(err => {
          console.error(err)
        })
      await AsyncStorage.clear()
    } catch (error) {
      Alert.alert("Network Error", "Please check your internet connection")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      {isLoading ? (<Spinner visible={true} />) :
        (
          <YStack flex={1}>
            <Card padded marginHorizontal="$3" marginVertical="$3" >
              <Heading>Schedule</Heading>
              <Separator />
              <Label color="$blue9" disabled>
                Date
              </Label>
              <XStack gap="$3">
                <CalendarCheck />
                <SizableText size="$6" fontWeight={900}>
                  {moment(patientData?.appointment_date).format("ddd MMMM D, YYYY")}
                </SizableText>
              </XStack>
              <Label color="$blue9" disabled>
                Time
              </Label>
              <XStack gap="$3">
                <CalendarClock />
                <SizableText size="$6" fontWeight={900}>
                  {patientData?.appointment_time}
                </SizableText>
              </XStack>
            </Card>
            <ScrollView flex={1} contentContainerStyle={{ paddingTop: "$3" }}>
              <YGroup flex={1} gap="$1" marginHorizontal="$6" marginTop="$3">
                <YGroup.Item>
                  <Heading>Patient Details</Heading>
                  <Separator />
                  <Label color="$blue9" disabled>
                    Full Name
                  </Label>
                  <SizableText size="$6" fontWeight={900}>
                    {patientData?.fullName}
                  </SizableText>
                </YGroup.Item>
                <YGroup.Item>
                  <Label color="$blue9" marginTop="$2" disabled>
                    Age
                  </Label>
                  <SizableText size="$6" fontWeight={900}>
                    {patientData?.age}
                  </SizableText>
                </YGroup.Item>
                <YGroup.Item>
                  <Label color="$blue9" marginTop="$2" disabled>
                    Phone Number
                  </Label>
                  <SizableText size="$6" fontWeight={900}>
                    {patientData?.phoneNumber}
                  </SizableText>
                </YGroup.Item>
                <YGroup.Item>
                  <Label color="$blue9" marginTop="$2" disabled>
                    Occupation
                  </Label>
                  <SizableText size="$6" fontWeight={900}>
                    {patientData?.occupation}
                  </SizableText>
                </YGroup.Item>
                <YGroup.Item>
                  <Label color="$blue9" marginTop="$2" disabled>
                    Gender
                  </Label>
                  <SizableText size="$6" fontWeight={900} textTransform="capitalize">
                    {patientData?.gender}
                  </SizableText>
                </YGroup.Item>
                <YGroup.Item>
                  <Label color="$blue9" marginTop="$2" disabled>
                    Symptoms:
                  </Label>
                  <TextArea
                    placeholder="Type here"
                    placeholderTextColor="$gray9"
                    verticalAlign="top"
                    textAlign="left"
                    size="$5"
                    value={patientData?.symptoms}
                    disabled
                  />
                </YGroup.Item>
                <YGroup.Item>
                  <Label
                    color="$blue9"
                    marginTop="$2"
                    disabled
                  >
                    Are you taking any medication?
                  </Label>
                  <RadioGroup
                    aria-labelledby="Select one item"
                    defaultValue={patientData?.isTakingMedication}
                    name="medication-radio"
                    theme="blue"
                    disabled
                  >
                    <XStack alignItems="center" width="100%" gap="$6">
                      <XStack gap="$4" alignItems="center">
                        <RadioGroup.Item value="yes" id="m-yes" size="$5">
                          <RadioGroup.Indicator />
                        </RadioGroup.Item>
                        <Label htmlFor="yes" size="$5" disabled>
                          Yes
                        </Label>
                      </XStack>
                      <XStack gap="$4" alignItems="center">
                        <RadioGroup.Item value="no" id="m-no" size="$5">
                          <RadioGroup.Indicator />
                        </RadioGroup.Item>
                        <Label htmlFor="m-no" size="$5" disabled>
                          No
                        </Label>
                      </XStack>
                    </XStack>
                  </RadioGroup>
                </YGroup.Item>
                <YGroup.Item>
                  <Label
                    display={patientData?.isTakingMedication == "no" ? "none" : "inline"}
                    color="$blue9"
                    marginTop="$2"
                    disabled
                  >
                    Medications:
                  </Label>
                  <TextArea
                    display={patientData?.isTakingMedication == "no" ? "none" : "inline"}
                    placeholder="Type 'None' if not."
                    placeholderTextColor="$gray9"
                    verticalAlign="top"
                    textAlign="left"
                    size="$5"
                    value={patientData?.medicationsIfAny}
                    disabled
                  />
                </YGroup.Item>
                <YGroup.Item>
                  <Label
                    htmlFor="drug_allergy"
                    color="$blue9"
                    marginTop="$2"
                    disabled
                  >
                    Do you have any known drug allergies?
                  </Label>
                  <RadioGroup
                    aria-labelledby="Select one item"
                    defaultValue="no"
                    name="allergy-radio"
                    theme="blue"
                    id="drug_allergy"
                    value={patientData?.isDrugAllergy}
                    disabled
                  >
                    <XStack alignItems="center" width="100%" gap="$6">
                      <XStack gap="$4" alignItems="center">
                        <RadioGroup.Item value="yes" id="ayes" size="$5" disabled>
                          <RadioGroup.Indicator />
                        </RadioGroup.Item>
                        <Label htmlFor="ayes" size="$5" disabled>
                          Yes
                        </Label>
                      </XStack>
                      <XStack gap="$4" alignItems="center">
                        <RadioGroup.Item value="no" id="ano" size="$5">
                          <RadioGroup.Indicator />
                        </RadioGroup.Item>
                        <Label htmlFor="ano" size="$5" disabled>
                          No
                        </Label>
                      </XStack>
                    </XStack>
                  </RadioGroup>
                </YGroup.Item>
                <YGroup.Item>
                  <Label color="$blue9" marginTop="$2" disabled display={patientData?.isDrugAllergy == "no" ? "none" : "inline"}>
                    Allergies:
                  </Label>
                  <TextArea
                    display={patientData?.isDrugAllergy == "no" ? "none" : "inline"}
                    placeholder="Type 'None' if not."
                    placeholderTextColor="$gray9"
                    verticalAlign="top"
                    textAlign="left"
                    value={patientData?.drugAllergyIfAny}
                    disabled
                    size="$5"
                  />
                </YGroup.Item>
              </YGroup>
            </ScrollView>
            <Button
              theme="green_active"
              size="$5"
              marginVertical="$4"
              marginHorizontal="$3"
              fontWeight={900}
              onPress={onSubmitAppointmentRequest}
            >
              Submit
            </Button>
          </YStack>
        )}


    </>

  );
};

export default BookAppointment;