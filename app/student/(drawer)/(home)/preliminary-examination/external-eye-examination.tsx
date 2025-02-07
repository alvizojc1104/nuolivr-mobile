import { View, SizableText, XStack, Avatar, YStack } from 'tamagui'
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Alert, BackHandler, KeyboardAvoidingView, Platform } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import TextInput from '@/components/TextInput'
import { useForm } from 'react-hook-form'
import { useUser } from '@clerk/clerk-expo'
import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { usePatient } from '@/hooks/usePatient'
import Animated, { FadeIn } from 'react-native-reanimated'
import Label from '@/components/Label'
import CustomButton from '@/components/CustomButton'
import { theme } from '@/theme/theme'
import { CheckCircle } from '@tamagui/lucide-icons'
import moment from 'moment'
import SelectTextInput from '@/components/SelectTextInput'
import axios from 'axios'
import { SERVER } from '@/constants/link'
import TextArea from '@/components/TextArea'
import Loading from '@/components/Loading'
import { ExternalEyeExamination as IExternalEyeExamination } from '@/constants/interfaces'


const ExternalEyeExamination = () => {
  const { handleSubmit, setValue, control, formState: { isValid } } = useForm<IExternalEyeExamination>({
    mode: "onChange"
  })
  const { isLoaded, user } = useUser()
  let { patientId, recordId, fullName }: any = useLocalSearchParams()
  const { fetchPatientById, patient } = usePatient()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const inputRefs = useRef<any>(Array.from({ length: 24 }, () => React.createRef()));

  if (!isLoaded) return;

  // Fetch patient data and update the component as needed
  useFocusEffect(
    useCallback(() => {
      const fetchRecord = async () => {
        if (recordId) {
          try {
            const response = await axios.get(`${SERVER}/record/${recordId}`,)

            if (!response.data) return;

            const externalEyeExamination: IExternalEyeExamination | any = response.data.externalEyeExamination

            if (externalEyeExamination) {
              // Set multiple values at once
              Object.keys(externalEyeExamination).forEach(key => {
                setValue(key as keyof IExternalEyeExamination, externalEyeExamination[key]);
              });
            } else {
              return;
            }

          } catch (error: any) {
            console.log(JSON.stringify(error.response.data))
          }
        } else {
          return
        }
      }
      if (patientId) {
        fetchRecord()
        fetchPatientById(patientId)
      }
      else {
        return;
      }
    }, [patientId])
  );

  useLayoutEffect(() => {
    const backAction = () => {
      Alert.alert("Leave", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => router.back() } // or navigate back
      ]);
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Cleanup function to remove the listener
    return () => backHandler.remove();
  }, []); // Empty dependency array to run only once

  const onSubmit = async (data: any) => {
    setIsLoading(true)

    try {
      if (isLoaded && user && isValid) {

        const formData = {
          patientId: patient?._id,
          clinicianId: user?.id,
          externalEyeExamination: { ...data, isComplete: true }
        }


        const response = await axios.put(`${SERVER}/patient/record/edit`, formData)
        if (response.data.message) {
          Alert.alert(
            "Success",
            response.data.message,
            [{ text: "Okay" }]
          )
          router.back()
        }
      }
      return;
    } catch (error: any) {
      Alert.alert("Error", "An error occured while updating the record. Please try again later.")
      console.log(JSON.stringify(error))
    } finally {
      setIsLoading(false);
    }
  }


  const validateForm = () => {
    if (isValid) {
      Alert.alert(
        "Double check data before submission",
        "Would you like to submit?",
        [
          { text: "Wait", style: "cancel" },
          { text: "Yes", style: "default", onPress: async () => await handleSubmit(onSubmit)() },
        ]
      )
    } else {
      Alert.alert("Failed", "Please fill out all required fields.", [
        { text: "OK", onPress: () => handleSubmit(onSubmit)() }
      ]);
    }
  }

  const focus = (index: number) => {
    inputRefs.current[index].current.focus()
  }

  if (!patient) {
    return <Loading />
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white", }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 80}
    >
      <Stack.Screen options={{
        headerTitle: () => (
          <XStack alignItems='center' gap="$4" enterStyle={{ animation: "medium" }}>
            <Avatar circular>
              <Avatar.Image src={patient?.imageUrl || "https://w1.pngwing.com/pngs/991/900/png-transparent-black-circle-avatar-user-rim-black-and-white-line-auto-part-symbol-thumbnail.png"} />
              <Avatar.Fallback delayMs={200} bg={theme.cyan5} />
            </Avatar>
            <YStack>
              <SizableText color="white">{fullName}</SizableText>
              <SizableText size={"$1"} color="white">External Eye Examination</SizableText>
            </YStack>
          </XStack>
        ),
      }} />
      {patient?.records[0]?.externalEyeExamination?.isComplete &&
        <XStack alignItems="center" justifyContent="space-between" backgroundColor={"green"} paddingVertical="$2" paddingHorizontal="$3">
          <SizableText color={"$green3"}><CheckCircle color={"$green5"} size={10} />  Completed</SizableText>
          <SizableText size={"$1"} color={"$green3"}>{moment((patient.records[0]?.externalEyeExamination?.createdAt)).format("MMMM D, yyyy hh:mmA")}</SizableText>
        </XStack>
      }
      <Spinner animation="fade" visible={isLoading} />
      <Animated.ScrollView entering={FadeIn} style={{ flex: 1 }}>
        <View paddingHorizontal="$5">
          <Label text='Eyelids' />
          <XStack width={"100%"} gap="$2" alignItems='center' justifyContent='space-between'>
            <YStack flex={1}>
              <TextInput control={control} label='OD' placeholder='OD' name='eyelid.od' onSubmitEditing={() => focus(0)} />
            </YStack>
            <YStack flex={1}>
              <TextInput control={control} label='OS' placeholder='OS' name='eyelid.os' ref={inputRefs.current[0]} onSubmitEditing={() => focus(1)} />
            </YStack>
          </XStack>
          <Label text='Eyelashes' />
          <XStack width={"100%"} gap="$2" alignItems='center' justifyContent='space-between'>
            <YStack flex={1}>
              <TextInput control={control} label='OD' placeholder='OD' name='eyelashes.od' ref={inputRefs.current[1]} onSubmitEditing={() => focus(2)} />
            </YStack>
            <YStack flex={1}>
              <TextInput control={control} label='OS' placeholder='OS' name='eyelashes.os' ref={inputRefs.current[2]} onSubmitEditing={() => focus(3)} />
            </YStack>
          </XStack>
          <Label text='Eyebrows' />
          <XStack width={"100%"} gap="$2" alignItems='center' justifyContent='space-between'>
            <YStack flex={1}>
              <TextInput control={control} label='OD' placeholder='OD' name='eyebrows.od' ref={inputRefs.current[3]} onSubmitEditing={() => focus(4)} />
            </YStack>
            <YStack flex={1}>
              <TextInput control={control} label='OS' placeholder='OS' name='eyebrows.os' ref={inputRefs.current[4]} onSubmitEditing={() => focus(5)} />
            </YStack>
          </XStack>
          <Label text='Cornea' />
          <XStack width={"100%"} gap="$2" alignItems='center' justifyContent='space-between'>
            <YStack flex={1}>
              <TextInput control={control} label='OD' placeholder='OD' name='cornea.od' ref={inputRefs.current[5]} onSubmitEditing={() => focus(6)} />
            </YStack>
            <YStack flex={1}>
              <TextInput control={control} label='OS' placeholder='OS' name='cornea.os' ref={inputRefs.current[6]} onSubmitEditing={() => focus(7)} />
            </YStack>
          </XStack>
          <Label text='Sclera' />
          <XStack width={"100%"} gap="$2" alignItems='center' justifyContent='space-between'>
            <YStack flex={1}>
              <TextInput control={control} label='OD' placeholder='OD' name='sclera.od' ref={inputRefs.current[7]} onSubmitEditing={() => focus(8)} />
            </YStack>
            <YStack flex={1}>
              <TextInput control={control} label='OS' placeholder='OS' name='sclera.os' ref={inputRefs.current[8]} onSubmitEditing={() => focus(9)} />
            </YStack>
          </XStack>
          <Label text='Iris' />
          <XStack width={"100%"} gap="$2" alignItems='center' justifyContent='space-between'>
            <YStack flex={1}>
              <TextInput control={control} label='OD' placeholder='OD' name='iris.od' ref={inputRefs.current[9]} onSubmitEditing={() => focus(10)} />
            </YStack>
            <YStack flex={1}>
              <TextInput control={control} label='OS' placeholder='OS' name='iris.os' ref={inputRefs.current[10]} onSubmitEditing={() => focus(11)} />
            </YStack>
          </XStack>
          <Label text='Pupil' />
          <XStack width={"100%"} gap="$2" alignItems='center' justifyContent='space-between'>
            <YStack flex={1}>
              <TextInput control={control} label='OD' placeholder='OD' name='pupil.od' ref={inputRefs.current[11]} onSubmitEditing={() => focus(12)} />
            </YStack>
            <YStack flex={1}>
              <TextInput control={control} label='OS' placeholder='OS' name='pupil.os' ref={inputRefs.current[12]} onSubmitEditing={() => focus(13)} />
            </YStack>
          </XStack>
          <Label text='Lens / Media' />
          <XStack width={"100%"} gap="$2" alignItems='center' justifyContent='space-between'>
            <YStack flex={1}>
              <TextInput control={control} label='OD' placeholder='OD' name='lensmedia.od' ref={inputRefs.current[13]} onSubmitEditing={() => focus(14)} />
            </YStack>
            <YStack flex={1}>
              <TextInput control={control} label='OS' placeholder='OS' name='lensmedia.os' ref={inputRefs.current[14]} onSubmitEditing={() => focus(15)} />
            </YStack>
          </XStack>
          <Label text='Conjunctiva' />
          <XStack width={"100%"} gap="$2" alignItems='center' justifyContent='space-between'>
            <YStack flex={1}>
              <TextInput control={control} label='OD' placeholder='OD' name='conjunctiva.od' ref={inputRefs.current[15]} onSubmitEditing={() => focus(16)} />
            </YStack>
            <YStack flex={1}>
              <TextInput control={control} label='OS' placeholder='OS' name='conjunctiva.os' ref={inputRefs.current[16]} onSubmitEditing={() => focus(17)} />
            </YStack>
          </XStack>
          <Label text='Bulbar Conjunctiva' />
          <XStack width={"100%"} gap="$2" alignItems='center' justifyContent='space-between'>
            <YStack flex={1}>
              <TextInput control={control} label='OD' placeholder='OD' name='bulbarConjunctiva.od' ref={inputRefs.current[17]} onSubmitEditing={() => focus(18)} />
            </YStack>
            <YStack flex={1}>
              <TextInput control={control} label='OS' placeholder='OS' name='bulbarConjunctiva.os' ref={inputRefs.current[18]} onSubmitEditing={() => focus(19)} />
            </YStack>
          </XStack>
          <Label text='Palpebral' />
          <XStack width={"100%"} gap="$2" alignItems='center' justifyContent='space-between'>
            <YStack flex={1}>
              <TextInput control={control} label='OD' placeholder='OD' name='palpebral.od' ref={inputRefs.current[19]} onSubmitEditing={() => focus(20)} />
            </YStack>
            <YStack flex={1}>
              <TextInput control={control} label='OS' placeholder='OS' name='palpebral.os' ref={inputRefs.current[20]} onSubmitEditing={() => focus(21)} />
            </YStack>
          </XStack>
          <Label text='Palpebral Fissure' />
          <XStack width={"100%"} gap="$2" alignItems='center' justifyContent='space-between'>
            <YStack flex={1}>
              <TextInput control={control} label='OD' placeholder='OD' name='palpebralFissure.od' ref={inputRefs.current[21]} onSubmitEditing={() => focus(22)} />
            </YStack>
            <YStack flex={1}>
              <TextInput control={control} label='OS' placeholder='OS' name='palpebralFissure.os' ref={inputRefs.current[22]} />
            </YStack>
          </XStack>
          <Label text='Anterior Chamber' />
          <SelectTextInput control={control} name='anteriorChamber.od' placeholder='OD' label='OD' options={[{ value: "1", label: "1" }, { value: "2", label: "2" }, { value: "3", label: "3" }, { value: "4", label: "4" }]} />
          <SelectTextInput control={control} name='anteriorChamber.os' placeholder='OS' label='OS' options={[{ value: "1", label: "1" }, { value: "2", label: "2" }, { value: "3", label: "3" }, { value: "4", label: "4" }]} />
          <TextArea
            control={control}
            name="instrumentsUsed"
            label="Instruments used:"
          />
          <TextArea
            control={control}
            name="otherObservation"
            label="Other observation:"
          />
        </View>
      </Animated.ScrollView>
      <View paddingVertical="$3" paddingHorizontal="$5">
        <CustomButton buttonText='Save' onPress={validateForm} />
      </View>
    </KeyboardAvoidingView>
  )
}

export default ExternalEyeExamination