import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Avatar, SizableText, View as TView, XStack } from 'tamagui';
import { Alert, BackHandler, KeyboardAvoidingView, Platform, } from 'react-native';
import TextInput from '@/components/TextInput';
import View from '@/components/View';
import Spinner from 'react-native-loading-spinner-overlay';
import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { YStack } from 'tamagui';
import { useUser } from '@clerk/clerk-expo';
import { usePatient } from '@/hooks/usePatient';
import Loading from '@/components/Loading';
import { theme } from '@/theme/theme';
import axios from 'axios';
import { SERVER } from '@/constants/link';
import { CheckCircle, HelpCircle } from '@tamagui/lucide-icons';
import moment from 'moment';
import Animated, { FadeIn } from 'react-native-reanimated';
import Label from '@/components/Label';
import Title from '@/components/Title';
import CustomButton from '@/components/CustomButton';
import TextArea from '@/components/TextArea';
import { Phorometry as IPhorometry } from '@/constants/interfaces';

const Phorometry = () => {
    const { handleSubmit, setValue, control, formState: { isValid } } = useForm<IPhorometry>()
    const { isLoaded, user } = useUser()
    let { patientId, recordId, fullName }: any = useLocalSearchParams()
    const { fetchPatientById, patient } = usePatient()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const inputRefs = useRef<any>(Array.from({ length: 27 }, () => React.createRef()));

    useFocusEffect(
        useCallback(() => {
            const fetchRecord = async () => {
                if (recordId) {
                    try {
                        const response = await axios.get(`${SERVER}/api/get/patient-record/${recordId}`,)

                        if (!response.data) return;

                        const phorometry: IPhorometry | any = response.data.phorometry

                        if (phorometry) {
                            // Set multiple values at once
                            Object.keys(phorometry).forEach(key => {
                                setValue(key as keyof IPhorometry, phorometry[key]);
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

    if (!patient) {
        return <Loading />
    }

    const onSubmit = async (data: any) => {
        setIsLoading(true)
        try {
            if (isLoaded && user && isValid) {

                const formData = {
                    patient_id: patient._id,
                    clinician_id: user?.id,
                    phorometry: { ...data, isComplete: true }
                }

                const response = await axios.post(`${SERVER}/api/add/new/patient-record`, formData)
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
            Alert.alert("Error", error.message)
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

    const alertRequired = () => {
        Alert.alert("Help", "Please fill out all fields with asterisk (*).")
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "white" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 80} // Adjust as needed
        >
            <Spinner animation="fade" visible={isLoading} />
            <Stack.Screen options={{
                headerTitle: () => (
                    <XStack alignItems='center' gap="$4" enterStyle={{ animation: "medium" }}>
                        <Avatar circular>
                            <Avatar.Image src={patient?.imageUrl || "https://w1.pngwing.com/pngs/991/900/png-transparent-black-circle-avatar-user-rim-black-and-white-line-auto-part-symbol-thumbnail.png"} />
                            <Avatar.Fallback delayMs={200} bg={theme.cyan5} />
                        </Avatar>
                        <YStack>
                            <SizableText color="white">{fullName}</SizableText>
                            <SizableText size={"$1"} color="white">Phorometry</SizableText>
                        </YStack>
                    </XStack>
                ),
                headerRight: () => <HelpCircle size={"$1"} color={"white"} onPress={alertRequired} />
            }} />
            {patient.records[0]?.phorometry?.isComplete &&
                <XStack alignItems="center" justifyContent="space-between" backgroundColor={"green"} paddingVertical="$2" paddingHorizontal="$3">
                    <SizableText color={"$green3"}><CheckCircle color={"$green5"} size={10} />  Completed</SizableText>
                    <SizableText size={"$1"} color={"$green3"}>{moment((patient.records[0]?.phorometry?.createdAt)).format("MMMM D, yyyy hh:mmA")}</SizableText>
                </XStack>
            }
            <Animated.ScrollView entering={FadeIn} style={{ flex: 1 }} contentContainerStyle={{ gap: 2 }}>
                <View padded>
                    <Title text='Phoria' />
                    <XStack width={"100%"} gap="$4" alignItems='center' justifyContent='space-between'>
                        <YStack flex={1}>
                            <Label text='Distance' />
                            <TextInput control={control} name='phoria.distance.horizontalvt3' label='Horizontal (VT# 3)' onSubmitEditing={() => focus(2)} required />
                            <TextInput ref={inputRefs.current[0]} control={control} name='phoria.distance.vt8' label='(VT# 8)' onSubmitEditing={() => focus(3)} required />
                            <TextInput ref={inputRefs.current[1]} control={control} name='phoria.distance.verticalvt12' label='Vertical (VT# 12)' onSubmitEditing={() => focus(4)} required />
                        </YStack>
                        <YStack flex={1}>
                            <Label text='Near' />
                            <TextInput ref={inputRefs.current[2]} control={control} name='phoria.near.horizontalvt13a' label='Horizontal (VT# 13A)' onSubmitEditing={() => focus(0)} required />
                            <TextInput ref={inputRefs.current[3]} control={control} name='phoria.near.vt13b' label='(VT# 13B)' onSubmitEditing={() => focus(1)} required />
                            <TextInput ref={inputRefs.current[4]} control={control} name='phoria.near.verticalvt18' label='Vertical (VT# 18)' onSubmitEditing={() => focus(5)} required />
                        </YStack>
                    </XStack>
                </View>
                <View padded>
                    <Title text='Duction' />
                    <Label text='Distance' />
                    <XStack flex={1} gap="$4">
                        <TextInput control={control} ref={inputRefs.current[5]} name='duction.distance.sbdod' label='ˢBD OD' placeholder='00/00' masked mask='99/99' onSubmitEditing={() => focus(6)} required />
                        <TextInput control={control} ref={inputRefs.current[6]} name='duction.distance.sbdos' label='ˢBD OS' placeholder='00/00' masked mask='99/99' onSubmitEditing={() => focus(7)} required />
                    </XStack>
                    <XStack flex={1} gap="$4">
                        <TextInput ref={inputRefs.current[7]} control={control} name='duction.distance.lbuod' label='ᴵBU OD' placeholder='00/00' masked mask='99/99' onSubmitEditing={() => focus(8)} required />
                        <TextInput ref={inputRefs.current[8]} control={control} name='duction.distance.lbuos' label='ᴵBU OS' placeholder='00/00' masked mask='99/99' onSubmitEditing={() => focus(9)} required />
                    </XStack>
                    <Label text='Near' />
                    <XStack flex={1} gap="$4">
                        <TextInput ref={inputRefs.current[9]} control={control} name='duction.near.sbdod' label='ˢBD OD' placeholder='00/00' masked mask='99/99' onSubmitEditing={() => focus(10)} required />
                        <TextInput ref={inputRefs.current[10]} control={control} name='duction.near.sbdos' label='ˢBD OS' placeholder='00/00' masked mask='99/99' onSubmitEditing={() => focus(11)} required />
                    </XStack>
                    <XStack flex={1} gap="$4">
                        <TextInput ref={inputRefs.current[11]} control={control} name='duction.near.lbuod' label='ᴵBU OD' placeholder='00/00' masked mask='99/99' onSubmitEditing={() => focus(12)} required />
                        <TextInput ref={inputRefs.current[12]} control={control} name='duction.near.lbuos' label='ᴵBU OS' placeholder='00/00' masked mask='99/99' onSubmitEditing={() => focus(13)} required />
                    </XStack>
                </View>
                <View padded>
                    <Title text='Vergence' />
                    <XStack gap="$4">
                        <Label text='Distance' />
                        <Label text='Near' />
                    </XStack>
                    <XStack gap="$4">
                        <TextInput ref={inputRefs.current[13]} control={control} name='vergence.distance.bovt9' label='BO (VT# 9)' placeholder='00/00' masked mask='99/99' onSubmitEditing={() => focus(14)} required />
                        <TextInput ref={inputRefs.current[14]} control={control} name='vergence.near.bovt16a' label='BO (VT# 16A)' placeholder='00/00' masked mask='99/99' onSubmitEditing={() => focus(15)} required />
                    </XStack>
                    <XStack gap="$4">
                        <TextInput ref={inputRefs.current[15]} control={control} name='vergence.distance.vt10' label='(VT# 10)' placeholder='00/00' masked mask='99/99' onSubmitEditing={() => focus(16)} required />
                        <TextInput ref={inputRefs.current[16]} control={control} name='vergence.near.vt16b' label='(VT# 16B)' placeholder='00/00' masked mask='99/99' onSubmitEditing={() => focus(17)} required />
                    </XStack>
                    <XStack gap="$4">
                        <TextInput ref={inputRefs.current[17]} control={control} name='vergence.distance.bivt11' label='BI (VT# 11)' placeholder='00/00' masked mask='99/99' onSubmitEditing={() => focus(18)} required />
                        <TextInput ref={inputRefs.current[18]} control={control} name='vergence.near.bivt17a' label='BI (VT# 17A)' placeholder='00/00' masked mask='99/99' onSubmitEditing={() => focus(19)} required />
                    </XStack>
                    <XStack gap="$4">
                        <XStack flex={1} />
                        <TextInput ref={inputRefs.current[19]} control={control} name='vergence.near.vt17b' label='(VT# 17B)' placeholder='00/00' masked mask='99/99' onSubmitEditing={() => focus(20)} required />
                    </XStack>
                </View>
                <View padded>
                    <Title text='Cross-Cylinder' />
                    <XStack gap="$4">
                        <Label text='Distance' />
                        <Label text='Near' />
                    </XStack>
                    <XStack gap="$4">
                        <TextInput ref={inputRefs.current[20]} control={control} name='crossCylinder.distance.dissociatedOD' label='Dissociated OD' placeholder='Dissociated OD' onSubmitEditing={() => focus(21)} required />
                        <TextInput ref={inputRefs.current[21]} control={control} name='crossCylinder.near.binocularOD' label='Binocular OD' placeholder='Binocular OD' onSubmitEditing={() => focus(22)} required />
                    </XStack>
                    <XStack gap="$4">
                        <TextInput ref={inputRefs.current[22]} control={control} name='crossCylinder.distance.phoriaOD' label='Phoria OS' placeholder='Distance Phoria OS' onSubmitEditing={() => focus(23)} required />
                        <TextInput ref={inputRefs.current[23]} control={control} name='crossCylinder.near.phoriaOS' label='Phoria OS' placeholder='Near Phoria OS' returnKeyType='done' required />
                    </XStack>
                </View>
                <View padded mb="$1">
                    <Title text='Accomodative Test' />
                    <TextArea control={control} name='accomodativeTest.aoa.od' label='AOA OD' required placeholder='AOA OD' />
                    <TextArea control={control} name='accomodativeTest.aoa.os' label='AOA OS' required placeholder='AOA OS' />
                    <TextArea control={control} name='accomodativeTest.aoa.ou' label='AOA OU' required placeholder='AOA OU' />
                    <TextInput ref={inputRefs.current[24]} control={control} name='accomodativeTest.pra' label='PRA' placeholder='PRA' onSubmitEditing={() => focus(25)} required />
                    <TextInput ref={inputRefs.current[25]} control={control} name='accomodativeTest.nra' label='NRA' placeholder='NRA' onSubmitEditing={() => focus(26)} required />
                    <TextInput ref={inputRefs.current[26]} control={control} name='accomodativeTest.gradientAcaRatio' label='Gradient AC/A Ratio' placeholder='Gradient AC/A Ratio' required />
                    <TextArea control={control} name='accomodativeTest.calculatedAcaRatio' label='Calculated AC/A Ratio' placeholder='Calculated AC/A Ratio' required />
                    <TextArea control={control} name='accomodativeTest.hoffstetersFormula' label='Hoffsteters Formula' placeholder='Hoffsteters Formula' onSubmitEditing={() => validateForm()} required />
                </View>
            </Animated.ScrollView>
            <View paddingVertical="$3" paddingHorizontal="$5">
                <CustomButton buttonText='Save' onPress={validateForm} />
            </View>
        </KeyboardAvoidingView>
    );
};

export default Phorometry;