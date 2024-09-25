import React, { useState } from "react";
import {
  Heading,
  Input,
  YStack,
  Button,
  XStack,
  Spacer,
  RadioGroup,
  Label,
  Paragraph,
} from "tamagui";
import { ArrowLeft, ArrowRight } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import DateTimePicker from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Age = () => {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedGender, setSelectedGender] = useState("");
  const [errors, setErrors] = useState({});

  const validateField = (field, value) => {
    let error = "";

    if (field === "selectedDate" && !value) {
      error = "Date of birth is required.";
    }

    if (field === "selectedGender" && !value) {
      error = "Gender is required for medical purposes.";
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    validateField("selectedDate", date);
    hideDatePicker();
  };

  const handleGenderChange = (value) => {
    setSelectedGender(value);
    validateField("selectedGender", value);
  };

  const handleNext = () => {
    validateField("selectedDate", selectedDate);
    validateField("selectedGender", selectedGender);

    if (
      !errors.selectedDate &&
      !errors.selectedGender &&
      selectedDate &&
      selectedGender
    ) {
      mergeData();
      getData();
    }
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "2-digit" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const mergeData = async () => {
    try {
      const age_gender = {
        birthday: selectedDate.toISOString(), // Convert date to ISO string
        gender: selectedGender,
      };
  
      // Retrieve existing user data
      const existingUserData = await AsyncStorage.getItem("@userData");
  
      if (existingUserData !== null) {
        // Parse existing data and merge with new data
        const parsedUserData = JSON.parse(existingUserData);
        const updatedUserData = { ...parsedUserData, ...age_gender };
  
        // Store the merged data back into AsyncStorage
        await AsyncStorage.setItem("@userData", JSON.stringify(updatedUserData));
      } else {
        // If there's no existing data, just set the new data
        await AsyncStorage.setItem("@userData", JSON.stringify(age_gender));
      }
  
      console.log("Data merged successfully");
    } catch (error) {
      console.error("Failed to merge data", error);
    }
  };
  

  const getData = async () => {
    const mergedData = await AsyncStorage.getItem("@userData");
    console.log(mergedData);
  };
  return (
    <YStack
      flex={1}
      justifyContent="flex-start"
      alignItems="flex-start"
      paddingHorizontal="$3"
    >
      <YStack width="100%" gap="$4">
        <Heading size="$9">Birthday</Heading>
        <Input
          size="$5"
          placeholder="Pick date"
          value={selectedDate ? formatDate(selectedDate) : ""}
          onPress={showDatePicker}
          theme={errors.selectedDate ? "red" : selectedDate ? "green" : "blue"}
        />
        {errors.selectedDate && (
          <Paragraph color="$red10" marginLeft="$3">
            {errors.selectedDate}
          </Paragraph>
        )}

        <RadioGroup
          aria-labelledby="Select one item"
          name="gender-radio"
          value={selectedGender}
          onValueChange={handleGenderChange}
          theme={
            errors.selectedGender ? "red" : selectedGender ? "green" : "blue"
          }
        >
          <Heading theme="blue" size="$9" marginTop="$4">
            Gender
          </Heading>
          <XStack alignItems="center" width="100%" gap="$6">
            <XStack gap="$4" alignItems="center">
              <RadioGroup.Item value="Male" id="male" size="$6">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <Label htmlFor="male" size="$5">
                Male
              </Label>
            </XStack>
            <XStack gap="$4" alignItems="center">
              <RadioGroup.Item value="Female" id="female" size="$6">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <Label htmlFor="female" size="$5">
                Female
              </Label>
            </XStack>
          </XStack>
        </RadioGroup>
        {errors.selectedGender && (
          <Paragraph color="$red10" marginLeft="$3">
            {errors.selectedGender}
          </Paragraph>
        )}

        <XStack justifyContent="space-between" marginTop="$4">
          <Button
            size="$5"
            chromeless
            icon={ArrowLeft}
            fontWeight={900}
            onPress={() => {
              router.back();
            }}
          >
            Back
          </Button>
          <Spacer />
          <Button
            size="$5"
            theme="active"
            iconAfter={ArrowRight}
            fontWeight={900}
            onPress={handleNext}
          >
            Next
          </Button>
        </XStack>
      </YStack>
      <DateTimePicker
        date={selectedDate || new Date()}
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={new Date()}
        display="default"
      />
    </YStack>
  );
};

export default Age;
