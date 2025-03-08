import { useState, useCallback, useRef } from "react";
import { EyeOff, Eye } from "@tamagui/lucide-icons";
import { router, useFocusEffect } from "expo-router";
import {
  XStack,
  Image,
  View as TamaguiView,
  Heading,
  SizableText,
  YStack,
  Button,
} from "tamagui";
import { useAuth, useSignIn } from "@clerk/clerk-expo";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { SubmitHandler, useForm } from "react-hook-form";
import { theme } from "@/theme/theme";
import TextInput from "@/components/TextInput";
import TextInputPassword from "@/components/TextInputPassword";
import LoadingModal from "@/components/LoadingModal";
import numoa from "@/assets/images/numoa.jpg"; 
import logo from "@/assets/images/logo.png";
import soo from "@/assets/images/soo.png";

interface Account {
  emailAddress: string;
  password: string;
}

const Index = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();

  const { control, handleSubmit, formState: { isValid } } = useForm<Account>({
    defaultValues: { emailAddress: "", password: "" },
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const passwordRef = useRef<any>(null);

  useFocusEffect(
    useCallback(() => {
      if (isSignedIn) {
        router.replace("/student/(home)");
      }
    }, [isSignedIn])
  );

  const onSignInPress: SubmitHandler<Account> = useCallback(
    async (data) => {
      if (!isLoaded) return;

      Keyboard.dismiss();

      try {
        setLoading(true);
        const completeSignIn = await signIn.create({
          identifier: data.emailAddress,
          password: data.password,
        });

        await setActive({ session: completeSignIn.createdSessionId });
        router.replace("/student/(drawer)/(home)/");
      } catch (err: any) {
        Alert.alert("Login Failed", err.errors?.[0]?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
    [isLoaded, signIn, setActive]
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Image source={numoa} objectFit="cover" top={0} width={"100%"} height={"35%"} />
          <TamaguiView flex={1} marginTop={-20} borderTopRightRadius={"$4"} borderTopLeftRadius={"$4"} backgroundColor={"white"}  padding="$4">
            <XStack alignItems="center" justifyContent="space-between" marginBottom="$4">
              <YStack>
                <Heading size="$9" fontFamily="$heading">NU Vision</Heading>
                <SizableText color="$gray10">Please login to continue.</SizableText>
              </YStack>
              <XStack alignItems="center" gap="$2">
                <Image source={soo} objectFit="contain" width={"$6"} height={"$6"} />
                <Image source={logo} objectFit="contain" width={"$6"} height={"$6"} />
              </XStack>
            </XStack>

            {/* Input Fields */}
            <YStack gap="$2">
              <TextInput
                name="emailAddress"
                label="Email Address"
                left="email-outline"
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

              <TextInputPassword
                ref={passwordRef}
                name="password"
                control={control}
                placeholder="Enter password"
                label="Password"
                left="lock-outline"
                right={showPassword ? "eye-off-outline" : "eye-outline"}
                secure={showPassword}
                secureFunction={() => setShowPassword(!showPassword)}
                rules={{
                  required: "Password is required",
                }}
              />
            </YStack>

            {/* Forgot Password */}
            <SizableText
              textAlign="right"
              mt="$2"
              onPress={() => router.push("/(public)/reset")}
            >
              Forgot Password?
            </SizableText>

            {/* Login Button */}
            <Button
              disabled={!isValid}
              onPress={handleSubmit(onSignInPress)}
              borderWidth={0}
              backgroundColor={theme.cyan10}
              color="white"
              pressStyle={{ backgroundColor: theme.cyan11 }}
              mt="$4"
            >
              Login
            </Button>

            {/* Sign Up Link */}
            <SizableText textAlign="center" mt="$4">
              Don't have an account?{" "}
              <SizableText
                color={theme.cyan10}
                onPress={() => router.push("/(public)/signup")}
              >
                Sign Up
              </SizableText>
            </SizableText>

            {/* Footer */}
            <YStack flex={1} justifyContent="flex-end" marginTop="$4">
              <SizableText alignSelf="center" size="$1" color="$gray10">
                © National University Mall of Asia - School of Optometry
              </SizableText>
            </YStack>
          </TamaguiView>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Loading Modal */}
      <LoadingModal isVisible={loading} text="Logging in..." />
    </SafeAreaView>
  );
};

export default Index;
