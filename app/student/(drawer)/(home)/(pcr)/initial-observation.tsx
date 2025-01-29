import React, { memo, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { Avatar, Button, Checkbox, CheckboxProps, Input, Label, RadioGroup, Separator, SizableText, View, XStack, YStack } from 'tamagui'
import { theme } from '@/theme/theme'
import { Check, CheckCircle } from '@tamagui/lucide-icons'
import { ActivityIndicator, Alert, BackHandler, KeyboardAvoidingView, Platform } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { router, useFocusEffect, useGlobalSearchParams } from 'expo-router'
import { Stack } from 'expo-router'
import { usePatient } from '@/hooks/usePatient'
import { SubmitHandler, useForm } from 'react-hook-form'
import ControlledRadioGroup from '@/components/ControlledRadio'
import TextInput from '@/components/TextInput'
import ControlledCheckboxGroup from '@/components/ControlledCheckBox'
import { PatientCaseRecord } from '@/constants/interfaces'
import Spinner from 'react-native-loading-spinner-overlay'
import ControlledSelect from '@/components/ControlledSelect'
import axios from 'axios'
import { SERVER } from '@/constants/link'
import { useUser } from '@clerk/clerk-expo'
import Title from '@/components/Title'
import moment from 'moment'
import CustomButton from '@/components/CustomButton'
import SelectTextInput from '@/components/SelectTextInput'

const ComplaintsList = memo(({ complaints, type }: any) => {
    return (
        <>
            <SizableText mt="$4">{type} Complaints</SizableText>
            {complaints.length === 0 ? (
                <SizableText mt='$2' color={"$gray10"}>No complaints added yet.</SizableText>
            ) : (
                complaints.map((complaint: any, index: React.Key | null | undefined) => (
                    <SizableText key={index} mt="$2" color={"$gray10"}>• {complaint}</SizableText>
                ))
            )}
        </>
    );
});

const AddComplaint = memo(({ value, onChange, onAdd, placeholder }: any) => {
    return (
        <XStack alignItems='center' mt="$2" gap="$2">
            <Input
                flex={1}
                placeholder={placeholder}
                value={value}
                onChangeText={onChange} // Controlled input
            />
            <Button borderWidth={0} onPress={onAdd}>Add</Button>
        </XStack>
    );
});


const InitialObservation = () => {
    let { patientId, recordId, fullName, pid }: any = useGlobalSearchParams()
    const { user } = useUser()
    const { patient, fetchPatientById } = usePatient()
    const { handleSubmit, control, setValue, formState: { isValid, isValidating } } = useForm<PatientCaseRecord>();
    const [ocularHistoryCheckedValues,] = useState<string[]>([]);
    const [visualComplaints, setVisualComplaints] = useState<string[]>([]);
    const [nonVisualComplaints, setNonVisualComplaints] = useState<string[]>([]);
    const [saving, setSaving] = useState(false)
    // State for inputs
    const [visualInput, setVisualInput] = useState('');
    const [nonVisualInput, setNonVisualInput] = useState('');

    useFocusEffect(
        useCallback(() => {
            const fetchRecord = async () => {
                if (recordId) {
                    try {
                        const response = await axios.get(`${SERVER}/record/${recordId}`)

                        if (!response.data) return;

                        const fetchedPatientCaseRecord: PatientCaseRecord | any = response.data.patientCaseRecord

                        if (fetchedPatientCaseRecord) {

                            // Set multiple values at once
                            Object.keys(fetchedPatientCaseRecord).forEach(key => {
                                setValue(key as keyof PatientCaseRecord, fetchedPatientCaseRecord[key]);
                            });
                            setVisualComplaints(fetchedPatientCaseRecord.chiefComplaints.visualComplaints)
                            setNonVisualComplaints(fetchedPatientCaseRecord.chiefComplaints.nonVisualComplaints)
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
            fetchRecord()
            fetchPatientById(patientId)
        }, [patientId])
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


    const submitAlert = () => {
        if (isValid) {
            Alert.alert(
                "Double check information before submitting.",
                "Would you like to proceed?",
                [
                    { text: "Wait", style: 'cancel' },
                    { text: "Yes", onPress: () => { handleSubmit(onSubmit)() } }
                ]
            )
        } else {
            Alert.alert(
                "Failed",
                "Please fill out all required fields."
            );
        }
    }
    // Memoized function to add a visual complaint
    const addVisualComplaint = useCallback(() => {
        if (visualInput) {
            setVisualComplaints(prev => [...prev, visualInput]);
            setVisualInput(''); // Clear input after adding
        }
    }, [visualInput]);

    // Memoized function to add a non-visual complaint
    const addNonVisualComplaint = useCallback(() => {
        if (nonVisualInput) {
            setNonVisualComplaints(prev => [...prev, nonVisualInput]);
            setNonVisualInput(''); // Clear input after adding
        }
    }, [nonVisualInput]);
    const onSubmit: SubmitHandler<PatientCaseRecord> = async (data: PatientCaseRecord) => {
        setSaving(true)

        try {
            const patientCaseRecord = {
                ...data,
                isComplete: true,
                chiefComplaints: {
                    visualComplaints: visualComplaints,
                    nonVisualComplaints: nonVisualComplaints,
                },
            }

            const body = {
                patientId: patient?._id,
                clinicianId: user?.id,
                patientCaseRecord: patientCaseRecord
            }

            const response = await axios.put(`${SERVER}/patient/record/edit`, body)
            if (response.data.success) {
                Alert.alert(
                    "Success",
                    "Patient case record has been completed!",
                    [{ text: "Okay" }]
                )
                router.back()
            }
        } catch (error) {
            console.log(JSON.stringify(error))
        } finally {
            setSaving(false)
        }
    }

    if (!patient) {
        return (
            <View flex={1} alignItems='center' paddingTop="$4">
                <ActivityIndicator size={"large"} color={theme.cyan10} />
            </View>
        )
    }

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
                            <SizableText size={"$1"} color="white">Initial Observation</SizableText>
                        </YStack>
                    </XStack>
                )
            }} />
            {patient.records[0]?.patientCaseRecord?.isComplete &&
                <XStack alignItems="center" justifyContent="space-between" backgroundColor={"green"} paddingVertical="$2" paddingHorizontal="$3">
                    <SizableText color={"$green3"}><CheckCircle color={"$green5"} size={10} />  Completed</SizableText>
                    <SizableText size={"$1"} color={"$green3"}>{moment((patient.records[0]?.patientCaseRecord?.createdAt)).format("MMMM D, yyyy hh:mmA")}</SizableText>
                </XStack>
            }
            <Animated.ScrollView entering={FadeIn} style={{ flex: 1 }} contentContainerStyle={{ gap: 2 }}>
                <View bg={"white"} p="$5">
                    <Title text='initial observation' />
                    <ControlledRadioGroup
                        name='initialObservation.facialSymmetry'
                        label='Facial Symmetry'
                        options={[
                            { value: "symmetrical", label: "Symmetrical" },
                            { value: "non-symmetrical", label: "Non-symmetrical" },
                        ]}
                        control={control}
                        required
                    />
                    <ControlledRadioGroup
                        name='initialObservation.patientGait'
                        label={`Patient's Gait`}
                        options={[
                            { value: "ambulatory", label: "Ambulatory" },
                            { value: "non-ambulatory", label: "Non-ambulatory" },
                        ]}
                        control={control}
                        required
                    />
                    <ControlledRadioGroup
                        name='initialObservation.headPosition'
                        label={`Head Position`}
                        options={[
                            { value: "straight", label: "Straight" },
                            { value: "tilted-left", label: "tilted-left" },
                            { value: "tilted-right", label: "tilted-right" },
                        ]}
                        control={control}
                        required
                    />
                    <ControlledRadioGroup
                        name='initialObservation.odor'
                        label={`Odor`}
                        options={[
                            { value: "pleasant", label: "pleasant" },
                            { value: "pungent", label: "pungent" },
                        ]}
                        control={control}
                        required
                    />
                    <ControlledRadioGroup
                        name='initialObservation.speech'
                        label={`Speech`}
                        options={[
                            { value: "normal", label: "normal" },
                            { value: "slurred", label: "slurred" },
                        ]}
                        control={control}
                        required
                    />
                    <SelectTextInput
                        control={control}
                        name='initialObservation.skinColor'
                        label='Skin Color'
                        placeholder='Select'
                        required
                        options={[
                            { label: "Fair", value: "fair" },
                            { label: "Light", value: "light" },
                            { label: "Medium", value: "medium" },
                            { label: "Dark", value: "dark" },
                        ]}
                    />
                </View>
                <View bg={"white"} p="$5">
                    <Title text='chief complaints' />
                    <ComplaintsList complaints={visualComplaints} type="Visual" />
                    <AddComplaint
                        value={visualInput}
                        onChange={setVisualInput}
                        onAdd={addVisualComplaint}
                        placeholder='Add visual complaint'
                    />
                    <Separator mt="$4" />
                    <ComplaintsList complaints={nonVisualComplaints} type="Non-Visual" />
                    <AddComplaint
                        value={nonVisualInput}
                        onChange={setNonVisualInput}
                        onAdd={addNonVisualComplaint}
                        placeholder='Add non-visual complaint'
                    />
                </View>
                <View bg={"white"} p="$5">
                    <Title text='ocular history' />
                    <TextInput name='ocularHistory.similarProblemBefore' control={control} label='Similar problem before' placeholder='Enter similar problem before' required />
                    <TextInput name='ocularHistory.majorIllness' control={control} label='Major Illness' placeholder='Enter major illness' required />
                    <TextInput name='ocularHistory.previousEyeSurgery' control={control} label='Previous eye surgery' placeholder='Enter previous eye surgery' required />
                    <TextInput name='ocularHistory.majorProblems' control={control} label='Major problems' placeholder='Enter major problems' required />
                </View>
                <View bg={"white"} p='$5'>
                    <Title text='spectacle history' />
                    <ControlledRadioGroup
                        name='spectacleHistory.usingOrWearingSpectacle'
                        label={`Using or wearing spectacle?`}
                        options={[
                            { value: "yes", label: "yes" },
                            { value: "no", label: "no" },
                        ]}
                        control={control}
                        required
                    />
                    <TextInput name="spectacleHistory.spectaclePrescription" control={control} label='Prescription' placeholder='Enter prescription' required />
                    <TextInput name="spectacleHistory.spectacleDuration" control={control} label='Duration' placeholder='Enter duration' required />
                    <TextInput name="spectacleHistory.spectacleFrequency" control={control} label='Frequency' placeholder='Enter frequency' type="numeric" required />
                </View>
                <View bg={"white"} p='$5'>
                    <Title text='contact lens history' />
                    <ControlledRadioGroup
                        name='contactLensHistory.usingOrWearingContactLens'
                        label={`Using or wearing contact lens?`}
                        options={[
                            { value: "yes", label: "yes" },
                            { value: "no", label: "no" },
                        ]}
                        control={control}
                        required
                    />
                    <TextInput name="contactLensHistory.contactLensPrescription" control={control} label='Prescription' placeholder='Enter prescription' required />
                    <TextInput name="contactLensHistory.contactLensDuration" control={control} label='Duration' placeholder='Enter duration' required />
                    <TextInput name="contactLensHistory.contactLensFrequency" control={control} label='Frequency' placeholder='Enter frequency' type="numeric" required />
                    <TextInput name="contactLensHistory.contactLensBrand" control={control} label='Brand' placeholder='Enter brand' required />
                    <TextInput name="contactLensHistory.contactLensType" control={control} label='Type' placeholder='Enter type' required />
                    <ControlledRadioGroup
                        name='contactLensHistory.usesEyedrop'
                        label={`Uses Eyedrop?`}
                        options={[
                            { value: "yes", label: "yes" },
                            { value: "no", label: "no" },
                        ]}
                        control={control}
                        required
                    />
                    <TextInput name="contactLensHistory.contactLensDosage" control={control} label='Dosage' placeholder='Enter dosage' required />

                </View>
                <View padding="$5" backgroundColor={"white"}>
                    <Title text='medical history' />

                    <TextInput name="medicalHistory.medicineType" control={control} label='Medicine Type' placeholder='Enter medicine type' required />
                    <TextInput name="medicalHistory.medicalDuration" control={control} label='Duration' placeholder='Enter duration' required />
                    <TextInput name="medicalHistory.medicalDosage" control={control} label='Dosage' placeholder='Enter dosage' required />
                    <TextInput name="medicalHistory.medicalAllergies" control={control} label='Allergies' placeholder='Enter allergies' required />
                    <TextInput name="medicalHistory.hypersensitivy" control={control} label='Hypersensitivity' placeholder='Enter hypersensitivity' required />
                </View>
                <View backgroundColor={"white"} p="$5">
                    <Title text='family ocular and health history' />
                    <ControlledCheckboxGroup
                        name="familyOcularAndHealthHistory.history"
                        control={control}
                        options={[
                            { label: 'Glaucoma', value: 'Glaucoma' },
                            { label: 'Cataract', value: 'Cataract' },
                            { label: 'Poor Vision', value: 'Poor Vision' },
                            { label: 'Myopia', value: 'Myopia' },
                            { label: 'Astigmatism', value: 'Astigmatism' },
                            { label: 'Hyperopia', value: 'Hyperopia' },
                            { label: 'Other', value: 'Other' },
                        ]}
                        onOtherChange={() => console.log('Other selected')}
                    />

                    {/* Conditionally Render Input for "Other" */}
                    {ocularHistoryCheckedValues.includes('Other') && (
                        <Animated.View entering={FadeIn}>
                            <TextInput name='familyOcularAndHealthHistory.other' placeholder='specify' control={control} />
                        </Animated.View>
                    )}
                </View>

                {/* Health History Section */}
                <View backgroundColor={"white"} p="$5">
                    <Title text='social history' />
                    <ControlledCheckboxGroup
                        name="socialHistory.socialHistory"
                        control={control}
                        options={[
                            { label: 'Smoke', value: 'Smoke' },
                            { label: 'Vape', value: 'Vape' },
                            { label: 'Alcohol', value: 'Alcohol' },
                        ]}
                    />

                    {/* Other inputs like duration */}
                    <TextInput name='socialHistory.socialHistoryDuration' control={control} label='Duration' placeholder='Enter duration' required />
                </View>
            </Animated.ScrollView>
            <Animated.View style={{ backgroundColor: "white" }}>
                <CustomButton
                    marginVertical="$3"
                    marginHorizontal="$5"
                    disabled={saving}
                    onPress={submitAlert}
                >
                    Save
                </CustomButton>
            </Animated.View>
        </KeyboardAvoidingView>

    )
}

export function RadioGroupItemWithLabel(props: {
    questionName: string
    value: string
    label: string
}) {
    const id = `${props.questionName}-${props.value}`
    return (
        <XStack flex={1} alignItems="center" gap="$4">
            <RadioGroup.Item value={props.value} id={id}>
                <RadioGroup.Indicator />
            </RadioGroup.Item>
            <Label htmlFor={id}>
                {props.label}
            </Label>
        </XStack>
    )
}

export function CheckboxWithLabel({
    label,
    isChecked,
    onChange,
    ...checkboxProps
}: CheckboxProps & { label?: string; isChecked: boolean; onChange: () => void }) {
    const id = `${label?.toLowerCase()}`
    return (
        <XStack width={300} alignItems="center" gap="$4">
            <Checkbox id={id} checked={isChecked} onCheckedChange={onChange} {...checkboxProps}>
                <Checkbox.Indicator>
                    <Check color={"$green10"} />
                </Checkbox.Indicator>
            </Checkbox>

            <Label htmlFor={id}>
                {label}
            </Label>
        </XStack>
    )
}

export default InitialObservation