import React, { useState } from 'react'
import { theme } from '@/theme/theme'
import { BookUser, Camera, ChevronRight, ClipboardList, Pill, Settings } from '@tamagui/lucide-icons'
import { StatusBar } from 'expo-status-bar'
import { Alert, TouchableOpacity, useColorScheme } from 'react-native'
import { Avatar, Button, Circle, Heading, ListItem, ScrollView, Separator, SizableText, View, YGroup, YStack } from "tamagui"
import { useAuth, useUser } from '@clerk/clerk-expo'
import * as ImagePicker from "expo-image-picker"
import Spinner from 'react-native-loading-spinner-overlay'

const profile = () => {
    const colorScheme = useColorScheme()
    const { user } = useUser()
    const { signOut } = useAuth()
    const [loading, setLoading] = useState(false)



    const captureImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.75,
                aspect: [4, 4],
                base64: true,
            });

            if (!result.canceled) {
                setLoading(true);
                const base64 = `data:image/png;base64,${result.assets[0].base64}`;
                await user?.setProfileImage({
                    file: base64,
                });
            }
        } catch (error) {
            Alert.alert("Error", "Error uploading photo.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <ScrollView contentContainerStyle={{ flex: 1 }}>
            <Spinner visible={loading} />
            <YStack backgroundColor={"$background"} padding={"$5"} alignItems='center' width={"100%"}>
                <View position="relative">
                    <Avatar circular size="$10">
                        <Avatar.Image src={user?.imageUrl} />
                        <Avatar.Fallback backgroundColor={theme.cyan5} delayMs={1000} />
                    </Avatar>
                    <TouchableOpacity
                        onPress={captureImage}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            right: -5,
                            backgroundColor: 'white',
                            borderRadius: 20,
                            padding: 5,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 3,
                            elevation: 5,
                        }}
                    >
                        <Camera size={20} color="black" />
                    </TouchableOpacity>
                </View>
                <Heading mt="$4">{`${user?.firstName} ${user?.lastName}`}</Heading>
                <SizableText color="$gray10">{user?.primaryEmailAddress?.emailAddress}</SizableText>
            </YStack>
            <YGroup mb="$4" marginHorizontal="$5" bordered>
                <YGroup.Item>
                    <ListItem
                        padded
                        borderRadius={"$4"}
                        icon={
                            <Circle backgroundColor={theme.cyan5} size={"$4"}>
                                <BookUser color={theme.cyan10} size={"$1"} />
                            </Circle>
                        }
                        title="Account Details"
                        subTitle="View your account details"
                        iconAfter={ChevronRight}
                        pressTheme
                        backgroundColor={colorScheme === "dark" ? "black" : "white"}
                    />
                </YGroup.Item>
                <Separator />
                <YGroup.Item>
                    <ListItem
                        padded
                        icon={
                            <Circle backgroundColor={theme.cyan5} size={"$4"}>
                                <ClipboardList color={theme.cyan10} size={"$1"} />
                            </Circle>
                        }
                        title="My Patients"
                        subTitle="View your patients"
                        iconAfter={ChevronRight}
                        pressTheme
                        backgroundColor={colorScheme === "dark" ? "black" : "white"}
                    />
                </YGroup.Item>
                <Separator />
                <YGroup.Item>
                    <ListItem
                        padded
                        icon={
                            <Circle backgroundColor={theme.cyan5} size={"$4"}>
                                <Pill color={theme.cyan10} size={"$1"} />
                            </Circle>
                        }
                        title="Prescriptions"
                        subTitle="View your prescriptions"
                        iconAfter={ChevronRight}
                        pressTheme
                        backgroundColor={colorScheme === "dark" ? "black" : "white"}
                    />
                </YGroup.Item>
                <Separator />
                <YGroup.Item>
                    <ListItem
                        borderRadius={"$4"}
                        padded
                        icon={
                            <Circle backgroundColor={theme.cyan5} size={"$4"}>
                                <Settings color={theme.cyan10} />
                            </Circle>
                        }
                        title="Settings"
                        subTitle="Configure app settings"
                        iconAfter={ChevronRight}
                        pressTheme
                        backgroundColor={colorScheme === "dark" ? "black" : "white"}
                    />
                </YGroup.Item>
            </YGroup>
            <Button onPress={() => { signOut() }} color={"white"} backgroundColor={"$red10"} borderWidth={0} pressStyle={{ backgroundColor: "$red11" }} alignSelf='center' position='absolute' bottom="$4" width={"90%"}>Logout</Button>
            <StatusBar style='light' />
        </ScrollView>
    )

}

export default profile