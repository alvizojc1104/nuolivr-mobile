import ControlledRadioGroup from '@/components/ControlledRadio'
import Loading from '@/components/Loading'
import TextInput from '@/components/TextInput'
import Title from '@/components/Title'
import { SERVER } from '@/constants/link'
import { usePatient } from '@/hooks/usePatient'
import { theme } from '@/theme/theme'
import { useUser } from '@clerk/clerk-expo'
import { CheckCircle } from '@tamagui/lucide-icons'
import axios from 'axios'
import { router, Stack, useFocusEffect, useGlobalSearchParams } from 'expo-router'
import moment from 'moment'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Alert, BackHandler, KeyboardAvoidingView, Platform, } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { Avatar, Button, Heading, Label, RadioGroup, ScrollView, SizableText, View, XStack, YStack } from 'tamagui'

interface EyeTriage {
    _id: string;
    flashes: string;
    flashesStarted: string;
    hasFlashesOrFloaters: 'yes' | 'no';
    hasRecentIllnesses: 'yes' | 'no';
    isExperiencingPainItchingDiscomfort: 'yes' | 'no';
    isExperiencingSymptoms: 'yes' | 'no';
    isExposedToChemicalIrritantsAllergens: 'yes' | 'no';
    symptomBegins: string;
    symptomsSpecified: string;
}


const EyeTriage = () => {
    const { user } = useUser()
    const { control, handleSubmit, formState: { errors }, setValue } = useForm<EyeTriage>();
    const [showFlashesQuestion, setShowFlashesQuestion] = useState(false);
    const { patientId, recordId, fullName, pid }: any = useGlobalSearchParams();
    const { patient, loading, fetchPatientById } = usePatient();
    const [saving, setSaving] = useState(false)

    useFocusEffect(
        useCallback(() => {

            const fetchRecord = async () => {
                if (recordId) {
                    try {
                        const response = await axios.get(`${SERVER}/record/${recordId}`,)

                        if (!response.data) return;

                        const fetchedEyeTriage = response.data.eyeTriage

                        if (fetchedEyeTriage) {

                            // Set multiple values at once
                            Object.keys(fetchedEyeTriage).forEach(key => {
                                setValue(key as keyof EyeTriage, fetchedEyeTriage[key]);
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
            fetchPatientById(patientId)
            fetchRecord()
        },
            [patientId],
        )

    )

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

    const onSubmit = async (data: EyeTriage) => {
        setSaving(true)
        const body = {
            patientId: patient?._id,
            clinicianId: user?.id,
            eyeTriage: { ...data, isComplete: true }
        }
        console.log(body)
        try {
            const response = await axios.put(`${SERVER}/patient/record/edit`, body)
            Alert.alert(
                "Success",
                "Eye triage has been completed!",
                [
                    { text: "Okay" }
                ]
            )
            router.back()
        } catch (error) {
            alert(JSON.stringify(error))
        } finally {
            setSaving(false)
        }
    };

    const handleRadioChange = (value: string) => {
        setShowFlashesQuestion(value === 'yes');
    }

    if (!patient) {
        return (
            <Loading />
        )
    }

    console.log("eye triage render")

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 80} // Adjust as needed
        >
            <Spinner visible={saving} animation="fade" />
            <Stack.Screen options={{
                headerTitle: () => (
                    <XStack alignItems='center' gap="$4">
                        <Avatar circular>
                            <Avatar.Image src={patient?.imageUrl || "https://w1.pngwing.com/pngs/991/900/png-transparent-black-circle-avatar-user-rim-black-and-white-line-auto-part-symbol-thumbnail.png"} />
                            <Avatar.Fallback delayMs={200} bg={theme.cyan5} />
                        </Avatar>
                        <YStack>
                            <SizableText color="white">{fullName}</SizableText>
                            <SizableText size={"$1"} color="white">Eye Triage</SizableText>
                        </YStack>
                    </XStack>
                )
            }} />
            {patient.records[0]?.eyeTriage?.isComplete &&
                <XStack alignItems="center" justifyContent="space-between" backgroundColor={"green"} paddingVertical="$2" paddingHorizontal="$3">
                    <SizableText color={"$green3"}><CheckCircle color={"$green5"} size={10} />  Completed</SizableText>
                    <SizableText size={"$1"} color={"$green3"}>{moment((patient.records[0]?.eyeTriage?.createdAt)).format("MMMM D, yyyy hh:mmA")}</SizableText>
                </XStack>
            }
            <Animated.ScrollView entering={FadeIn} style={{ flex: 1 }} contentContainerStyle={{ gap: 2, }} showsVerticalScrollIndicator={false}
            >
                <View padding="$5">
                    <Title text='eye triage' />
                    <ControlledRadioGroup
                        name='isExperiencingPainItchingDiscomfort'
                        label='Is patient experiencing any pain, itching or discomfort in their eyes?'
                        options={[
                            { value: "yes", label: "Yes" },
                            { value: "no", label: "No" },
                        ]}
                        control={control}
                        required
                    />
                    <ControlledRadioGroup
                        name='isExperiencingSymptoms'
                        label='Is the patient experiencing ANY of these OTHER symptoms: loss of vision (central and peripheral), gray or black vision, web (or cloudy) vision?'
                        options={[
                            { value: "yes", label: "Yes" },
                            { value: "no", label: "No" },
                        ]}
                        control={control}
                        required
                    />
                    <TextInput name='symptomsSpecified' control={control} placeholder='Specify symptoms' label='Specify:' />
                    <ControlledRadioGroup
                        name='hasRecentIllnesses'
                        label='Did the patient have any recent illnesses, particularly viral or bacterial infections?'
                        options={[
                            { value: "yes", label: "Yes" },
                            { value: "no", label: "No" },
                        ]}
                        control={control}
                        required
                    />
                    <ControlledRadioGroup
                        name='isExposedToChemicalIrritantsAllergens'
                        label='Was the patient exposed to any chemicals, irritants, or allergens recently?'
                        options={[
                            { value: "yes", label: "Yes" },
                            { value: "no", label: "No" },
                        ]}
                        control={control}
                        required
                    />
                    <SizableText mt="$4">Was the patient experiencing any flashes of light or floaters in their vision?<SizableText color={"red"}>*</SizableText></SizableText>
                    <Controller
                        control={control}
                        name="hasFlashesOrFloaters"
                        rules={{ required: "Required" }} // Add validation rules
                        render={({ field: { onChange, value } }) => (
                            <RadioGroup value={value} onValueChange={(val) => { onChange(val); handleRadioChange(val); }}>
                                <XStack alignItems="center">
                                    <RadioGroupItemWithLabel questionName="question5" value="yes" label="Yes" />
                                    <RadioGroupItemWithLabel questionName="question5" value="no" label="No" />
                                </XStack>
                            </RadioGroup>
                        )}
                    />
                    {errors.hasFlashesOrFloaters && <SizableText size={"$2"} color="red">{errors.hasFlashesOrFloaters.message}</SizableText>}

                    {showFlashesQuestion && (
                        <Animated.View entering={FadeIn} exiting={FadeOut}>
                            <TextInput name='flashesStarted' control={control} placeholder='Enter how long' label='How long did the patient notice the flashes?' required />
                            <SizableText mt="$4">Have they increased in number?</SizableText>
                            <Controller
                                control={control}
                                name="flashes"
                                rules={{ required: "Required" }} // Add validation rules
                                render={({ field: { onChange, value } }) => (
                                    <RadioGroup value={value} onValueChange={onChange}>
                                        <XStack alignItems="center">
                                            <RadioGroupItemWithLabel questionName="flashes" value="one eye" label="One eye" />
                                            <RadioGroupItemWithLabel questionName="flashes" value="both eyes" label="Both eyes" />
                                        </XStack>
                                    </RadioGroup>
                                )}
                            />
                            {errors.flashes && <SizableText size={"$2"} color="red">{errors.flashes.message}</SizableText>}
                            <TextInput name='symptomBegins' control={control} label='When did the symptoms begin, and have they worsened over time?' placeholder={"Specify"} required />
                        </Animated.View>
                    )}
                </View>
            </Animated.ScrollView>
            <View paddingVertical="$3" paddingHorizontal="$5">
                <Button
                    onPress={handleSubmit(onSubmit)}
                    borderWidth={0}
                    backgroundColor={theme.cyan10}
                    color={"white"}
                    pressStyle={{ backgroundColor: theme.cyan11 }}
                >
                    Save
                </Button>
            </View>
        </KeyboardAvoidingView>

    );
}

export function RadioGroupItemWithLabel(props: {
    questionName: string;
    value: string;
    label: string;
}) {
    const id = `${props.questionName}-${props.value}`;
    return (
        <XStack flex={1} alignItems="center" gap="$4">
            <RadioGroup.Item value={props.value} id={id}>
                <RadioGroup.Indicator />
            </RadioGroup.Item>
            <Label htmlFor={id}>
                {props.label}
            </Label>
        </XStack>
    );
}

export default EyeTriage;