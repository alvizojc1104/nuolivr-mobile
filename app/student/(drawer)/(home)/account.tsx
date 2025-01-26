import React, { useCallback, useState } from 'react'
import { theme } from '@/theme/theme'
import { Camera, } from '@tamagui/lucide-icons'
import { StatusBar } from 'expo-status-bar'
import { Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import { Avatar, Heading, ScrollView, SizableText, View, XStack, } from "tamagui"
import { useAuth, useUser } from '@clerk/clerk-expo'
import * as ImagePicker from "expo-image-picker"
import { useFocusEffect } from 'expo-router'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import TextInput from '@/components/TextInput'
import SelectTextInput from '@/components/SelectTextInput'
import LoadingModal from '@/components/LoadingModal'
import CustomButton from '@/components/CustomButton'

const url = process.env.EXPO_PUBLIC_API_URL

interface IAccount {
    id: string;
    userId: string;
    imageUrl: string;
    studentOrFacultyID: string;
    fullName: string;
    firstName: string;
    lastName: string;
    middleName: string;
    emailAddress: string;
    address: {
        street: string;
        baranggay: string;
        city: string;
        province: string;
    };
    phoneNumber: string;
    birthday: string;
    gender: "male" | "female";
    role: string;
}


const Profile = () => {
    const { user, isLoaded } = useUser()
    const { control, handleSubmit, setValue, getValues, formState: { errors, isValid } } = useForm<IAccount>({})
    const { signOut } = useAuth()
    const [loading, setLoading] = useState(false)
    const [edit, setEdit] = useState(true)


    if (!isLoaded) return;

    useFocusEffect(
        useCallback(() => {
            const getAccount = async () => {
                try {
                    const response = await axios.get(`${url}/account/get`, { params: { userId: user?.id } })
                    const account: IAccount | any = response.data

                    Object.keys(account).forEach(key => {
                        setValue(key as keyof IAccount, account[key]);
                    });
                } catch (error) {
                    console.log(JSON.stringify(error))
                }
            }

            getAccount();
        }, [])

    )

    const captureImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.75,
                aspect: [4, 4],
                base64: true,
            });

            if (!result.canceled) {
                setLoading(true);
                const base64 = `data:image/png;base64,${result.assets[0].base64}`;
                await user?.setProfileImage({
                    file: base64,
                });
            }
        } catch (error) {
            Alert.alert("Error", "Error uploading photo.");
        } finally {
            setLoading(false);
        }
    };

    const editProfile = () => {
        setEdit(!edit)
    }

    const updateProfile = () => {
        Alert.alert(
            "Update Profile",
            "Are you sure you want to update your profile?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: () => { console.log("update") } },
            ],
            { cancelable: false }
        )
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
            <ScrollView flex={1}>
                <View padding={"$5"} alignItems='center' width={"100%"}>
                    <View position="relative">
                        <Avatar circular size="$10">
                            <Avatar.Image src={user?.imageUrl} />
                            <Avatar.Fallback backgroundColor={theme.cyan5} delayMs={1000} />
                        </Avatar>
                        <TouchableOpacity
                            onPress={captureImage}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: -5,
                                backgroundColor: 'white',
                                borderRadius: 20,
                                padding: 5,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.3,
                                shadowRadius: 3,
                                elevation: 5,
                            }}
                        >
                            <Camera size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                    <Heading mt="$4">{`${user?.firstName} ${user?.lastName}`}</Heading>
                    <SizableText color="$gray10">{user?.primaryEmailAddress?.emailAddress}</SizableText>
                    <SizableText>{`ID: ${user?.publicMetadata?.school}`}</SizableText>
                </View>
                <View padding="$5">
                    <XStack alignItems='center' justifyContent='space-between' width={"100%"}>
                        <SizableText>Personal Information</SizableText>
                        <SizableText color={edit ? theme.cyan10 : "$red10"} onPress={editProfile}>{edit ? "Edit Profile" : "Cancel"}</SizableText>
                    </XStack>
                    <TextInput disabled control={control} name="studentOrFacultyID" label='School ID' />
                    <TextInput disabled={edit} control={control} name="firstName" label='First Name' />
                    <TextInput disabled={edit} control={control} name="middleName" label='Middle Name' />
                    <TextInput disabled={edit} control={control} name="lastName" label='Last Name' />
                    <SelectTextInput disabled={edit} control={control} name='gender' label='Gender' options={[{ label: "Male", value: "male" }, { label: "Female", value: "female" }]} />
                    <TextInput disabled={edit} control={control} name="birthday" label='Birthday' left={"calendar-outline"} masked mask='99/99/9999' />
                    <TextInput disabled={edit} control={control} name="phoneNumber" label='Phone Number' left={"phone-outline"} />
                    <SizableText mt="$4">Address</SizableText>
                    <TextInput disabled={edit} control={control} name="address.street" label='House No./Street Name/Lot Blk.' />
                    <TextInput disabled={edit} control={control} name="address.baranggay" label='Barangay' />
                    <TextInput disabled={edit} control={control} name="address.city" label='City or Municipality' />
                    <TextInput disabled={edit} control={control} name="address.province" label='Province' />
                </View>
                {!edit && <CustomButton marginVertical="$3" marginHorizontal="$5" onPress={updateProfile} buttonText='Update Profile' />}
            </ScrollView>
            <LoadingModal isVisible={false} text='Updating profile...' />
            <StatusBar style='light' />
        </KeyboardAvoidingView>

    )
}

export default Profile