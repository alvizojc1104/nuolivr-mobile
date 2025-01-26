import { darkTheme, theme } from '@/theme/theme'
import { Calendar, Camera, UserRound } from '@tamagui/lucide-icons'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { Alert, TouchableOpacity, useColorScheme } from 'react-native'
import { Avatar, Card, ScrollView, SizableText, View, XStack } from 'tamagui'
import * as ImagePicker from 'expo-image-picker'
import { useUser } from '@clerk/clerk-expo'
import Spinner from 'react-native-loading-spinner-overlay'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '@/firebaseConfig'
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment'
import { SubmitHandler, useForm } from 'react-hook-form'
import TextInput from '@/components/TextInput'
import ControlledSelect from '@/components/ControlledSelect'
import Label from '@/components/Label'
import { SERVER } from '@/constants/link'
import axios from 'axios'
import { router } from 'expo-router'
import CustomButton from '@/components/CustomButton'

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  age: number;
  civilStatus: string;
  occupationOrCourse: string;
  hobbiesOrAvocation: string;
  contactInformation: {
    fullAddress: string;
    emailAddress: string;
    mobile: string
  }
}

const gender = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" }
]

const civilStatus = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "separated", label: "Separated" },
  { value: "widowed", label: "Widowed" },
]

const Demographic: React.FC = () => {
  const { control, handleSubmit } = useForm<FormData>({ defaultValues: { middleName: "" } })
  const colorScheme = useColorScheme()
  const bg = colorScheme === "dark" ? darkTheme.cyan1 : "#FFF"
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [imageUri, setImageUri] = useState("")
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);


  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    let downloadURL: any;
    try {
      // Upload image if imageUri exists
      if (imageUri) {
        downloadURL = await uploadImage(imageUri, "image");
      }

      // Prepare patient data to send
      const patientData = {
        ...data,
        addedBy: user?.id,
        birthdate: moment(selectedDate).format(),
        ...(downloadURL && { imageUrl: downloadURL })
      };

      const response = await axios.post(`${SERVER}/api/add-patient`, patientData)
      console.log(response.data._id)

      // Show success alert
      Alert.alert("New patient added!", "Would you like to proceed to the preliminary examination now?", [
        { text: "Later", style: "cancel", onPress: () => router.back() },
        {
          text: "Yes", onPress: () => {
            router.replace({ pathname: "/student/(drawer)/(home)/(pcr)/eye-triage", params: { _patientId: response.data?._id } })
          }
        }
      ]);

      // Reset imageUri after submission
      setImageUri("");
      setLoading(false)
    } catch (error) {
      setLoading(false)
      Alert.alert("Error occured", "An error occurred while adding patient. Please try again later.");
    }
  };

  const uploadImage = async (uri: string, fileType: any) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, "Patient Photos/" + new Date().getTime());
      const uploadTask = uploadBytesResumable(storageRef, blob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Uploading: " + progress + "%");
          },
          (error) => {
            console.error("Upload error:", error);
            reject(error); // Reject on error
          },
          async () => {
            // Finally, get download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at: " + downloadURL);
            resolve(downloadURL); // Resolve with download URL
          }
        );
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error; // Rethrow error for the calling function to handle
    }
  };


  const captureImage = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.75,
        aspect: [4, 4],
        base64: true,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri)
        setLoading(true);
      }
    } catch (error) {
      Alert.alert("Error", "Error uploading photo.");
    } finally {
      setLoading(false);
    }
  };


  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  return (
    <View flex={1}>
      <Spinner visible={loading} animation='fade' />
      <ScrollView flex={1} contentContainerStyle={{ gap: "$2" }}>
        <View padding="$5" bg={bg}>
          <SizableText color={"$gray10"} mb="$2">PATIENT</SizableText>
          <Avatar borderRadius={"$4"} alignSelf='center' size={"$10"} backgroundColor={"$gray4"}>
            {
              imageUri ? <Avatar.Image src={imageUri} /> : <UserRound />
            }
          </Avatar>
          <TouchableOpacity onPress={captureImage}>
            <XStack alignItems='center' alignSelf='center' gap="$2" mt="$2">
              <Camera color={theme.cyan10} size={16} />
              <SizableText color={theme.cyan10}>Take photo</SizableText>
            </XStack>
          </TouchableOpacity>
        </View>
        <View bg={bg} padding="$5">
          <SizableText color={"$gray11"}>DEMOGRAPHIC DATA</SizableText>
          <TextInput control={control} name='firstName' label='First Name' placeholder='Enter first name' required />
          <TextInput name='middleName' control={control} label='Middle Name' placeholder='Enter middle name' />
          <TextInput name='lastName' control={control} label='Last Name' placeholder='Enter last name' required />
          <ControlledSelect
            name='gender'
            control={control}
            label='Gender'
            options={gender}
            placeholder='Select gender'
            required
          />
          <SizableText mt="$4">Birthday<SizableText color={"red"}>*</SizableText></SizableText>
          <Card size={"$3"} flexDirection='row' alignItems='center' justifyContent='space-between' bordered borderRadius={"$4"} backgroundColor={"white"} onPress={showDatePicker} paddingVertical="$2.5" paddingHorizontal="$3.5" pressTheme>
            {
              selectedDate ? <SizableText>{moment(selectedDate).format("MMMM D, yyyy")}</SizableText> : <SizableText color={"$gray10"}>Enter birthday</SizableText>
            }
            <Calendar color={"$gray10"} />
          </Card>
          {!selectedDate && <SizableText color={"red"} size={"$2"} ml='$2'>Please select a date</SizableText>}
          <DateTimePicker
            date={selectedDate || new Date()}
            isVisible={datePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            maximumDate={new Date()}
            display='spinner'
          />
          <TextInput name='age' control={control} label='Age' placeholder='Enter age' required type='numeric' />
          <ControlledSelect
            name='civilStatus'
            control={control}
            label='Civil Status'
            options={civilStatus}
            placeholder='Select civil status'
            required
          />
          <TextInput name='occupationOrCourse' control={control} label="Occupation/Course" placeholder='Enter occupation/course' required />
          <TextInput name='hobbiesOrAvocation' control={control} label='Hobbies/Avocation' placeholder='Enter hobbies/avocation' required />
        </View>
        <View bg={bg} padding="$5">
          <SizableText color={"$gray10"}>CONTACT INFORMATION</SizableText>
          <TextInput name='contactInformation.fullAddress' control={control} label='Full Address' placeholder='Enter full address' required />
          <TextInput name='contactInformation.emailAddress' control={control} label='Email Address' placeholder='exampl@gmail.com' type='email-address' required />
          <TextInput name='contactInformation.mobile' control={control} label='Mobile Number' placeholder='Enter mobile number' type='phone-pad' required />
        </View>
        <View backgroundColor={bg} paddingHorizontal="$5" paddingVertical="$3">
          <CustomButton onPress={handleSubmit(onSubmit)} buttonText={"Save"} />
        </View>
        <StatusBar style='light' />
      </ScrollView>
    </View>

  )
}



export default Demographic