import React, { useState, useRef } from 'react';
import { Avatar, H5, ScrollView, SizableText, View, Input, Label, Button, Card } from 'tamagui';
import { Controller, useForm } from "react-hook-form";
import { router, Stack } from 'expo-router';
import Spinner from 'react-native-loading-spinner-overlay';
import { ToastAndroid } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import moment from 'moment';

type FormData = {
  patientName: string;
  occupation: string;
  rightEye: string;
  leftEye: string;
  bothEyes: string;
  comments: string;
  dateOfExamination: Date;
  age: number;
  time: string;
};

const VisualAcuity = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      patientName: '',
      occupation: '',
      rightEye: '',
      leftEye: '',
      bothEyes: '',
      comments: '',
      dateOfExamination: new Date(),
      age: undefined,
      time: moment(new Date).format("h:ss A")
    }
  });

  // Refs for each input
  const ageRef = useRef(null);
  const occupationRef = useRef(null);
  const rightEyeRef = useRef(null);
  const leftEyeRef = useRef(null);
  const bothEyesRef = useRef(null);

  const showToast = () => {
    ToastAndroid.showWithGravityAndOffset(
      'Visual acuity submitted!',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  const onSubmit = (data: FormData) => {
    setLoading(true);
    console.log('Form data:', data);
    setTimeout(() => {
      setLoading(false);
      showToast();
      router.back()
    }, 3000);
  };

  return (
    <View flex={1}>
      <Stack.Screen options={{ headerTitleAlign: 'center' }} />
      <Spinner visible={loading} />
      <ScrollView flex={1} padding="$4" contentContainerStyle={{paddingBottom:"$7"}}>
        <H5 fontWeight={900}>Patient Visual Acuity Form</H5>
        <SizableText color="$gray11">Please fill in all required fields.</SizableText>
        <SizableText color="$blue10" mt="$4">{`Date of Examination: ${moment(new Date()).format("MMMM D, YYYY")}`}</SizableText>
        <SizableText color="$blue10">{`Time: ${moment(new Date()).format("h:mm A")}`}</SizableText>

        {/* Patient Name */}
        <Label disabled htmlFor="patientName">Patient's Name:</Label>
        <Controller
          control={control}
          name="patientName"
          rules={{ required: 'Patient name is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              size="$4"
              id="patientName"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Enter patient name"
              placeholderTextColor="$gray11"
              borderColor={errors.patientName ? 'red' : "transparent"}
              returnKeyType='next'
              onSubmitEditing={() => ageRef.current?.focus()}  // Focus next input
            />
          )}
        />
        {errors.patientName && <SizableText color="red">{errors.patientName.message}</SizableText>}

        {/* Age */}
        <Label>Patient's Age:</Label>
        <Controller
          control={control}
          name="age"
          rules={{ required: 'Age is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              size="$4"
              id="age"
              ref={ageRef}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Enter patient's age"
              placeholderTextColor="$gray11"
              borderColor={errors.occupation ? 'red' : "transparent"}
              returnKeyType='next'
              keyboardType='numeric'
              onSubmitEditing={() => occupationRef.current?.focus()}  // Focus next input
            />
          )}
        />
        {errors.occupation && <SizableText color="red">{errors.occupation.message}</SizableText>}

        {/* Occupation */}
        <Label disabled>Occupation:</Label>
        <Controller
          control={control}
          name="occupation"
          rules={{ required: 'Occupation is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              size="$4"
              id="occupation"
              ref={occupationRef}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Enter occupation"
              placeholderTextColor="$gray11"
              borderColor={errors.occupation ? 'red' : "transparent"}
              returnKeyType='next'
              onSubmitEditing={() => rightEyeRef.current?.focus()}  // Focus next input
            />
          )}
        />
        {errors.occupation && <SizableText color="red">{errors.occupation.message}</SizableText>}

        {/* Right Eye Acuity */}
        <Label htmlFor="rightEye">Right Eye Acuity (OD):</Label>
        <Controller
          control={control}
          name="rightEye"
          rules={{ required: 'Right eye acuity is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Card flexDirection='row' alignItems='center' paddingLeft="$3" bordered borderColor={errors.rightEye ? 'red' : "transparent"} size="$4">
              <SizableText color="$gray11">OD</SizableText>
              <Input
                flex={1}
                ref={rightEyeRef}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Enter right eye acuity"
                placeholderTextColor="$gray11"
                returnKeyType='next'
                keyboardType='numeric'
                borderWidth={0}
                onSubmitEditing={() => leftEyeRef.current?.focus()}  // Focus next input
              />
            </Card>
          )}
        />
        {errors.rightEye && <SizableText color="red">{errors.rightEye.message}</SizableText>}

        {/* Left Eye Acuity */}
        <Label htmlFor="leftEye">Left Eye Acuity (OS):</Label>
        <Controller
          control={control}
          name="leftEye"
          rules={{ required: 'Left eye acuity is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Card flexDirection='row' alignItems='center' paddingLeft="$3" bordered borderColor={errors.leftEye ? 'red' : "transparent"} size="$4">
              <SizableText color="$gray11">OS</SizableText>
              <Input
                flex={1}
                ref={leftEyeRef}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Enter left eye acuity"
                placeholderTextColor="$gray11"
                returnKeyType='next'
                keyboardType='numeric'
                borderWidth={0}
                onSubmitEditing={() => bothEyesRef.current?.focus()}  // Focus next input
              />
            </Card>
          )}
        />
        {errors.leftEye && <SizableText color="red">{errors.leftEye.message}</SizableText>}

        {/* Both Eyes Acuity */}
        <Label htmlFor="bothEyes">Both Eyes Acuity (OU):</Label>
        <Controller
          control={control}
          name="bothEyes"
          rules={{ required: 'Both eyes acuity is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Card flexDirection='row' alignItems='center' paddingLeft="$3" bordered borderColor={errors.bothEyes ? 'red' : "transparent"} size="$4">
              <SizableText color="$gray11">OU</SizableText>
              <Input
                flex={1}
                ref={bothEyesRef}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Enter both eyes acuity"
                placeholderTextColor="$gray11"
                keyboardType='numeric'
                borderWidth={0}
                returnKeyType='done'
              />
            </Card>
          )}
        />
        {errors.bothEyes && <SizableText color="red">{errors.bothEyes.message}</SizableText>}

        {/* Comments */}
        <Label htmlFor="comments" mt="$4">Comments:</Label>
        <Controller
          control={control}
          name="comments"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              id="comments"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Any additional comments"
              placeholderTextColor="$gray11"
              borderWidth={0}
              multiline
            />
          )}
        />

        {/* Submit Button */}
        <Button theme="active" mt="$5" onPress={handleSubmit(onSubmit)}>Submit</Button>
      </ScrollView>
    </View>
  );
}

export default VisualAcuity;
