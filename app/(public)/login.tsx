import { EyeOff, Eye, Mail, Lock } from "@tamagui/lucide-icons";
import { router } from "expo-router";
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
import { useState, useCallback } from "react";
import { useSignIn } from "@clerk/clerk-expo";
import View from "@/components/View";
import numoa from "@/assets/images/numoa.jpg";
import logo from "@/assets/images/logo.png";
import soo from "@/assets/images/soo.png";

import { SubmitHandler, useController, useForm } from "react-hook-form";
import { theme } from "@/theme/theme";
import { Keyboard, KeyboardAvoidingView, Platform } from "react-native";

interface Account {
  emailAddress: string;
  password: string;
}

const TextInput = ({ name, control, placeholder, secureTextEntry, rules }: any) => {
  const { field, fieldState: { error } } = useController({
    control,
    defaultValue: "",
    name,
    rules,
  });

  return (
    <>
      <Input
        placeholder={placeholder}
        value={field.value}
        onChangeText={field.onChange}
        secureTextEntry={secureTextEntry}
        keyboardType={name === "emailAddress" ? "email-address" : "default"}
        autoCapitalize="none"
        autoCorrect={false}
        theme={error ? "red" : null}
        backgroundColor={"$background0"}
      />
      {
        error && (
          <SizableText size={"$1"} color={"$red9"} ml="$2">
            {error.message}
          </SizableText>
        )
      }
    </>
  );
};

const Index = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { control, handleSubmit } = useForm<Account>({
    defaultValues: { emailAddress: "", password: "" }
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // password visibility state

  const onSignInPress: SubmitHandler<Account> = useCallback(
    async (data: Account) => {
      if (!isLoaded) return;
      
      Keyboard.dismiss()
      setLoading(true);
      
      try {
        const completeSignIn = await signIn.create({
          identifier: data.emailAddress,
          password: data.password,
        });

        await setActive({ session: completeSignIn.createdSessionId });
        router.replace("/home");
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0} // Adjust as needed
    >
      <TamaguiView flex={1}>
        <Image src={numoa} objectFit="cover" width={"100%"} height={"35%"} />
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

          <XStack alignItems="center" gap="$2" mt="$6" mb="$2">
            <Mail size={16} />
            <SizableText>Email Address</SizableText>
          </XStack>
          <TextInput
            name="emailAddress"
            control={control}
            placeholder="Enter email address"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            }}
          />
          <XStack alignItems="center" gap="$2" mt="$2" mb="$2">
            <Lock size={16} />
            <SizableText>Password</SizableText>
            <XStack flex={1} />
            <SizableText onPress={() => setShowPassword(!showPassword)} textAlign="right" color={theme.cyan10}>{showPassword ? "Hide" : "Show"}</SizableText>
          </XStack>
          <TextInput
            name="password"
            control={control}
            placeholder="Enter password"
            secureTextEntry={!showPassword}
            rules={{
              required: "Password is required",
            }}
          />
          <Button
            disabled={loading ? true : false}
            icon={loading ? <Spinner size="small" /> : null}
            onPress={handleSubmit(onSubmit)}
            borderWidth={0}
            backgroundColor={theme.cyan10}
            color={"white"}
            pressStyle={{ backgroundColor: theme.cyan11 }}
            disabledStyle={{ backgroundColor: theme.cyan8 }}
            mt="$4"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          <SizableText textDecorationLine="underline" textAlign="center" mt="$4" onPress={() => router.push("/(public)/reset")}>Forgot Password?</SizableText>
          <YStack flex={1} />
          <SizableText alignSelf="center" size={"$1"} color={"$gray10"}>© National University Mall of Asia - School of Optometry</SizableText>
        </View>
      </TamaguiView>
    </KeyboardAvoidingView>
  );
};

export default Index;
