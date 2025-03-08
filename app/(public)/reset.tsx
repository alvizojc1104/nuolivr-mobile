import React, { useState } from 'react';
import { router, Stack } from 'expo-router';
import { useSignIn, useUser } from '@clerk/clerk-expo';
import { Card, Heading, Input, Paragraph, YStack, Button, Fieldset, Spinner, SizableText, View } from 'tamagui';
import { ArrowLeft, Eye, EyeOff, MoveLeft } from '@tamagui/lucide-icons';
import axios from "axios"
import { theme } from '@/theme/theme';
import { StatusBar } from 'expo-status-bar';
import { Alert, SafeAreaView } from 'react-native';

const PwReset = () => {
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [code, setCode] = useState('');
    const [successfulCreation, setSuccessfulCreation] = useState(false);
    const { signIn, setActive } = useSignIn();
    const [isLoading, setIsLoading] = useState(false)
    const [isSecured, setIsSecured] = useState(true)

    // Request a passowrd reset code by email
    const onRequestReset = async () => {
        setIsLoading(true)
        try {
            await signIn?.create({
                strategy: 'reset_password_email_code',
                identifier: emailAddress,
            });
            setSuccessfulCreation(true);
        } catch (err: any) {
            alert(err.errors[0].message);
        } finally {
            setIsLoading(false)
        }
    };

    // Reset the password with the code and the new password
    const onReset = async () => {
        if (rePassword !== password) {
            alert("Passwords do not match.")
            return
        }

        try {
            setIsLoading(true);  // Only set once at the beginning

            // Attempt password reset via Clerk
            const result = await signIn?.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
                password,
            });
            Alert.alert(
                "Success",
                "Password has been changed successfully!"
            )
            await setActive!({ session: result?.createdSessionId });
            // Log in the user automatically by setting the active session
            router.replace("/")

        } catch (err: any) {
            Alert.alert(
                "Password Reset Failed",
                err.errors[0].longMessage
            )
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, marginTop: 50 }}>
            <Stack.Screen options={{ headerBackVisible: !successfulCreation }} />
            <YStack paddingHorizontal="$5">
                <ArrowLeft mb="$4" onPress={() => router.back()} />

                {!successfulCreation && (
                    <View gap="$4">
                        <Fieldset>
                            <Heading>Reset Password</Heading>
                            <Paragraph color="$gray10">We will send a code to your email to reset your password.</Paragraph>
                        </Fieldset>
                        <Input autoFocus keyboardType='email-address' autoCapitalize="none" placeholder="example@gmail.com" placeholderTextColor='$gray8' value={emailAddress} onChangeText={setEmailAddress} />
                        <Button
                            disabled={isLoading ? true : false}
                            icon={isLoading ? <Spinner size="small" /> : null}
                            onPress={onRequestReset}
                            borderWidth={0}
                            backgroundColor={theme.cyan10}
                            color={"white"}
                            pressStyle={{ backgroundColor: theme.cyan11 }}
                            disabledStyle={{ backgroundColor: theme.cyan8 }}
                            mt="$4"
                        >
                            {isLoading ? "Sending..." : "Send Code"}
                        </Button>
                    </View>

                )}

                {successfulCreation && (
                    <View gap="$4">
                        <Fieldset>
                            <Heading>Reset Password</Heading>
                            <Paragraph color="$gray11">{`A code was sent to `}<Paragraph fontWeight={900} color='$gray11'>{emailAddress}</Paragraph>{`. Use the code to reset your password.`}</Paragraph>
                        </Fieldset>
                        <Input autoFocus keyboardType='numeric' value={code} placeholder="Code" placeholderTextColor="$gray9" onChangeText={setCode} width='100%' />
                        <Input
                            value={password}
                            onChangeText={setPassword}
                            placeholder="New password"
                            placeholderTextColor="$gray9"
                            secureTextEntry={isSecured ? true : false}
                            width={"100%"}
                        />
                        <Input
                            value={rePassword}
                            onChangeText={setRePassword}
                            placeholder="Re-enter new password"
                            placeholderTextColor="$gray9"
                            secureTextEntry={isSecured ? true : false}
                            width={"100%"}
                        />
                        <SizableText width={"100%"} color={theme.cyan10} textAlign='right' onPress={() => setIsSecured(!isSecured)}>{isSecured ? "Show Password" : "Hide Password"}</SizableText>
                        <Button
                            flex={1}
                            disabled={isLoading ? true : false}
                            icon={isLoading ? <Spinner size="small" /> : null}
                            onPress={onReset}
                            borderWidth={0}
                            backgroundColor={theme.cyan10}
                            color={"white"}
                            pressStyle={{ backgroundColor: theme.cyan11 }}
                            disabledStyle={{ backgroundColor: theme.cyan8 }}
                            mt="$4"
                        >
                            {isLoading ? "Resetting..." : "Change Password"}
                        </Button>
                    </View>
                )}
                <StatusBar style='dark' />
            </YStack>
        </SafeAreaView>
    );
};

export default PwReset;