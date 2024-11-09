import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Avatar, Input, SizableText, View as TView, XStack } from 'tamagui';
import { Alert, BackHandler, KeyboardAvoidingView, Platform, TextInput as RNTextInput } from 'react-native';
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
import { CheckCircle } from '@tamagui/lucide-icons';
import moment from 'moment';
import Animated, { FadeIn } from 'react-native-reanimated';
import Label from '@/components/Label';
import Title from '@/components/Title';
import ControlledTextInput from '@/components/FloatingLabelInput';

interface FormData {
    firstField: string;
    secondField: string;
}

const Phorometry: React.FC = () => {
    const { handleSubmit, setValue, control, formState: { isValid } } = useForm({ mode: "onChange" })
    const { isLoaded, user } = useUser()
    let { patientId, recordId, fullName }: any = useLocalSearchParams()
    const { fetchPatientById, patient } = usePatient()
    const [isLoading, setIsLoading] = useState(false)

    // Fetch patient data and update the component as needed
    useFocusEffect(
        useCallback(() => {
            const fetchRecord = async () => {
                if (recordId) {
                    try {
                        const response = await axios.get(`${SERVER}/api/get/patient-record/${recordId}`,)

                        if (!response.data) return;

                        const visualAcuityForm: any = response.data.visualAcuity

                        if (visualAcuityForm) {
                            return;
                            // Set multiple values at once
                            // Object.keys(visualAcuityForm).forEach(key => {
                            //     setValue(key as keyof VisualAcuityForm, visualAcuityForm[key]);
                            // });
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

    const onSubmit = (data: any) => {
        console.log(data);
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
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
            {patient.records[0]?.phorometry?.isComplete &&
                <XStack alignItems="center" justifyContent="space-between" backgroundColor={"green"} paddingVertical="$2" paddingHorizontal="$3">
                    <SizableText color={"$green3"}><CheckCircle color={"$green5"} size={10} />  Completed</SizableText>
                    <SizableText size={"$1"} color={"$green3"}>{moment((patient.records[0]?.phorometry?.createdAt)).format("MMMM D, yyyy hh:mmA")}</SizableText>
                </XStack>
            }
            <Animated.ScrollView entering={FadeIn} style={{ flex: 1 }} contentContainerStyle={{ gap: 2 }}>
                <View padded gap="$4">
                    <Title text='Phoria' />
                    <XStack width={"100%"} gap="$2" alignItems='center' justifyContent='space-between'>
                        <Label text='Distance' />
                        <Label text='Near' />
                    </XStack>
                    <XStack width={"100%"}>
                        <ControlledTextInput control={control} label='Horizontal (VT# 3)' name='phoria.distance.horizontalvt#3' />
                        <ControlledTextInput control={control} label='Horizontal (VT# 3)' name='phoria.distance.horizontalvt#3' />
                    </XStack>
                </View>
            </Animated.ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Phorometry;