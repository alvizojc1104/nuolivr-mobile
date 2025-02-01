import Loading from "@/components/Loading"
import { usePatient } from "@/hooks/usePatient"
import { useUser } from "@clerk/clerk-expo"
import { router, Stack, useFocusEffect, useLocalSearchParams } from "expo-router"
import React, { useCallback, useLayoutEffect, useRef, useState } from "react"
import { Alert, BackHandler, KeyboardAvoidingView, Platform } from "react-native"
import { Avatar, SizableText, XStack, YStack } from "tamagui"
import View from "@/components/View"
import Title from "@/components/Title"
import Label from "@/components/Label"
import TextInput from "@/components/TextInput"
import { SubmitHandler, useForm } from "react-hook-form"
import TextArea from "@/components/TextArea"
import Spinner from "react-native-loading-spinner-overlay"
import { theme } from "@/theme/theme"
import CustomButton from "@/components/CustomButton"
import { VisualAcuityForm } from "@/constants/interfaces"
import axios from "axios"
import { SERVER } from "@/constants/link"
import moment from "moment"
import { CheckCircle } from "@tamagui/lucide-icons"
import Animated, { FadeIn } from "react-native-reanimated"
import SelectTextInput from "@/components/SelectTextInput"

const VisualAcuity = () => {
    const { handleSubmit, setValue, control, formState: { isValid } } = useForm<VisualAcuityForm>({ mode: "onChange" })
    const { isLoaded, user } = useUser()
    let { patientId, recordId, fullName }: any = useLocalSearchParams()
    const { fetchPatientById, patient } = usePatient()
    const [isLoading, setIsLoading] = useState(false)

    // Create an array of refs
    const inputRefs = useRef<any>(Array.from({ length: 27 }, () => React.createRef()));



    // Fetch patient data and update the component as needed
    useFocusEffect(
        useCallback(() => {
            const fetchRecord = async () => {
                if (recordId) {
                    try {
                        const response = await axios.get(`${SERVER}/record/${recordId}`,)

                        if (!response.data) return;

                        const visualAcuityForm: VisualAcuityForm | any = response.data.visualAcuity

                        if (visualAcuityForm) {
                            // Set multiple values at once
                            Object.keys(visualAcuityForm).forEach(key => {
                                setValue(key as keyof VisualAcuityForm, visualAcuityForm[key]);
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

    const onSubmit: SubmitHandler<VisualAcuityForm> = async (data: VisualAcuityForm) => {
        setIsLoading(true)
        try {
            if (isLoaded && user) {

                const formData = {
                    patientId: patient._id,
                    clinicianId: user?.id,
                    visualAcuity: { ...data, isComplete: true }
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

    console.log("va rendered")
    const submitForm = async () => {
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
            Alert.alert(
                "Failed",
                "Please fill out all required fields."
            )
        }
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
                            <SizableText size={"$1"} color="white">Visual Acuity</SizableText>
                        </YStack>
                    </XStack>
                )
            }} />
            {patient.records[0]?.visualAcuity?.isComplete &&
                <XStack alignItems="center" justifyContent="space-between" backgroundColor={"green"} paddingVertical="$2" paddingHorizontal="$3">
                    <SizableText color={"$green3"}><CheckCircle color={"$green5"} size={10} />  Completed</SizableText>
                    <SizableText size={"$1"} color={"$green3"}>{moment((patient.records[0]?.visualAcuity?.createdAt)).format("MMMM D, yyyy hh:mmA")}</SizableText>
                </XStack>
            }
            <Animated.ScrollView entering={FadeIn} style={{ flex: 1 }} contentContainerStyle={{ gap: 2 }}>
                <View padded>
                    <Title text="aided visual acuity" />
                    <Label text="distance" />
                    <TextInput
                        ref={inputRefs.current[0]}
                        control={control}
                        name="aided.distance.od"
                        label="OD:"
                        placeholder="Enter aided distance OD"
                        onSubmitEditing={() => inputRefs.current[1].current.focus()}
                        required
                    />
                    <TextInput
                        ref={inputRefs.current[1]}
                        control={control}
                        name="aided.distance.os"
                        label="OS:"
                        placeholder="Enter aided distance OS"
                        onSubmitEditing={() => inputRefs.current[2].current.focus()}
                        required
                    />
                    <TextInput
                        ref={inputRefs.current[2]}
                        control={control}
                        name="aided.distance.ou"
                        label="OU:"
                        placeholder="Enter aided distance OU"
                        onSubmitEditing={() => inputRefs.current[3].current.focus()}
                        required
                    />
                    <Label text="Near" />
                    <TextInput
                        ref={inputRefs.current[3]}
                        control={control}
                        name="aided.near.od"
                        label="Near OD"
                        placeholder="Enter aided near OD"
                        onSubmitEditing={() => inputRefs.current[4].current.focus()}
                        required
                    />
                    <TextInput
                        ref={inputRefs.current[4]}
                        control={control}
                        name="aided.near.os"
                        label="OS:"
                        placeholder="Enter aided near OS"
                        onSubmitEditing={() => inputRefs.current[5].current.focus()}
                        required
                    />
                    <TextInput
                        ref={inputRefs.current[5]}
                        control={control}
                        name="aided.near.ou"
                        label="OU:"
                        placeholder="Enter aided near OU"
                        required
                    />
                    <TextArea
                        control={control}
                        name="aided.note"
                        placeholder="Enter notes here"
                        label="Notes:"
                    />
                </View>
                <View padded>
                    <Title text="unaided visual acuity" />
                    <Label text="distance" />
                    <TextInput
                        ref={inputRefs.current[6]}
                        control={control}
                        name="unaided.distance.od"
                        label="OD:"
                        placeholder="Enter unaided distance OD"
                        onSubmitEditing={() => inputRefs.current[7].current.focus()}
                        required
                    />
                    <TextInput
                        ref={inputRefs.current[7]}
                        control={control}
                        name="unaided.distance.os"
                        label="OS:"
                        placeholder="Enter unaided distance OS"
                        onSubmitEditing={() => inputRefs.current[8].current.focus()}
                        required
                    />
                    <TextInput
                        ref={inputRefs.current[8]}
                        control={control}
                        name="unaided.distance.ou"
                        label="OU:"
                        placeholder="Enter unaided distance OU"
                        onSubmitEditing={() => inputRefs.current[9].current.focus()}
                        required
                    />
                    <Label text="Near" />
                    <TextInput
                        ref={inputRefs.current[9]}
                        control={control}
                        name="unaided.near.od"
                        label="OD:"
                        placeholder="Enter unaided near OD"
                        onSubmitEditing={() => inputRefs.current[10].current.focus()}
                        required
                    />
                    <TextInput
                        ref={inputRefs.current[10]}
                        control={control}
                        name="unaided.near.os"
                        label="OS:"
                        placeholder="Enter unaided near OS"
                        onSubmitEditing={() => inputRefs.current[11].current.focus()}
                        required
                    />
                    <TextInput
                        ref={inputRefs.current[11]}
                        control={control}
                        name="unaided.near.ou"
                        label="OU:"
                        placeholder="Enter unaided near OU"
                        required
                    />
                    <TextArea
                        control={control}
                        name="unaided.note"
                        placeholder="Enter notes here"
                        label="Notes:"
                    />
                </View>
                <View padded>
                    <Title text="pinhole visual acuity" />
                    <TextInput
                        ref={inputRefs.current[12]}
                        control={control}
                        name="pinhole.OD"
                        label="OD"
                        placeholder="Enter distanced pinhole OD"
                        onSubmitEditing={() => inputRefs.current[13].current.focus()}
                        required
                    />
                    <TextInput
                        ref={inputRefs.current[13]}
                        control={control}
                        name="pinhole.OS"
                        label="OS"
                        placeholder="Enter distanced pinhole OS"
                        required
                    />
                    <TextArea
                        control={control}
                        name="pinhole.note"
                        placeholder="Enter notes here"
                        label="Notes:"
                    />
                </View>
                <View padded mb="$1">
                    <Title text="refraction" />
                    <Label text="OD" />
                    <TextInput
                        ref={inputRefs.current[14]}
                        control={control}
                        name="refraction.od.od"
                        label="OD"
                        placeholder="Enter refraction OD"
                        onSubmitEditing={() => inputRefs.current[15].current.focus()}
                        required
                    />
                    <TextInput
                        ref={inputRefs.current[15]}
                        control={control}
                        name="refraction.od.dsph"
                        label="Dsph:"
                        placeholder="Enter dsph OD"
                        onSubmitEditing={() => inputRefs.current[16].current.focus()}
                        required
                    />
                    <TextInput
                        ref={inputRefs.current[16]}
                        control={control}
                        name="refraction.od.dcylx"
                        label="Dcyl x="
                        placeholder="Enter dcyl x OD"
                        required
                    />
                    <SelectTextInput
                        control={control}
                        name="refraction.od.va"
                        placeholder="Select VA"
                        label="VA"
                        options={[{ label: "Far", value: "far" }, { label: "Near", value: "near" }]}
                        required
                    />
                    <Label text="OS" />
                    <TextInput
                        ref={inputRefs.current[17]}
                        control={control}
                        name="refraction.os.os"
                        label="OS"
                        placeholder="Enter refraction OS"
                        onSubmitEditing={() => inputRefs.current[18].current.focus()}
                        required
                    />
                    <TextInput
                        ref={inputRefs.current[18]}
                        control={control}
                        name="refraction.os.dsph"
                        label="Dsph:"
                        placeholder="Enter dsph OS"
                        onSubmitEditing={() => inputRefs.current[19].current.focus()}
                        required
                    />
                    <TextInput
                        ref={inputRefs.current[19]}
                        control={control}
                        name="refraction.os.dcylx"
                        label="Dcyl x:"
                        placeholder="Enter dcyl x OS"
                        required
                    />
                    <SelectTextInput
                        control={control}
                        name="refraction.os.va"
                        placeholder="Select VA"
                        label="VA"
                        options={[{ label: "Far", value: "far" }, { label: "Near", value: "near" }]}
                        required
                    />
                    <TextArea
                        ref={inputRefs.current[23]}
                        required
                        control={control}
                        name="refraction.autorefractometer"
                        placeholder="Enter autorefractometer"
                        label="Autorefractometer:"
                    />
                    <TextArea
                        ref={inputRefs.current[24]}
                        required
                        control={control}
                        name="refraction.add"
                        placeholder="Enter add"
                        label="Add:"
                    />
                    <TextArea
                        ref={inputRefs.current[25]}
                        required
                        control={control}
                        name="refraction.modifications"
                        placeholder="Enter modifications"
                        label="Modifications:"
                    />
                    <TextArea
                        ref={inputRefs.current[26]}
                        required
                        control={control}
                        name="refraction.finalRx"
                        label="FINAL RX"
                        placeholder="Enter final rx"
                    />
                </View>
            </Animated.ScrollView>
            <View>
                <CustomButton disabled={isLoading} buttonText="Save" onPress={submitForm} margin="$3" />
            </View>
        </KeyboardAvoidingView>
    )
}

export default VisualAcuity