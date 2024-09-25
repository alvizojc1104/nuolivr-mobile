import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  Heading,
  Input,
  Paragraph,
  SizableText,
  XStack,
  YStack,
  AlertDialog,
} from "tamagui";
import Spinner from "react-native-loading-spinner-overlay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSignUp } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { BadgeCheck } from "@tamagui/lucide-icons";
import { OtpInput } from "react-native-otp-entry";
import { Keyboard, useColorScheme } from "react-native";

const Page = () => {
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
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: code,
      });

      if (completeSignUp) {
        await setActive({ session: completeSignUp.createdSessionId });
        await AsyncStorage.removeItem("@email");
        setShowToast(true);
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2), code);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <YStack flex={1} justifyContent="center" padding="$6" gap="$6">
      <Spinner visible={isLoading} />
      <Heading size="$7" textAlign="center">
        Account Verification
      </Heading>
      <Paragraph size="$4" textAlign="center">
        {`We’ve sent a verification code to `}
        <SizableText fontWeight={900}>{email || "your email."}</SizableText>
        {` Please enter the six-digit code below to verify your account.`}
      </Paragraph>
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
            color: colorScheme == "dark" ? "white" : "black",
          },
          focusedPinCodeContainerStyle: {
            borderColor: colorScheme == "dark" ? "white" : "black",
            borderWidth: 2,
          },
        }}
      />
      <Button
        size="$5"
        onPress={onPressVerify}
        disabled={code.length != 6 || isLoading}
        theme="active"
      >
        Verify Account
      </Button>
      <AlertDialog open={showToast} onOpenChange={setShowToast}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            key="overlay"
            animation="medium"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <AlertDialog.Content
            elevate
            paddingHorizontal="$5"
            key="content"
            animation={[
              "quickest",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            x={0}
            scale={1}
            opacity={1}
            y={0}
            width="90%"
          >
            <YStack gap="$4" theme="green" alignItems="center">
              <XStack alignItems="center" gap="$2">
                <BadgeCheck color="white" fill="hsl(152, 57.5%, 37.6%)" />
                <AlertDialog.Title size="$7">
                  Account Verified
                </AlertDialog.Title>
              </XStack>
              <AlertDialog.Description>
                Your account has been verified successfully!
              </AlertDialog.Description>
              <XStack gap="$3" justifyContent="center">
                <AlertDialog.Action asChild>
                  <Button
                    theme="green_active"
                    onPress={() => {
                      setShowToast(false);
                      router.push("/signup/name");
                    }}
                    width="100%"
                    size="$5"
                  >
                    Continue
                  </Button>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </YStack>
  );
};

export default Page;
