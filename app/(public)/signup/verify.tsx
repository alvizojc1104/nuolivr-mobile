import React, { useRef, useState, useEffect } from "react";
import {
  Heading,
  SizableText,
  YStack,
} from "tamagui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSignUp } from "@clerk/clerk-expo";
import { router, useGlobalSearchParams } from "expo-router";
import { ArrowLeft, ArrowRight, BadgeCheck } from "@tamagui/lucide-icons";
import { OtpInput } from "react-native-otp-entry";
import { Alert, Keyboard, useColorScheme } from "react-native";
import { theme } from "@/theme/theme";
import CustomButton from "@/components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";

const Page = () => {
  const { signupCode } = useGlobalSearchParams()
  const { signUp, isLoaded, setActive } = useSignUp();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const inputRefs = useRef([]);
  const [showToast, setShowToast] = useState(false);

  const colorScheme = useColorScheme();

  useEffect(() => {
    const getEmail = async () => {
      try {
        const userEmail = await AsyncStorage.getItem("@email");
        if (userEmail !== null) {
          setEmail(userEmail);
        }
      } catch (error) {
        console.error("Failed to load user data", error);
      }
    };
    getEmail();
  }, []);

  // Verify the email address
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
    setIsLoading(true);
    try {
      await signUp.attemptEmailAddressVerification({
        code: code,
      }).then(() => {
        setIsLoading(false);
        Alert.alert(
          "Successful",
          "Your email address has been verified!",
          [
            { text: "Continue" }
          ]
        )
        router.push({ pathname: "/signup/form", params: { code: signupCode } })
      })
    } catch (err: any) {
      Alert.alert(
        "Verification Failed",
        (err.errors[0].longMessage || "Error"),
        [
          { text: "OK" }
        ]
      )
      console.log(JSON.stringify(err))
    } finally {
      setIsLoading(false);
    }
  };

  const onBackPress = () => {
    router.back()
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} justifyContent="flex-start" padding="$5">
        <ArrowLeft mb="$4" onPress={onBackPress} />
        <Heading>
          Email Verification
        </Heading>
        <SizableText mb="$4">A six-digit code has been sent to your email.</SizableText>
        <OtpInput
          onTextChange={(code) => {
            setCode(code);
            if (code.length === 6) {
              Keyboard.dismiss();
            }
          }}
          numberOfDigits={6}
          type="numeric"
          theme={{
            pinCodeTextStyle: {
              color: "black",
              fontSize: 18,
              fontFamily: "Inter"
            },
            focusedPinCodeContainerStyle: {
              borderColor: "lightgray",
              borderWidth: 2,
            },
            pinCodeContainerStyle: {
              height: 50
            },
            focusStickStyle: {
              height: 18,
              backgroundColor: theme.cyan10
            }
          }}
        />
        <CustomButton
          buttonText={isLoading ? "Verifying..." : "Verify"}
          onPress={onPressVerify}
          disabled={code.length != 6 || isLoading}
          mt="$6"
        />
      </YStack>
    </SafeAreaView>
  );
};

export default Page;
