import SelectTextInput from '@/components/SelectTextInput'
import CustomButton from '@/components/CustomButton'
import Loading from '@/components/Loading'
import TextArea from '@/components/TextArea'
import TextInput from '@/components/TextInput'
import Title from '@/components/Title'
import View from '@/components/View'
import { PreliminaryExamination } from '@/constants/interfaces'
import { usePatient } from '@/hooks/usePatient'
import { useUser } from '@clerk/clerk-expo'
import { Camera, CheckCircle, Pen } from '@tamagui/lucide-icons'
import { router, Stack, useGlobalSearchParams } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Alert, BackHandler, KeyboardAvoidingView, Platform } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { Avatar, Card, Heading, Image, SizableText, XStack, YStack, } from 'tamagui'
import * as ImagePicker from "expo-image-picker"
import useStore from '@/hooks/useStore'
import ControlledRadioGroup from '@/components/ControlledRadio'
import Spinner from 'react-native-loading-spinner-overlay'
import { storage } from '@/firebaseConfig'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import axios from 'axios'
import { SERVER } from '@/constants/link'
import { theme } from '@/theme/theme'
import moment from 'moment'
import CustomTextInput from '@/components/CustomTextInput'

const cornealImgPlaceholder = require("@/assets/images/eyecheck.png")
const od = require("@/assets/images/oddraw.png")
const os = require("@/assets/images/osdraw.png")

const coverTestOptions = [
    { label: "Hyperphoria", value: "hyperphoria" },
    { label: "Hypophoria", value: "Hypophoria" },
    { label: "Orthophoria", value: "Orthophoria" },
    { label: "Esophoria", value: "esophoria" },
    { label: "Exophoria", value: "exophoria" },
    { label: "Hypertropia", value: "hypertropia" },
    { label: "Hypotropia", value: "hypotropia" },
    { label: "Orthotropia", value: "orthotropia" },
    { label: "Esotropia", value: "esotropia" },
    { label: "Exotropia", value: "exotropia" },
]

const motilityTestOptions = [{ label: "Safe", value: "safe" }, { label: "Unsafe", value: "unsafe" }]

interface Images {
    od: string | null;
    os: string | null;
    corneal: string | null;
}

const PreliminaryExam = () => {
    const { user } = useUser()
    const { control, handleSubmit, setFocus, register, formState: { errors, isValid }, setValue } = useForm<PreliminaryExamination>({ mode: "onChange" });
    let { patientId, recordId, fullName }: any = useGlobalSearchParams();
    const { patient, fetchPatientById } = usePatient();
    const { setCornealImgUrl, cornealImgUrl, ocularMotilitySketchOD, ocularMotilitySketchOS, setOcularMotilitySketchOD, setOcularMotilitySketchOS } = useStore()
    const [isLoading, setIsLoading] = useState(false)
    const [images, setImages] = useState<Images>({
        od: null,
        os: null,
        corneal: null,
    })
    const inputRefs = useRef<any>(Array.from({ length: 20 }, () => React.createRef()));

    const fetchPatient = useCallback(() => {
        const fetchRecord = async () => {
            if (recordId) {
                try {
                    const response = await axios.get(`${SERVER}/record/${recordId}`)

                    if (response.data) {
                        const preliminaryExamination: PreliminaryExamination | any = response.data.preliminaryExamination

                        if (preliminaryExamination) {
                            // Set multiple values at once
                            Object.keys(preliminaryExamination).forEach(key => {
                                setValue(key as keyof PreliminaryExamination, preliminaryExamination[key]);
                            });
                            setCornealImgUrl(preliminaryExamination.cornealReflexImgUrl)
                            setOcularMotilitySketchOD(preliminaryExamination.ocularMotility.od)
                            setOcularMotilitySketchOS(preliminaryExamination.ocularMotility.os)
                            setImages({
                                od: preliminaryExamination.ocularMotility.od,
                                os: preliminaryExamination.ocularMotility.os,
                                corneal: preliminaryExamination.cornealReflexImgUrl
                            })
                        }

                        return;
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
    }, [patientId]);

    useEffect(
        () => {
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

            fetchPatient();

            return () => {
                backHandler.remove()
            };
        }, [patientId])

    const focus = (index: number) => {
        inputRefs.current[index].current.focus()
    }

    const onSubmit: SubmitHandler<PreliminaryExamination> = async (data: PreliminaryExamination) => {
        setIsLoading(true)
        let ocularMotilityOD;
        let ocularMotilityOS;
        let cornealReflexImg;

        if (ocularMotilitySketchOD && ocularMotilitySketchOS && cornealImgUrl) {
            ocularMotilityOD = await uploadImage(ocularMotilitySketchOD, "image/png")
            ocularMotilityOS = await uploadImage(ocularMotilitySketchOS, "image/png")
            cornealReflexImg = await uploadImage(cornealImgUrl, "image/png")

            const formData = {
                patientId: patient?._id,
                clinicianId: user?.id,
                preliminaryExamination: {
                    ...data,
                    cornealReflexImgUrl: cornealReflexImg,
                    ocularMotility: {
                        od: ocularMotilityOD,
                        os: ocularMotilityOS
                    },
                    isComplete: true,
                }
            }
            try {
                const response = await axios.put(`${SERVER}/patient/record/edit`, formData)
                console.log(response.data)
                Alert.alert("Success", "Preliminary exam has been completed!")
                router.back()
            } catch (error) {
                Alert.alert("Error", "An error occured while updating the record. Please try again later.")
                console.log(JSON.stringify(error))
            } finally { setIsLoading(false) }
        }

    };

    const submitForm = async () => {
        if (isValid) {
            Alert.alert(
                "Double check information before submitting.",
                "Would you like to proceed?",
                [
                    { text: "Wait", style: 'cancel' },
                    { text: "Yes", onPress: () => { handleSubmit(onSubmit)() } }
                ]
            )

        } else if (!cornealImgUrl) {
            Alert.alert(
                "Missing fields",
                "Corneal Reflex"
            );
            setIsLoading(false)
        } else if (!ocularMotilitySketchOD || !ocularMotilitySketchOS) {
            Alert.alert(
                "Missing fields",
                "Ocular Motility"
            );
            setIsLoading(false)
        } else {
            Alert.alert(
                "Missing fields",
                "Please fill all required fields"
            );
            setIsLoading(false)
        }
    }

    const captureImage = async () => {
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                cameraType: ImagePicker.CameraType.back,
                allowsEditing: true,
                quality: 0.5,
                base64: true,

            });

            if (!result.canceled) {
                setCornealImgUrl(result.assets[0].uri)
                console.log(result.assets[0].uri)
            }
        } catch (error) {
            Alert.alert("Error", "Error uploading photo.");
        }
    };

    /**
  * Checks if an image exists in Firebase Storage using its URL.
  * @param imageUrl - The URL of the image to check.
  * @returns A promise that resolves to `true` if the image exists, `false` if it doesn't.
  */
    const imageExists = async (imageUrl: string): Promise<boolean> => {
        try {
            const imageRef = ref(storage, decodeURIComponent(new URL(imageUrl).pathname.replace(/^\/v0\/b\/[A-Za-z0-9-]+\.appspot\.com\/o\//, '').replace(/%2F/g, '/')));
            await getDownloadURL(imageRef);
            return true;
        } catch (error: any) {
            if (error.code === "storage/object-not-found") {
                return false;
            } else {
                console.error("Error checking if image exists:", error);
                throw error;
            }
        }
    };

    /**
     * Uploads an image if it doesn't already exist in Firebase Storage.
     * @param uri - The URI of the image to upload.
     * @param fileType - The file type of the image.
     * @returns A promise that resolves with the download URL of the image.
     */
    const uploadImage = async (uri: string | "", fileType: string) => {
        try {
            // Check if image already exists using the URL
            const existingImageUrl = uri;
            const exists = await imageExists(existingImageUrl);

            if (exists) {
                console.log("Image already exists in storage. Skipping upload.");
                return existingImageUrl; // Return the existing URL if the image already exists
            }

            const response = await fetch(uri);
            const blob = await response.blob();

            const storageRef = ref(storage, `ocular-motility-images/${user?.id}/patient-${patient?._id}/${new Date().getTime()}`);
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
                        reject(error);
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    }
                );
            });
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error;
        }
    };

    const handleDraw = (link: string) => {
        switch (link) {
            case "od":
                router.push("/student/preliminary-examination/od")
                break;
            case "os":
                router.push("/student/preliminary-examination/os")
                break;
            default:
                break;
        }
    }

    if (!patient) {
        return (
            <Loading />
        )
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#fff" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 80} // Adjust as needed
        >
            <Spinner visible={isLoading} animation="fade" />
            <Stack.Screen options={{
                headerTitle: () => (
                    <XStack alignItems='center' gap="$4" enterStyle={{ animation: "medium" }}>
                        <Avatar circular>
                            <Avatar.Image src={patient?.imageUrl || "https://w1.pngwing.com/pngs/991/900/png-transparent-black-circle-avatar-user-rim-black-and-white-line-auto-part-symbol-thumbnail.png"} />
                            <Avatar.Fallback delayMs={200} bg={theme.cyan5} />
                        </Avatar>
                        <YStack>
                            <SizableText color="white">{fullName}</SizableText>
                            <SizableText size={"$1"} color="white">Preliminary Examination</SizableText>
                        </YStack>
                    </XStack>
                )
            }} />
            {patient.records[0]?.preliminaryExamination?.isComplete &&
                <XStack alignItems="center" justifyContent="space-between" backgroundColor={"green"} paddingVertical="$2" paddingHorizontal="$3">
                    <SizableText color={"$green3"}><CheckCircle color={"$green5"} size={10} />  Completed</SizableText>
                    <SizableText size={"$1"} color={"$green3"}>{moment((patient.records[0]?.preliminaryExamination?.createdAt)).format("MMMM D, yyyy hh:mmA")}</SizableText>
                </XStack>
            }
            <Animated.ScrollView entering={FadeIn} style={{ flex: 1 }} contentContainerStyle={{ gap: 2 }}>
                <View padded>
                    <Title text='pupillary distance' />
                    <SizableText backgroundColor={"$gray3"} padding="$1" borderRadius={"$5"} mt="$4" letterSpacing={10} textAlign='center' textTransform="uppercase">Monocular</SizableText>
                    <XStack alignItems='center' gap="$3">
                        <TextInput control={control} name='pupillaryDistance.monocular.OD' label='OD:' placeholder='Enter OD' required returnKeyType="next" onSubmitEditing={() => focus(0)} />
                        <TextInput ref={inputRefs.current[0]} control={control} name='pupillaryDistance.monocular.OS' label='OS:' placeholder='Enter OS' required returnKeyType="next" onSubmitEditing={() => focus(1)} />
                    </XStack>
                    <SizableText backgroundColor={"$gray3"} padding="$1" borderRadius={"$5"} mt="$6" letterSpacing={10} textAlign='center' textTransform="uppercase">Binocular</SizableText>
                    <XStack alignItems='center' gap="$3">
                        <TextInput ref={inputRefs.current[1]} control={control} label='Near' name='pupillaryDistance.binocular.near' placeholder='Enter near' required returnKeyType="next" onSubmitEditing={() => focus(2)} />
                        <TextInput ref={inputRefs.current[2]} control={control} label='Far' name='pupillaryDistance.binocular.far' placeholder='Enter far' required returnKeyType="next" />
                    </XStack>
                </View>
                <View padded>
                    <Title text='ocular dominance' />
                    <SelectTextInput
                        control={control}
                        name='ocularDominance.dominantEye'
                        label='Dominant Eye'
                        placeholder='Select dominant eye'
                        options={[{ label: "OD", value: "OD" }, { label: "OS", value: "OS" },]}
                        required
                    />
                    <SelectTextInput
                        control={control}
                        name='ocularDominance.dominantHand'
                        label='Dominant Hand'
                        placeholder='Select dominant hand'
                        options={[{ label: "Left", value: "left" }, { label: "Right", value: "right" },]}
                        required
                    />
                    <SelectTextInput
                        control={control}
                        name='ocularDominance.note'
                        label='Note:'
                        placeholder='Select note'
                        options={[{ label: "Crossed Dominance", value: "crossed dominance" }, { label: "Uncrossed Dominance", value: "uncrossed Dominance" },]}
                        required
                    />
                </View>
                <View padded>
                    <Title text='corneal reflex' />
                    <Image borderRadius={"$5"} src={cornealImgUrl ? cornealImgUrl : cornealImgPlaceholder} width={"100%"} height={120} objectFit={cornealImgUrl ? "cover" : "contain"} mt="$4" />
                    <SizableText size={"$1"} color={"$gray10"} textAlign='center' display={cornealImgUrl ? "none" : "block"}>No photo added yet.</SizableText>

                    <XStack alignItems='center' alignSelf='center' gap="$2" mt="$3" onPress={captureImage}>
                        <Camera size={"$1"} />
                        <SizableText>{cornealImgUrl ? "Change photo" : "Open Camera"}</SizableText>
                    </XStack>
                    <TextArea control={control} name='cornealReflex.note' label='Notes:' placeholder='Enter notes here' />
                </View>
                <View padded>
                    <Title text='physiological diplopia' />
                    <TextInput control={control} name='physiologicDiplopia' label='OU:' placeholder='Enter OU' required onSubmitEditing={() => focus(3)} />
                </View>
                <View padded>
                    <Title text='pupillary function' />
                    <TextInput ref={inputRefs.current[3]} control={control} name='pupillaryFunction.direct' placeholder='Enter direct' label='Direct' required returnKeyType="next" onSubmitEditing={() => focus(4)} />
                    <TextInput ref={inputRefs.current[4]} control={control} name='pupillaryFunction.indirect' placeholder='Enter indirect' label='Indirect' required />
                    <TextArea control={control} name='pupillaryFunction.Notes:' placeholder='Enter notes here' label='Notes:' />
                    <XStack justifyContent='space-evenly' alignItems='center' gap="$1" mt="$4">
                        <YStack flex={1} alignItems='center' gap="$3">
                            <SizableText>OD</SizableText>
                            <Heading>P</Heading>
                            <SizableText>OS</SizableText>
                        </YStack>
                        <YStack flex={1} alignItems='center' gap="$3">
                            <CustomTextInput control={control} name='perrla.eod' placeholder='EOD' size={"$3"} keyboardType="phone-pad" required />
                            <Heading>E</Heading>
                            <CustomTextInput control={control} name='perrla.eos' placeholder='EOS' size={"$3"} keyboardType="phone-pad" required />
                        </YStack>
                        <Heading flex={1} textAlign='center'>R</Heading>
                        <Heading flex={1} textAlign='center'>R</Heading>
                        <YStack flex={1} alignItems='center' gap="$3">
                            <CustomTextInput control={control} name='perrla.lod' placeholder='LOD' size={"$3"} keyboardType="phone-pad" required />
                            <Heading>L</Heading>
                            <CustomTextInput control={control} name='perrla.los' placeholder='LOS' size={"$3"} keyboardType="phone-pad" required />
                        </YStack>
                        <YStack flex={1} alignItems='center' gap="$3">
                            <CustomTextInput control={control} name='perrla.aod' placeholder='AOD' size={"$3"} keyboardType="phone-pad" required />
                            <Heading>A</Heading>
                            <CustomTextInput control={control} name='perrla.aos' placeholder='AOS' size={"$3"} keyboardType="phone-pad" required />
                        </YStack>
                    </XStack>
                </View>
                <View padded>
                    <Title text='cover test' />
                    <SizableText backgroundColor={"$gray3"} padding="$1" borderRadius={"$5"} mt="$4" letterSpacing={10} textAlign='center' textTransform="uppercase">Unilateral</SizableText>
                    <YStack flex={1}>
                        <SizableText mt="$3">Far</SizableText>
                        <SelectTextInput control={control} name='coverTest.unilateral.far.od' label='OD:' placeholder='Select' options={coverTestOptions} required />
                        <SelectTextInput control={control} name='coverTest.unilateral.far.os' label='OS:' placeholder='Select' options={coverTestOptions} required />
                    </YStack>
                    <YStack flex={1}>
                        <SizableText mt="$3">Near</SizableText>
                        <SelectTextInput control={control} name='coverTest.unilateral.near.od' label='OD:' placeholder='Select' options={coverTestOptions} required />
                        <SelectTextInput control={control} name='coverTest.unilateral.near.os' label='OS:' placeholder='Select' options={coverTestOptions} required />
                    </YStack>
                    <SizableText backgroundColor={"$gray3"} padding="$1" borderRadius={"$5"} mt="$6" letterSpacing={10} textAlign='center' textTransform="uppercase">Alternate</SizableText>
                    <YStack flex={1}>
                        <SizableText mt="$3">Far</SizableText>
                        <SelectTextInput control={control} name='coverTest.alternate.far.od' label='OD:' placeholder='Select' options={coverTestOptions} required />
                        <SelectTextInput control={control} name='coverTest.alternate.far.os' label='OS:' placeholder='Select' options={coverTestOptions} required />
                    </YStack>
                    <YStack flex={1}>
                        <SizableText mt="$3">Near</SizableText>
                        <SelectTextInput control={control} name='coverTest.alternate.near.od' label='OD:' placeholder='Select' options={coverTestOptions} required />
                        <SelectTextInput control={control} name='coverTest.alternate.near.os' label='OS:' placeholder='Select' options={coverTestOptions} required />
                    </YStack>
                    <TextArea control={control} name="coverTest.note" label='Notes:' placeholder='Enter notes here' />
                </View>
                <View padded>
                    <Title text='motility test' />
                    <SizableText backgroundColor={"$gray3"} padding="$1" borderRadius={"$5"} mt="$4" letterSpacing={10} textAlign='center' textTransform="uppercase">Version</SizableText>
                    <TextInput control={control} name='motilityTest.version.broadH' label='Broad H' placeholder='Enter broad h' required onSubmitEditing={() => focus(5)} />
                    <TextInput ref={inputRefs.current[5]} control={control} name='motilityTest.version.saccades' label='Saccades' placeholder='Enter saccades' required onSubmitEditing={() => focus(6)} />
                    <TextInput ref={inputRefs.current[6]} control={control} name='motilityTest.version.pursuit' label='Pursuit' placeholder='Enter pursuit' required />
                    <SizableText backgroundColor={"$gray3"} padding="$1" borderRadius={"$5"} mt="$6" mb="$4" letterSpacing={10} textAlign='center' textTransform="uppercase">Duction</SizableText>
                    <SizableText mt="$3 " >Broad H:</SizableText>
                    <SelectTextInput control={control} name='motilityTest.duction.od' placeholder='Select' label='OD' options={motilityTestOptions} required />
                    <SelectTextInput control={control} name='motilityTest.duction.os' placeholder='Select' label='OS' options={motilityTestOptions} required />
                    <SizableText backgroundColor={"$gray3"} padding="$1" borderRadius={"$5"} mt="$6" letterSpacing={10} textAlign='center' textTransform="uppercase">Stereopty test</SizableText>
                    <TextInput control={control} name="stereoptyTest.stereopsis" label='Stereopsis' placeholder='Enter stereopsis' required />
                    <SizableText backgroundColor={"$gray3"} padding="$1" borderRadius={"$5"} mt="$6" letterSpacing={10} textAlign='center' textTransform="uppercase">Color vision</SizableText>
                    <TextInput control={control} name="colorVision.ishihara.od" label='Ishihara OD' placeholder='Enter ishihara OD' required onSubmitEditing={() => focus(7)} />
                    <TextInput ref={inputRefs.current[7]} control={control} name="colorVision.ishihara.os" label='Ishihara OS' placeholder='Enter ishihara OS' required />
                    <TextArea control={control} name='motilityTest.note' label='Notes:' placeholder='Enter notes here' />
                </View>
                <View padded>
                    <Title text='ocular motility' />
                    <XStack justifyContent='space-around' mt="$4">
                        <Card padding="$3" backgroundColor={"white"} bordered borderRadius={"$5"} onPress={() => handleDraw("od")}>
                            <Image src={ocularMotilitySketchOD ? ocularMotilitySketchOD : od} width={140} height={140} objectFit='contain' />
                        </Card>
                        <Card padding="$3" backgroundColor={"white"} bordered borderRadius={"$5"} onPress={() => handleDraw("os")}>
                            <Image src={ocularMotilitySketchOS ? ocularMotilitySketchOS : os} width={140} height={140} objectFit='contain' />
                        </Card>
                    </XStack>
                    <SizableText size={"$2"} color={"$gray10"} textAlign='center' mt="$4" alignItems='center'>Click on each image to edit <Pen size={12} color={"$gray10"} /></SizableText>
                    <TextArea control={control} placeholder='Enter notes here' label='Notes:' name='ocularMotility.note' />
                </View>
                <View padded>
                    <Title text='Near Point Accomodation' />
                    <SizableText backgroundColor={"$gray3"} padding="$1" borderRadius={"$5"} mt="$6" letterSpacing={10} textAlign='center' textTransform="uppercase">OD</SizableText>
                    <TextInput control={control} name='nearPointAccomodation.od.trial1' label='1st Trial' placeholder='Enter first trial' required onSubmitEditing={() => focus(8)} />
                    <TextInput ref={inputRefs.current[8]} control={control} name='nearPointAccomodation.od.trial2' label='2nd Trial' placeholder='Enter second trial' required onSubmitEditing={() => focus(9)} />
                    <TextInput ref={inputRefs.current[9]} control={control} name='nearPointAccomodation.od.trial3' label='3rd Trial' placeholder='Enter third trial' required onSubmitEditing={() => focus(10)} />
                    <SizableText backgroundColor={"$gray3"} padding="$1" borderRadius={"$5"} mt="$6" letterSpacing={10} textAlign='center' textTransform="uppercase">OS</SizableText>
                    <TextInput ref={inputRefs.current[10]} control={control} name='nearPointAccomodation.os.trial1' label='1st Trial' placeholder='Enter first trial' required onSubmitEditing={() => focus(11)} />
                    <TextInput ref={inputRefs.current[11]} control={control} name='nearPointAccomodation.os.trial2' label='2nd Trial' placeholder='Enter second trial' required onSubmitEditing={() => focus(12)} />
                    <TextInput ref={inputRefs.current[12]} control={control} name='nearPointAccomodation.os.trial3' label='3rd Trial' placeholder='Enter third trial' required onSubmitEditing={() => focus(13)} />
                    <SizableText backgroundColor={"$gray3"} padding="$1" borderRadius={"$5"} mt="$6" letterSpacing={10} textAlign='center' textTransform="uppercase">OU</SizableText>
                    <TextInput ref={inputRefs.current[13]} control={control} name='nearPointAccomodation.ou.trial1' label='1st Trial' placeholder='Enter first trial' required onSubmitEditing={() => focus(14)} />
                    <TextInput ref={inputRefs.current[14]} control={control} name='nearPointAccomodation.ou.trial2' label='2nd Trial' placeholder='Enter second trial' required onSubmitEditing={() => focus(15)} />
                    <TextInput ref={inputRefs.current[15]} control={control} name='nearPointAccomodation.ou.trial3' label='3rd Trial' placeholder='Enter third trial' required />
                </View>
                <View padded>
                    <Title text='Near Point Convergence' />
                    <SizableText backgroundColor={"$gray3"} padding="$1" borderRadius={"$5"} mt="$6" letterSpacing={10} textAlign='center' textTransform="uppercase">OU</SizableText>
                    <TextInput ref={inputRefs.current[16]} control={control} name='nearPointConvergence.ou.trial1' label='1st Trial' placeholder='Enter first trial' required onSubmitEditing={() => focus(17)} />
                    <TextInput ref={inputRefs.current[17]} control={control} name='nearPointConvergence.ou.trial2' label='2nd Trial' placeholder='Enter second trial' required onSubmitEditing={() => focus(18)} />
                    <TextInput ref={inputRefs.current[18]} control={control} name='nearPointConvergence.ou.trial3' label='3rd Trial' placeholder='Enter third trial' required />
                </View>
                <View padded>
                    <Title text='Subjective or Objective?' />
                    <ControlledRadioGroup name='subjectiveOrObjective' control={control} options={[{ label: "Subjective", value: "subjective" }, { label: "Objective", value: "objective" },]} required />
                </View>
                <View paddingHorizontal="$5" paddingVertical="$3">
                    <CustomButton flex={1} buttonText={isLoading ? "Saving..." : "Save"} onPress={submitForm} disabled={isLoading} />
                </View>
            </Animated.ScrollView>
        </KeyboardAvoidingView>
    )
}

export default PreliminaryExam;