import { EyeOff, Eye } from "@tamagui/lucide-icons";
import { Link, router } from "expo-router";
import {
  Button,
  Heading,
  XStack,
  YStack,
  Paragraph,
  Input,
  Theme,
  SizableText,
  Circle,
} from "tamagui";
import { useState, useCallback } from "react";
import { useSignIn } from "@clerk/clerk-expo";
import Spinner from 'react-native-loading-spinner-overlay';

const Index = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password: password,
      });

      await setActive({ session: completeSignIn.createdSessionId });
      router.replace("/home");
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  }, [emailAddress, password, isLoaded, signIn, setActive]);

  const handleSignUp = useCallback(() => {
    router.push("/signup");
  }, []);

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding={10}
      gap="$5"
      paddingHorizontal="$6"
    >
      {loading && <Spinner visible={loading} />}
      <YStack alignItems="flex-start" width="100%">
        <Heading size="$8">Welcome back,</Heading>
        <Heading size={"$10"}>NU OLIVR</Heading>
        <SizableText color="$gray9">Please login to continue.</SizableText>
      </YStack>
      <YStack width="100%" gap="$3">
        <Input
          size="$5"
          placeholder="Email"
          keyboardType="email-address"
          value={emailAddress}
          onChangeText={setEmailAddress}
        />
        <StyledInput value={password} setValue={setPassword} />
        <Link href={'/reset'} asChild>
          <Paragraph fontWeight='800' alignSelf="flex-end" >Forgot Password?</Paragraph>
        </Link>
      </YStack>
      <Button
        size="$5"
        width="100%"
        onPress={onSignInPress}
        theme="blue_active"
      >
        <Heading size="$6" fontWeight={900}>
          Login
        </Heading>
      </Button>
      <XStack gap="$2">
        <SizableText fontSize="$5">No account?</SizableText>
        <Button unstyled alignSelf="flex-end" onPress={handleSignUp}>
          <Paragraph fontWeight={900} fontSize="$5">
            Sign up
          </Paragraph>
        </Button>
      </XStack>
    </YStack>
  );
};

const StyledInput = ({ value, setValue }: any) => {
  const [isSecured, setIsSecured] = useState(true);

  const toggleSecureEntry = useCallback(() => {
    setIsSecured((prev) => !prev);
  }, []);

  return (
    <Theme name="blue">
      <XStack
        alignItems="center"
        borderColor="$blue5"
        borderWidth={1}
        borderRadius="$5"
        margin="$1"
        backgroundColor='$blue2'
      >
        <Input
          size="$5"
          placeholder="Password"
          flex={1}
          borderColor="$background"
          focusStyle={{
            borderColor: "$background",
          }}
          borderWidth="$0"
          backgroundColor="$background"
          secureTextEntry={isSecured}
          value={value}
          onChangeText={setValue}
        />
        <Circle
          chromeless
          pressTheme={false}
          size="$5"
          height='100%'
          onPress={toggleSecureEntry}
        >
          {isSecured ? <EyeOff size='$1' alignContent="center" /> : <Eye size='$1' />}
        </Circle>
      </XStack>
    </Theme>
  );
}

export default Index;
