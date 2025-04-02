import CustomButton from '@/components/CustomButton'
import LoadingModal from '@/components/LoadingModal'
import TextInput from '@/components/TextInput'
import { useSignUp } from '@clerk/clerk-expo'
import { ArrowLeft, ArrowRight } from '@tamagui/lucide-icons'
import axios from 'axios'
import { router } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, Linking } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Heading, SizableText, View } from 'tamagui'

type SignupSchema = {
    emailAddress: string
    signupCode: number | null
}

const url = process.env.EXPO_PUBLIC_API_URL


const Signup = () => {
    const { isLoaded, signUp } = useSignUp()
    const [isSending, setIsSending] = React.useState(false)
    const [role, setRole] = useState<string[]>([])
    const { control, setError, reset, handleSubmit, formState: { isValid } } = useForm<SignupSchema>({
        mode: 'onChange',
        defaultValues: {
            emailAddress: '',
            signupCode: null,
        },
    })
    const codeRef = useRef<any>(null)

    if (!isLoaded) return;

    const onSubmit = async (data: SignupSchema) => {
        setIsSending(true)
        try {

            const response = await axios.post(`${url}/code/verify`, { code: data.signupCode })

            const { message, used, role } = response.data;

            if (role.includes("faculty")) {
                Alert.alert("Faculty signup failed.", "Please visit the web portal for faculty signup.", [
                    { text: "VISIT PORTAL", onPress: () => Linking.openURL(`https://nuvision.live/sign-up`) }
                ])
                return;
            }

            if (used) {
                setError("signupCode", { message: message })
            } else {
                try {
                    const { emailAddress } = data
                    await signUp?.create({
                        emailAddress
                    })

                    // Send verification email or other necessary steps here
                    await signUp?.prepareEmailAddressVerification({ strategy: "email_code" })
                    router.push({ pathname: "/signup/verify", params: { signupCode: data.signupCode } })
                    reset()
                } catch (error: any) {
                    Alert.alert(
                        "Failed",
                        error.errors[0].message,
                        [{ text: "Okay" }]
                    )
                } finally {
                    setIsSending(false)
                }
            }
        } catch (error: any) {
            setError("signupCode", { message: "Invalid Code." })
        } finally {
            setIsSending(false)
        }


    }

    const onBackPress = () => {
        router.back()
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View flex={1} justifyContent='flex-start' alignItems="flex-start" padding="$5">
                <ArrowLeft mb="$4" onPress={onBackPress} />
                <Heading>Sign Up</Heading>
                <SizableText>Please enter your email address and signup code.</SizableText>
                <TextInput name="emailAddress" left={"email-outline"} control={control} label='Email Address' type="email-address" returnKeyType="next" required onSubmitEditing={() => codeRef.current.focus()} rules={{
                    required: "Email is required",
                    pattern: {
                        value: /^[^\s@]+@([a-zA-Z0-9-]+\.)?nu-moa\.edu\.ph$/,
                        message: "Please use your official school email address.",
                    }   
                }} />
                <TextInput left={"numeric"} ref={codeRef} name="signupCode" control={control} label='Signup Code' type="numeric" returnKeyType='done' masked mask='999999' rules={{
                    required: "Required",
                    pattern: {
                        value: /^\d{6}$/,
                        message: "Invalid code.",
                    }
                }} />
                <View width={"100%"}>
                    <CustomButton disabled={isValid ? false : true} onPress={handleSubmit(onSubmit)} buttonText='Continue' iconAfter={ArrowRight} mt="$5" width={"100%"} />
                </View>
            </View>
            <LoadingModal isVisible={isSending} />
        </SafeAreaView>
    )
}

export default Signup