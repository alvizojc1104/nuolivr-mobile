import React, { useState } from "react";
import {
  Button,
  Input,
  Label,
  ScrollView,
  TextArea,
  XStack,
  YGroup,
} from "tamagui";
import { router } from "expo-router";
import { RadioGroup } from "tamagui";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alert, Keyboard } from "react-native";

interface PatientData {
  fullName: string;
  age: string;
  phoneNumber: string;
  occupation: string;
  gender: string;
  symptoms: string,
  isTakingMedication: string,
  medicationsIfAny: string,
  isDrugAllergy: string,
  drugAllergyIfAny: string
}

const BookAppointment = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    fullName: "",
    age: "",
    phoneNumber: "",
    occupation: "",
    gender: "",
    symptoms: "",
    isTakingMedication: "no",
    medicationsIfAny: "",
    isDrugAllergy: "no",
    drugAllergyIfAny: ""
  })

  const handleChange = (key: keyof PatientData, value: string) => {
    setPatientData((prev) => ({ ...prev, [key]: value }));
  };

  const validateRequiredFields = (): boolean => {
    const requiredFields: (keyof PatientData)[] = ["fullName", "age", "phoneNumber", "occupation", "gender", "symptoms"];

    for (const field of requiredFields) {
      if (!patientData[field]) {
        Alert.alert("Missing Fields", `Please fill in the required field.`);
        return false;
      }
    }
    return true;
  };

  const goToSchedule = async () => {
    if (!validateRequiredFields()) {
      return;
    }
    if (patientData.phoneNumber.length < 10) {
      Alert.alert("Invalid Number", "Phone Number is invalid")
      return
    }
    try {
      await AsyncStorage.setItem("@patientData", JSON.stringify(patientData));
      console.log(patientData)
      router.push("/book/schedule");
    } catch (error) {
      console.error("Failed to save data", error);
    }
  };

  return (
    <>
      <ScrollView flex={1}>
        <YGroup flex={1} padded gap="$1">
          <YGroup.Item>
            <XStack>
              <Label htmlFor="full_name" disabled>
                Full Name
              </Label>
            </XStack>
            <Input size="$5" placeholder="Full Name" placeholderTextColor='$gray9' value={patientData.fullName} onChangeText={value => handleChange("fullName", value)} />
          </YGroup.Item>
          <YGroup.Item>
            <Label marginTop="$2" disabled>
              Age
            </Label>
            <Input size="$5" placeholder="Age" placeholderTextColor='$gray9' keyboardType="numeric" onChangeText={value => handleChange("age", value)} maxLength={2} />
          </YGroup.Item>
          <YGroup.Item>
            <Label marginTop="$2" disabled >
              Phone Number
            </Label>
            <Input
              size="$5"
              placeholder="Phone Number"
              placeholderTextColor='$gray9'
              keyboardType="numeric"
              onChangeText={value => {
                handleChange("phoneNumber", value)
                if (patientData.phoneNumber.length >= 10) {
                  Keyboard.dismiss()
                }
              }}
              maxLength={11}
              textContentType="telephoneNumber"
            />
          </YGroup.Item>
          <YGroup.Item>
            <Label
              marginTop="$2"
              disabled
            >
              Occupation
            </Label>
            <Input
              size="$5"
              placeholder="Please specify"
              placeholderTextColor='$gray9'
              onChangeText={value => handleChange("occupation", value)}
            />
          </YGroup.Item>
          <YGroup.Item>
            <Label htmlFor="gender" marginTop="$2" disabled>
              Gender
            </Label>
            <RadioGroup
              aria-labelledby="Select one item"
              defaultValue={patientData.gender}
              name="gender-radio"
              theme="blue"
              onValueChange={value => handleChange("gender", value)}
            >
              <XStack alignItems="center" width="100%" gap="$6">
                <XStack gap="$4" alignItems="center">
                  <RadioGroup.Item value="male" id="male" size="$5">
                    <RadioGroup.Indicator />
                  </RadioGroup.Item>
                  <Label htmlFor="male" size="$5">
                    Male
                  </Label>
                </XStack>
                <XStack gap="$4" alignItems="center">
                  <RadioGroup.Item value="female" id="female" size="$5">
                    <RadioGroup.Indicator />
                  </RadioGroup.Item>
                  <Label htmlFor="female" size="$5">
                    Female
                  </Label>
                </XStack>
              </XStack>
            </RadioGroup>
          </YGroup.Item>
          <YGroup.Item>
            <Label marginTop="$2" disabled>
              Please describe your symptoms/reason:
            </Label>
            <TextArea
              placeholder="Type here..."
              placeholderTextColor='$gray9'
              verticalAlign="top"
              textAlign="left"
              size="$5"
              value={patientData.symptoms}
              onChangeText={value => handleChange("symptoms", value)}
            />
          </YGroup.Item>
          <YGroup.Item>
            <Label
              htmlFor="medication"
              marginTop="$2"
              disabled
            >
              Are you taking any medication?
            </Label>
            <RadioGroup
              aria-labelledby="Select one item"
              defaultValue={patientData.isTakingMedication}
              onValueChange={value => {
                handleChange("isTakingMedication", value)
                if (value == "no") {
                  handleChange("medicationsIfAny", "None")
                } else {
                  handleChange("medicationsIfAny", "")
                }
              }}
              name="medication-radio"
              theme="blue"
              id="medication"
            >
              <XStack alignItems="center" width="100%" gap="$6">
                <XStack gap="$4" alignItems="center">
                  <RadioGroup.Item value="yes" id="m-yes" size="$5">
                    <RadioGroup.Indicator />
                  </RadioGroup.Item>
                  <Label htmlFor="m-yes" size="$5">
                    Yes
                  </Label>
                </XStack>
                <XStack gap="$4" alignItems="center">
                  <RadioGroup.Item value="no" id="m-no" size="$5">
                    <RadioGroup.Indicator />
                  </RadioGroup.Item>
                  <Label htmlFor="m-no" size="$5">
                    No
                  </Label>
                </XStack>
              </XStack>
            </RadioGroup>
          </YGroup.Item>
          <YGroup.Item>
            <Label marginTop="$2" disabled display={patientData.isTakingMedication == "no" ? "none" : "inline"}>
              List out medications:
            </Label>
            <TextArea
              display={patientData.isTakingMedication == "no" ? "none" : "inline"}
              placeholder="Please specify..."
              placeholderTextColor='$gray9'
              verticalAlign="top"
              textAlign="left"
              size="$5"
              value={patientData.medicationsIfAny}
              onChangeText={value => handleChange("medicationsIfAny", value)}
            />
          </YGroup.Item>
          <YGroup.Item>
            <Label
              htmlFor="drug_allergy"

              marginTop="$2"
              disabled
            >
              Do you have any known drug allergies?
            </Label>
            <RadioGroup
              aria-labelledby="Select one item"
              defaultValue={patientData.isDrugAllergy}
              onValueChange={value => {
                handleChange("isDrugAllergy", value)
                if (value == "no") {
                  handleChange("drugAllergyIfAny", "None")
                } else {
                  handleChange("drugAllergyIfAny", "")
                }
              }}
              name="allergy1-radio"
              theme="blue"
              id="drug_allergy"
            >
              <XStack alignItems="center" width="100%" gap="$6">
                <XStack gap="$4" alignItems="center">
                  <RadioGroup.Item value="yes" id="ayes" size="$5">
                    <RadioGroup.Indicator />
                  </RadioGroup.Item>
                  <Label htmlFor="ayes" size="$5">
                    Yes
                  </Label>
                </XStack>
                <XStack gap="$4" alignItems="center">
                  <RadioGroup.Item value="no" id="ano" size="$5">
                    <RadioGroup.Indicator />
                  </RadioGroup.Item>
                  <Label htmlFor="ano" size="$5">
                    No
                  </Label>
                </XStack>
              </XStack>
            </RadioGroup>
          </YGroup.Item>
          <YGroup.Item>
            <Label marginTop="$2" disabled display={patientData.isDrugAllergy == "no" ? "none" : "inline"}>
              List out known allergies:
            </Label>
            <TextArea
              display={patientData.isDrugAllergy == "no" ? "none" : "inline"}
              placeholder="Please specify..."
              placeholderTextColor='$gray9'
              verticalAlign="top"
              textAlign="left"
              size="$5"
              value={patientData.drugAllergyIfAny}
              onChangeText={value => handleChange("drugAllergyIfAny", value)}
            />
          </YGroup.Item>
        </YGroup>
      </ScrollView>
      <Button
        theme="blue_active"
        size="$5"
        marginBottom="$5"
        marginHorizontal="$3"
        fontWeight={900}
        onPress={goToSchedule}
      >
        Next 1/3
      </Button>
    </>
  );
};

export default BookAppointment;
