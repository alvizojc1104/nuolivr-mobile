import React, { useState } from 'react';
import { router, Stack } from 'expo-router';
import { useSignIn, useUser } from '@clerk/clerk-expo';
import { Card, Heading, Input, Paragraph, YStack, Button, Fieldset, XStack, Circle, SizableText } from 'tamagui';
import Spinner from 'react-native-loading-spinner-overlay';
import { Eye, EyeOff } from '@tamagui/lucide-icons';
import axios from "axios"
import { err } from 'react-native-svg';

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
            console.error(err.errors[0])
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

            if (result) {
                const params = {
                    email_address: emailAddress,
                    password: password
                }

                console.log("Console inside reset function: user.id = ", emailAddress);

                try {
                    await axios.put("http://192.168.1.9:5001/api/reset/password", params)
                        .then(response => {
                            console.log(response);
                            alert('Password reset successfully');
                        })
                        .catch(err => {
                            console.error('Error in API call:', err.response?.data || err.message);
                        });
                } catch (err: any) {
                    console.log(err?.message)
                }
            }
            await setActive!({ session: result?.createdSessionId });
            // Log in the user automatically by setting the active session
            router.replace("/home")
        } catch (err: any) {
            console.error('Error in reset process:', err.message);
            alert(err.errors[0]?.message || 'Something went wrong');
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <YStack flex={1} justifyContent='center' alignItems='center'>
            <Stack.Screen options={{ headerBackVisible: !successfulCreation }} />
            <Spinner visible={isLoading} />
            {!successfulCreation && (
                <Card elevate padded width='90%' gap="$3">
                    <Fieldset>
                        <Heading>Reset Password</Heading>
                        <Paragraph color="$gray11">We will send a code to your email to reset your password.</Paragraph>
                    </Fieldset>
                    <Input size='$5' keyboardType='email-address' autoCapitalize="none" placeholder="example@gmail.com" placeholderTextColor='$gray8' value={emailAddress} onChangeText={setEmailAddress} />
                    <Card.Footer>
                        <Button onPress={onRequestReset} theme='active' w='100%' size='$5'>Send Code</Button>
                    </Card.Footer>
                </Card>
            )}

            {successfulCreation && (
                <>
                    <Card elevate padded width='90%' alignItems='flex-start' gap="$3">
                        <Fieldset>
                            <Heading>Reset Password</Heading>
                            <Paragraph color="$gray11">{`A code was sent to `}<Paragraph fontWeight={900} color='$gray11'>{emailAddress}</Paragraph>{`. Use the code to reset your password.`}</Paragraph>
                        </Fieldset>
                        <Fieldset width='100%'>
                            <Input size='$5' keyboardType='numeric' value={code} placeholder="Code" placeholderTextColor="$gray9" onChangeText={setCode} width='100%' />
                        </Fieldset>
                        <XStack
                            alignItems="center"
                            borderColor="$blue5"
                            borderWidth={1}
                            borderRadius="$5"
                            margin="$1"
                            backgroundColor="$blue2"
                        >
                            <Input
                                size="$5"
                                theme="blue_active"
                                value={password}
                                onChangeText={setPassword}
                                placeholder="New password"
                                placeholderTextColor="$gray9"
                                flex={1}
                                borderWidth={0}
                                backgroundColor="$blue2"
                                secureTextEntry={isSecured ? true : false}
                            />
                            <Circle
                                chromeless
                                size="$5"
                                height="100%"
                                onPress={() => setIsSecured(!isSecured)}
                                marginLeft={-20}
                            >
                                {isSecured ? (
                                    <EyeOff size="$1" alignContent="center" />
                                ) : (
                                    <Eye size="$1" />
                                )}
                            </Circle>
                        </XStack>
                        <XStack
                            alignItems="center"
                            borderColor="$blue5"
                            borderWidth={1}
                            borderRadius="$5"
                            margin="$1"
                            backgroundColor="$blue2"
                        >
                            <Input
                                size="$5"
                                theme="blue_active"
                                value={rePassword}
                                onChangeText={setRePassword}
                                placeholder="Re-enter new password"
                                placeholderTextColor="$gray9"
                                flex={1}
                                borderWidth={0}
                                backgroundColor="$blue2"
                                secureTextEntry={isSecured ? true : false}
                            />
                            <Circle
                                chromeless
                                size="$5"
                                height="100%"
                                onPress={() => setIsSecured(!isSecured)}
                                marginLeft={-20}
                            >
                                {isSecured ? (
                                    <EyeOff size="$1" alignContent="center" />
                                ) : (
                                    <Eye size="$1" />
                                )}
                            </Circle>
                        </XStack>
                        <Card.Footer>
                            <Button theme='active' onPress={onReset} width='100%' size='$5'>Change Password</Button>
                        </Card.Footer>
                    </Card>
                </>
            )}
        </YStack>
    );
};

export default PwReset;