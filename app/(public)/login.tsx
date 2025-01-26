import { EyeOff, Eye, Mail, Lock } from "@tamagui/lucide-icons";
import { router, useFocusEffect } from "expo-router";
import {
  XStack,
  Input,
  Image,
  View as TamaguiView,
  Heading,
  SizableText,
  YStack,
  Button,
  Spinner,
} from "tamagui";
import { useState, useCallback, useRef } from "react";
import { useAuth, useSignIn } from "@clerk/clerk-expo";
import View from "@/components/View";
import numoa from "@/assets/images/numoa.jpg";
import logo from "@/assets/images/logo.png";
import soo from "@/assets/images/soo.png";

import { SubmitHandler, useController, useForm } from "react-hook-form";
import { theme } from "@/theme/theme";
import { Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { HelperText } from "react-native-paper";
import TextInput from "@/components/TextInput";
import LoadingModal from "@/components/LoadingModal";

interface Account {
  emailAddress: string;
  password: string;
}
const Index = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth()
  const { control, handleSubmit, formState: { isValid, errors } } = useForm<Account>({
    defaultValues: { emailAddress: "", password: "" },
    mode: "onChange"
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const passwordRef = useRef<any>(null)

  useFocusEffect(
    useCallback(() => {
      if (isSignedIn) {
        router.replace("/student/(home)")
      }
    }, [])
  )

  const onSignInPress: SubmitHandler<Account> = useCallback(
    async (data: Account) => {
      if (!isLoaded) return;

      Keyboard.dismiss()
      
      try {
        setLoading(true);
        const completeSignIn = await signIn.create({
          identifier: data.emailAddress,
          password: data.password,
        });

        await setActive({ session: completeSignIn.createdSessionId });
        router.replace("/student/(drawer)/(home)/");
      } catch (err: any) {
        alert(err.errors[0].message);
      } finally {
        setLoading(false);
      }
    },
    [isLoaded, signIn, setActive]
  );

  const onSubmit: SubmitHandler<Account> = (data: Account) => {
    onSignInPress(data);
  };

  const onShowPassword = () => { setShowPassword(!showPassword); };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0} // Adjust as needed
    >
      <TamaguiView flex={1}>
        <Image src={numoa} objectFit="cover" width={"100%"} height={"30%"} />
        <View
          flex={1}
          mt={-10}
          borderTopLeftRadius={"$5"}
          borderTopRightRadius={"$5"}
          padded
          zIndex={100}
        >
          <XStack alignItems="center" justifyContent="space-between">
            <YStack>
              <Heading size={"$9"} fontFamily={"$heading"}>NU Vision</Heading>
              <SizableText color={"$gray10"}>Please login to continue.</SizableText>
            </YStack>
            <XStack alignItems="center" gap="$2">
              <Image src={soo} objectFit="contain" width={"$6"} height={"$6"} />
              <Image src={logo} objectFit="contain" width={"$6"} height={"$6"} />
            </XStack>
          </XStack>
          <TextInput
            name="emailAddress"
            label="Email Address"
            left={"email-outline"}
            control={control}
            placeholder="Enter email address"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            }}
            onSubmitEditing={() => passwordRef.current.focus()}
            type="email-address"
          />
          <TextInput
            ref={passwordRef}
            name="password"
            control={control}
            placeholder="Enter password"
            label="Password"
            left={"lock-outline"}
            right={showPassword ? "eye-off-outline" : "eye-outline"}
            secure={showPassword}
            secureFunction={onShowPassword}
            rules={{
              required: "Password is required",
            }}
          />
          <SizableText textAlign="right" mt="$2" onPress={() => router.push("/(public)/reset")}>Forgot Password?</SizableText>

          <Button
            disabled={!isValid ? true : false}
            onPress={handleSubmit(onSubmit)}
            borderWidth={0}
            backgroundColor={theme.cyan10}
            color={"white"}
            pressStyle={{ backgroundColor: theme.cyan11 }}
            mt="$4"
          >
            Login
          </Button>
          <SizableText textAlign="center" mt="$4">
            Don't have an account?{" "}
            <SizableText color={theme.cyan10} onPress={() => router.push("/(public)/signup")}>Sign Up</SizableText>
          </SizableText>
          <YStack flex={1} />
          <SizableText alignSelf="center" size={"$1"} color={"$gray10"}>© National University Mall of Asia - School of Optometry</SizableText>
        </View>
      </TamaguiView>
      <LoadingModal isVisible={loading} text="Logging in..." />
    </KeyboardAvoidingView>
  );
};

export default Index;
