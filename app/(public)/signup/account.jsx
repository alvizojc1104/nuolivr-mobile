import { useState, useEffect } from "react";
import {
  Input,
  YStack,
  Button,
  Paragraph,
  XStack,
  ScrollView,
  SizableText,
} from "tamagui";
import {
  AlertCircle,
  ArrowLeft,
  Check as CheckIcon,
  CheckCircle,
  CheckCircle2,
} from "@tamagui/lucide-icons";
import { router, Stack } from "expo-router";
import StyledInput from "../../../components/StyledInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSignUp } from "@clerk/clerk-expo";
import Spinner from "react-native-loading-spinner-overlay";

const Account = () => {
  const { isLoaded, signUp } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [reEnteredPassword, setReEnteredPassword] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState("");
  const [matchPasswords, setMatchPasswords] = useState(false);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setIsValid(false);
      setError("Required");
    } else if (emailRegex.test(email)) {
      setIsValid(true);
      setError("");
    } else {
      setIsValid(false);
      setError("Invalid email address.");
    }
  }, [email]);

  useEffect(() => {
    setMatchPasswords(password === reEnteredPassword);
  }, [password, reEnteredPassword]);

  const passwordValidators = [
    {
      requirement: "Must have at least 8 characters",
      valid: password.length >= 8,
    },
    {
      requirement: "Must have one uppercase letter [A-Z]",
      valid: /[A-Z]/.test(password),
    },
    {
      requirement: "Must have one lowercase letter [a-z]",
      valid: /[a-z]/.test(password),
    },
    {
      requirement: "Must have one number [0-9]",
      valid: /[0-9]/.test(password),
    },
    {
      requirement: "Must have one special character [!@#$%^&*]",
      valid: /[!@#$%^&*]/.test(password),
    },
  ];

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    console.log(email, password)
    try {
      // Create the user on Clerk
      await signUp?.create({
        emailAddress: email,
        password: password,
      });

      // Send verification Email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      await AsyncStorage.setItem("@password", password);
      router.push("/signup/verify");
    } catch (err) {
      alert(err.errors[0].message);
      console.log(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  const allValid = passwordValidators.every((v) => v.valid);

  const handlelSignUp = async () => {
    if (isValid && allValid && matchPasswords) {
      onSignUpPress();
      await AsyncStorage.setItem("@email", JSON.stringify(email));
    } else {
      return;
    }
  };

  return (
    <YStack flex={1} justifyContent="center">
      <Spinner visible={loading} />
      <ScrollView
        contentContainerStyle={{
          justifyContent: "flex-start",
          alignItems: "flex-start",
          padding: "$3",
        }}
        flex={1}
      >
        <YStack width="100%" gap="$2">
          <Paragraph size="$5" marginLeft="$2" fontWeight="bold">
            Email Address
          </Paragraph>
          <Input
            theme="blue"
            size="$5"
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="$gray9"
          />
          {error && (
            <XStack alignItems="center" gap="$2" marginLeft="$3">
              <AlertCircle size="$1" color="$red9" />
              <Paragraph color="$red9">{error}</Paragraph>
            </XStack>
          )}
          <Paragraph size="$5" marginLeft="$2" fontWeight="bold">
            Password
          </Paragraph>

          <StyledInput
            password={password}
            setPassword={setPassword}
            placeholder={"Password"}
            allValid={allValid}
          />
          {password ? null : (
            <Validators requirement={"Required"} valid={false} />
          )}
          <YStack paddingVertical="$2">
            <Paragraph color="$gray10" paddingLeft="$3">
              Password:
            </Paragraph>
            {passwordValidators.map((validator, index) => (
              <Validators
                key={index}
                requirement={validator.requirement}
                valid={validator.valid}
              />
            ))}
          </YStack>
          <Paragraph size="$5" marginLeft="$2" fontWeight={900}>
            Re-enter Password
          </Paragraph>

          <StyledInput
            password={reEnteredPassword}
            setPassword={setReEnteredPassword}
            placeholder={"Re-enter Password"}
            allValid={matchPasswords}
          />
          {matchPasswords ? null : (
            <Validators requirement={"Password not matched."} valid={false} />
          )}
        </YStack>
      </ScrollView>
      <Button
        size="$5"
        fontWeight={900}
        onPress={handlelSignUp}
        theme="blue_active"
        margin="$4"
      >
        Continue
      </Button>
    </YStack>
  );
};

const Validators = ({ requirement, valid }) => (
  <XStack marginVertical="$1" alignItems="center" gap="$2" marginLeft="$3">
    {valid ? (
      <CheckCircle2 size="$1" color="$green11" />
    ) : (
      <AlertCircle size="$1" color="$red10" />
    )}
    <SizableText color={valid ? "$green11" : "$red10"}>
      {requirement}
    </SizableText>
  </XStack>
);

export default Account;
