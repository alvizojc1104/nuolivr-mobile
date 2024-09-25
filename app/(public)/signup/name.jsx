import React, { useEffect, useState } from "react";
import {
  Heading,
  Input,
  YStack,
  RadioGroup,
  XStack,
  SizableText,
  Label,
  ScrollView,
  Button,
  Paragraph,
  Fieldset,
} from "tamagui";
import DateTimePicker from "react-native-modal-datetime-picker";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import Spinner from "react-native-loading-spinner-overlay";
import { Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Name = () => {
  const { isLoaded, user } = useUser();
  const [fullName, setFullName] = useState({
    firstName: user?.firstName || "",
    middleName: "",
    lastName: user?.lastName || "",
  });
  const [errors, setErrors] = useState({});
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedGender, setSelectedGender] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const getPassword = async () => {
      const passKey = await AsyncStorage.getItem("@password");
      setPassword(passKey);
    };
    getPassword();
  }, []);
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const calculateAge = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if their birthday hasn't happened yet this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleConfirm = (date) => {
    const age = calculateAge(date);

    // Check if age is below 12
    if (age < 12) {
      Alert.alert(
        "Double check your information",
        "We only accept users 12 years old and above."
      );
    } else {
      setSelectedDate(date);
      validateField("selectedDate", date); // Assuming you have this validation logic
    }

    hideDatePicker();
  };

  const handleGenderChange = (value) => {
    setSelectedGender(value);
    validateField("selectedGender", value);
  };

  const validateField = (field, value) => {
    let error = "";

    if (!value) {
      if (field === "firstName" && !value) {
        error = "First name is required.";
      } else if (field === "lastName" && !value) {
        error = "Last name is required.";
      }
    } else if (value.length < 3) {
      if (field === "firstName") {
        error = "First name must be at least 3 characters.";
      } else if (field === "lastName") {
        error = "Last name must be at least 3 characters.";
      }
    } else if (field === "selectedDate" && !value) {
      error = "Date of birth is required.";
    } else if (field === "selectedGender" && !value) {
      error = "Gender is required for medical purposes.";
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const handleOnChange = (field, value) => {
    setFullName({
      ...fullName,
      [field]: value,
    });
    validateField(field, value);
  };

  const createClerkUser = async () => {
    await user?.update({
      firstName: fullName.firstName,
      lastName: fullName.lastName,
    });
  };

  const handleCreateAccount = async () => {
    const errors = {};

    validateField("selectedDate", selectedDate);
    validateField("selectedGender", selectedGender);

    if (!fullName.firstName || fullName.firstName.length < 3) {
      errors.firstName = !fullName.firstName
        ? "First name is required."
        : "First name must be at least 3 characters.";
    }

    if (!fullName.lastName || fullName.lastName.length < 3) {
      errors.lastName = !fullName.lastName
        ? "Last name is required."
        : "Last name must be at least 3 characters.";
    }

    setErrors(errors);

    // Ensure there are no errors and valid selectedDate and selectedGender
    if (
      Object.keys(errors).length === 0 &&
      !errors.selectedDate &&
      !errors.selectedGender &&
      selectedDate &&
      selectedGender
    ) {
      if (!isLoaded) return;

      setIsLoading(true);
      try {
        if (!fullName.firstName || !fullName.lastName) return;

        const data = {
          user_id: user.id,
          email_address: user.primaryEmailAddress.emailAddress,
          password: password,
          personal_details: {
            firstName: fullName.firstName,
            middleName: fullName.middleName,
            lastName: fullName.lastName,
            gender: selectedGender,
            birthday: selectedDate,
          },
        };

        await axios
          .post("http://192.168.129.1:5001/api/create/user", data)
          .then((response) => {
            createClerkUser();
            console.log(response);
            Alert.alert(
              "Account Created",
              "Your account has been created successfully!"
            );
            router.replace("/home");
          })
          .catch((err) => {
            Alert.alert("Account",err.response.data.email)
          });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "2-digit" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  return (
    <>
      <Spinner animation="fade" visible={isLoading} />
      <ScrollView
        flex={1}
        contentContainerStyle={{
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <YStack width="100%" gap="$4" paddingHorizontal="$3" marginTop="$3">
          <SizableText
            color="$green10"
            fontWeight="900"
            backgroundColor="$green2"
            padding="$3"
            width="100%"
            borderWidth={1}
            borderColor="$green6"
            alignSelf="center"
          >
            Account Verified.
          </SizableText>
          <Fieldset>
            <Heading size="$9">Welcome NU Olivr!</Heading>
            <Paragraph color="$gray11">
              Please fill in your full name and other details to create your
              account.{" "}
            </Paragraph>
          </Fieldset>
          <Fieldset>
            <Paragraph disabled marginLeft="$1" size="$5" fontWeight="500">
              First Name
            </Paragraph>
            <Input
              theme={"blue"}
              size="$5"
              textTransform="capitalize"
              placeholder="First Name"
              placeholderTextColor="$gray8"
              value={fullName.firstName}
              onChangeText={(value) => handleOnChange("firstName", value)}
            />
            {errors.firstName && (
              <SizableText color="$red10" marginLeft="$1">
                {errors.firstName}
              </SizableText>
            )}
          </Fieldset>
          <Fieldset>
            <Paragraph disabled marginLeft="$1" size="$5" fontWeight="500">
              Middle Name
            </Paragraph>
            <Input
              theme="blue"
              size="$5"
              placeholder="Middle Name (Optional)"
              placeholderTextColor="$gray8"
              textTransform="capitalize"
              value={fullName.middleName}
              onChangeText={(value) => handleOnChange("middleName", value)}
            />
          </Fieldset>
          <Fieldset>
            <Paragraph disabled marginLeft="$1" size="$5" fontWeight="500">
              Last Name
            </Paragraph>
            <Input
              theme={"blue"}
              size="$5"
              textTransform="capitalize"
              placeholder="Last Name"
              placeholderTextColor="$gray8"
              value={fullName.lastName}
              onChangeText={(value) => handleOnChange("lastName", value)}
            />
            {errors.lastName && (
              <SizableText color="$red10" marginLeft="$1">
                {errors.lastName}
              </SizableText>
            )}
          </Fieldset>
          <Fieldset>
            <Paragraph marginTop="$3" size="$5" fontWeight="500">
              Birthday
            </Paragraph>
            <Input
              size="$5"
              placeholder="Pick date"
              placeholderTextColor="$gray8"
              value={selectedDate ? formatDate(selectedDate) : ""}
              onPress={showDatePicker}
              theme={"blue"}
            />
            {errors.selectedDate && (
              <Paragraph color="$red10" marginLeft="$3">
                {errors.selectedDate}
              </Paragraph>
            )}
          </Fieldset>
          <RadioGroup
            aria-labelledby="Select one item"
            name="gender-radio"
            value={selectedGender}
            onValueChange={handleGenderChange}
            theme={"blue"}
          >
            <Paragraph theme="blue" marginTop="$4" size="$5" fontWeight="500">
              Gender
            </Paragraph>
            <XStack alignItems="center" width="100%" gap="$4">
              <XStack gap="$4" alignItems="center">
                <RadioGroup.Item value="Male" id="male" size="$4">
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
                <Label htmlFor="male" size="$5">
                  Male
                </Label>
              </XStack>
              <XStack gap="$4" alignItems="center">
                <RadioGroup.Item value="Female" id="female" size="$4">
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
              {!errors.selectedGender}
            </Paragraph>
          )}
          <YStack flex={1} />
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
      </ScrollView>
      <Button
        theme="blue_active"
        size="$5"
        onPress={handleCreateAccount}
        marginBottom="$3"
        alignSelf="center"
        width="95%"
      >
        Create Account
      </Button>
    </>
  );
};

export default Name;
