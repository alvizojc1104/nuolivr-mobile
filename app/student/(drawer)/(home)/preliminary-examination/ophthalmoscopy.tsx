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

interface EyeObservation {
      od: string;
      os: string;
}

interface IOphthalmoscopy {
      avcrossing: EyeObservation;
      avratio: EyeObservation;
      cdratio: EyeObservation;
      fovealReflex: EyeObservation;
      instrumentsUsed: string;
      macula: EyeObservation;
      otherObservation: string;
      periphery: EyeObservation;
      ror: EyeObservation;
      venousPulsation: EyeObservation;
}



const Ophthalmoscopy = () => {
      const { handleSubmit, setValue, control, formState: { isValid } } = useForm<IOphthalmoscopy>({
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

                                    const ophthalmoscopy: IOphthalmoscopy | any = response.data.ophthalmoscopy

                                    if (ophthalmoscopy) {
                                          // Set multiple values at once
                                          Object.keys(ophthalmoscopy).forEach(key => {
                                                setValue(key as keyof IOphthalmoscopy, ophthalmoscopy[key]);
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
            // console.log(data)

            setIsLoading(true)
            try {
                  if (isLoaded && user && isValid) {

                        const formData = {
                              patientId: patient?._id,
                              clinicianId: user?.id,
                              ophthalmoscopy: { ...data, isComplete: true }
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
                                          <SizableText size={"$1"} color="white">Ophthalmoscopy</SizableText>
                                    </YStack>
                              </XStack>
                        ),
                  }} />
                  {patient?.records[0]?.ophthalmoscopy?.isComplete &&
                        <XStack alignItems="center" justifyContent="space-between" backgroundColor={"green"} paddingVertical="$2" paddingHorizontal="$3">
                              <SizableText color={"$green3"}><CheckCircle color={"$green5"} size={10} />  Completed</SizableText>
                              <SizableText size={"$1"} color={"$green3"}>{moment((patient.records[0]?.ophthalmoscopy?.createdAt)).format("MMMM D, yyyy hh:mmA")}</SizableText>
                        </XStack>
                  }
                  <Spinner animation="fade" visible={isLoading} />
                  <Animated.ScrollView entering={FadeIn} style={{ flex: 1 }}>
                        <View paddingHorizontal="$5">
                              <Label text='ROR' />
                              <XStack width={"100%"} gap="$2" alignItems='center' justifyContent='space-between'>
                                    <TextInput control={control} label='OD' placeholder='OD' name='ror.od' onSubmitEditing={() => focus(0)} />
                                    <TextInput control={control} label='OS' placeholder='OS' name='ror.os' ref={inputRefs.current[0]} onSubmitEditing={() => focus(1)} />
                              </XStack>
                              <Label text='C/D Ratio' />
                              <XStack width={"100%"} gap="$2" alignItems='center' justifyContent='space-between'>
                                    <TextInput control={control} label='OD' placeholder='OD' name='cdratio.od' ref={inputRefs.current[1]} onSubmitEditing={() => focus(2)} />
                                    <TextInput control={control} label='OS' placeholder='OS' name='cdratio.os' ref={inputRefs.current[2]} onSubmitEditing={() => focus(3)} />
                              </XStack>
                              <Label text='Venous Pulsation' />
                              <XStack width={"100%"} gap="$2" alignItems='center' justifyContent='space-between'>
                                    <TextInput control={control} label='OD' placeholder='OD' name='venousPulsation.od' ref={inputRefs.current[3]} onSubmitEditing={() => focus(4)} />
                                    <TextInput control={control} label='OS' placeholder='OS' name='venousPulsation.os' ref={inputRefs.current[4]} onSubmitEditing={() => focus(5)} />
                              </XStack>
                              <Label text='A/V Ratio' />
                              <XStack width={"100%"} gap="$2" alignItems='center' justifyContent='space-between'>
                                    <TextInput control={control} label='OD' placeholder='OD' name='avratio.od' ref={inputRefs.current[5]} onSubmitEditing={() => focus(6)} />
                                    <TextInput control={control} label='OS' placeholder='OS' name='avratio.os' ref={inputRefs.current[6]} onSubmitEditing={() => focus(7)} />
                              </XStack>
                              <Label text='A/V Crossing' />
                              <XStack width={"100%"} gap="$2" alignItems='center' justifyContent='space-between'>
                                    <TextInput control={control} label='OD' placeholder='OD' name='avcrossing.od' ref={inputRefs.current[7]} onSubmitEditing={() => focus(8)} />
                                    <TextInput control={control} label='OS' placeholder='OS' name='avcrossing.os' ref={inputRefs.current[8]} onSubmitEditing={() => focus(9)} />
                              </XStack>
                              <Label text='Macula' />
                              <XStack width={"100%"} gap="$2" alignItems='center' justifyContent='space-between'>
                                    <TextInput control={control} label='OD' placeholder='OD' name='macula.od' ref={inputRefs.current[9]} onSubmitEditing={() => focus(10)} />
                                    <TextInput control={control} label='OS' placeholder='OS' name='macula.os' ref={inputRefs.current[10]} onSubmitEditing={() => focus(11)} />
                              </XStack>
                              <Label text='Foveal Reflex' />
                              <XStack width={"100%"} gap="$2" alignItems='center' justifyContent='space-between'>
                                    <TextInput control={control} label='OD' placeholder='OD' name='fovealReflex.od' ref={inputRefs.current[11]} onSubmitEditing={() => focus(12)} />
                                    <TextInput control={control} label='OS' placeholder='OS' name='fovealReflex.os' ref={inputRefs.current[12]} onSubmitEditing={() => focus(13)} />
                              </XStack>
                              <Label text='Periphery' />
                              <XStack width={"100%"} gap="$2" alignItems='center' justifyContent='space-between'>
                                    <TextInput control={control} label='OD' placeholder='OD' name='periphery.od' ref={inputRefs.current[13]} onSubmitEditing={() => focus(14)} />
                                    <TextInput control={control} label='OS' placeholder='OS' name='periphery.os' ref={inputRefs.current[14]} onSubmitEditing={() => focus(15)} />
                              </XStack>
                              <Label text='Other Observation' />
                              <XStack width={"100%"} gap="$2" alignItems='center' justifyContent='space-between'>
                                    <TextInput control={control} label='OD' placeholder='OD' name='otherObservation.od' ref={inputRefs.current[15]} onSubmitEditing={() => focus(16)} />
                                    <TextInput control={control} label='OS' placeholder='OS' name='otherObservation.os' ref={inputRefs.current[16]} />
                              </XStack>
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

export default Ophthalmoscopy