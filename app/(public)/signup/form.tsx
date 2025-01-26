import ControlledCheckboxGroup from '@/components/ControlledCheckBox'
import CustomButton from '@/components/CustomButton'
import Loading from '@/components/Loading'
import LoadingModal from '@/components/LoadingModal'
import SelectTextInput from '@/components/SelectTextInput'
import TextInput from '@/components/TextInput'
import { theme } from '@/theme/theme'
import { useSignUp } from '@clerk/clerk-expo'
import { ArrowLeft, Check } from '@tamagui/lucide-icons'
import axios from 'axios'
import { router, useGlobalSearchParams } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, Keyboard, KeyboardAvoidingView, Platform } from 'react-native'
import { HelperText } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Checkbox, Heading, ScrollView, SizableText, View } from 'tamagui'

type FormSchema = {
  studentOrFacultyID: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  birthdate: Date | null;
  civilStatus: string;
  phoneNumber: string;
  emailAddress: string | null;
  password: string;
  confirmPassword: string;
  agreedToTermsAndCondition: boolean;
  street: string;
  baranggay: string;
  city: string;
  province: string;
}

const url = process.env.EXPO_PUBLIC_API_URL

const civilStatus = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "separated", label: "Separated" },
  { value: "widowed", label: "Widowed" },
]
export default function Form() {
  const { code } = useGlobalSearchParams()
  const { isLoaded, signUp } = useSignUp()
  const [secureTextEntry, setSecureTextEntry] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { control, setError, handleSubmit, getValues, formState: { errors } } = useForm<FormSchema>(
    {
      defaultValues: {
        studentOrFacultyID: "",
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        birthdate: null,
        civilStatus: "",
        street: "",
        city: "",
        province: "",
        baranggay: "",
        phoneNumber: "",
        emailAddress: signUp?.emailAddress,
        password: "",
        confirmPassword: "",
        agreedToTermsAndCondition: false,
      },
      mode: "onChange",
    }
  )
  const inputRefs = useRef<any>(Array.from({ length: 8 }, () => React.createRef()));

  if (!isLoaded) {
    return <Loading />
  }

  const onBackPress = () => {
    router.back()
  }

  const onSubmit = () => {
    Alert.alert(
      "Sign Up",
      "Are you sure you want to sign up?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => handleSubmit(signup)() },
      ],
    )
  }
  const signup = async (form: FormSchema) => {
    if (!code) {
      Alert.alert(
        "Error",
        "Walang code",
        [
          { text: "OK" },
        ]
      )
    }
    try {
      setIsLoading(true)
      await axios.post(`${url}/account/signup`, form)
        .then(async () => {
          await axios.post(`${url}/code/use`, { code: code })
            .then(async () => {
              Alert.alert(
                "Success",
                "You may now log in to your account.",
                [
                  { text: "Continue", onPress: () => router.replace("/login") },
                ]
              )
            })
            .catch((err) => {
              console.log(JSON.stringify(err))
              Alert.alert(
                "Error",
                "An error occured. Please try again later.",
                [
                  { text: "OK" },
                ]
              )
            })
        })
    } catch (error: any) {
      setError("studentOrFacultyID", { message: error.response.data.message })
    } finally {
      setIsLoading(false);
    }
  }

  const secureText = () => {
    setSecureTextEntry(!secureTextEntry)
  }

  const focus = (index: number) => {
    inputRefs.current[index].current.focus()
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <ScrollView flex={1} contentContainerStyle={{ padding: "$5", alignItems: "flex-start", justifyContent: "flex-start" }} keyboardShouldPersistTaps="never" >
          <ArrowLeft onPress={onBackPress} mb="$4" />
          <Heading>Sign Up</Heading>
          <SizableText>Please sign up the form.</SizableText>
          <SizableText mt="$4" textDecorationLine='underline'>Personal Information</SizableText>
          <TextInput control={control} name="studentOrFacultyID" label='School ID' masked mask='9999-999999' left={"card-account-details-outline"} onSubmitEditing={() => focus(0)} required rules={{
            pattern: {
              value: /^[0-9]{4}-[0-9]{6}$/,
              message: "Invalid schoold ID.",
            },
          }} />
          <HelperText type="info" style={{ fontFamily: "Inter" }}>Your student or faculty ID number.</HelperText>
          <TextInput control={control} name="firstName" label='First Name' required ref={inputRefs.current[0]} onSubmitEditing={() => focus(1)} />
          <TextInput control={control} name="middleName" label='Middle Name' required ref={inputRefs.current[1]} onSubmitEditing={() => focus(2)} />
          <TextInput control={control} name="lastName" label='Last Name' required ref={inputRefs.current[2]} />
          <SelectTextInput control={control} name="gender" options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} label='Gender' placeholder='Select gender' required />
          <TextInput control={control} name='birthday' masked mask='99/99/9999' placeholder='mm/dd/yyyy' label='Birthday' left={"calendar-outline"} rules={{ pattern: { value: /^(0[1-9]|1[0-2])\/\d{2}\/\d{4}$/, message: "Invalid format. Use mm/dd/yyyy." } }} />
          <SelectTextInput
            name='civilStatus'
            control={control}
            label='Civil Status'
            options={civilStatus}
            placeholder='Select civil status'
            required
          />
          <TextInput
            control={control}
            name='phoneNumber'
            masked
            placeholder='09'
            mask='9999 999 9999'
            label='Phone'
            left={"phone-outline"}
            onSubmitEditing={() => focus(3)}
            rules={{
              pattern: {
                value: /^09\d{2} \d{3} \d{4}$/, // Fixed regex to match the correct number of digits
                message: "Invalid phone number"
              }
            }}
          />
          <SizableText mt="$4" textDecorationLine='underline'>Address</SizableText>
          <TextInput control={control} name='street' label='House No./Street Name' placeholder='House No./Street Name/Lot. Blk.' required ref={inputRefs.current[3]} onSubmitEditing={() => focus(4)} />
          <TextInput control={control} name='baranggay' label='Baranggay/Village' placeholder='Baranggay/Village' required ref={inputRefs.current[4]} onSubmitEditing={() => focus(5)} />
          <TextInput control={control} name='city' label='City/Municipality' placeholder='e.g. Paranaque City' required ref={inputRefs.current[5]} onSubmitEditing={() => focus(6)} />
          <TextInput control={control} name='province' label='Province' required ref={inputRefs.current[6]} />
          <SizableText mt="$4" textDecorationLine='underline'>Setup Account</SizableText>
          <TextInput disabled left={"email-outline"} control={control} name='emailAddress' label='Email Address' placeholder='e.g. john.doe@example.com' required />
          <HelperText type='info' style={{ color: "green" }}>✓  Verified.</HelperText>
          <TextInput
            right={secureTextEntry ? "eye-outline" : "eye-off-outline"}
            secure={!secureTextEntry}
            secureFunction={secureText}
            control={control}
            name='password'
            label='Password'
            required
            rules={{
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                message: "Password must include at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, and 1 special character (@$!%*?&).",
              },
            }}
            onSubmitEditing={() => focus(7)} />
          <TextInput ref={inputRefs.current[7]} right={secureTextEntry ? "eye-outline" : "eye-off-outline"} control={control} name="confirmPassword" getValues={getValues} compare={"password"} label='Confirm Password' secure={!secureTextEntry} secureFunction={secureText} required returnKeyType='done' />
          <View flexDirection='row' gap="$2" alignItems="flex-start" justifyContent='flex-start' flex={1} marginTop="$6">
            <Controller
              control={control}
              name="agreedToTermsAndCondition"
              defaultValue={false}
              rules={{
                required: "Please accept the terms and conditions first.",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Checkbox
                  id='agreedToTermsAndCondition'
                  marginTop="$1"
                  backgroundColor={"white"}
                  checked={value}
                  onCheckedChange={onChange}
                  onBlur={onBlur}
                  theme={errors.agreedToTermsAndCondition && "red_active"}
                >
                  <Checkbox.Indicator>
                    <Check color={theme.cyan10} />
                  </Checkbox.Indicator>
                </Checkbox>
              )}
            />
            <SizableText unstyled>
              By signing up, I agree to the
              <SizableText color={theme.cyan10} onPress={() => { Alert.alert("Terms and Condition") }}> Terms and Condition</SizableText>
              .
            </SizableText>
          </View>
          {errors.agreedToTermsAndCondition && <HelperText type='error'>{errors.agreedToTermsAndCondition.message}</HelperText>}
        </ScrollView>
        <CustomButton buttonText='Sign Up' onPress={onSubmit} marginVertical="$3" marginHorizontal="$5" />
      </KeyboardAvoidingView>
      <LoadingModal isVisible={isLoading} />
    </SafeAreaView>
  )
}