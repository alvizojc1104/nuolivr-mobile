import CustomButton from '@/components/CustomButton'
import useUserData from '@/hooks/useUserData'
import { bg } from '@/theme/theme'
import { AlertTriangle } from '@tamagui/lucide-icons'
import { useCameraPermissions } from 'expo-image-picker'
import { Link, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Alert } from 'react-native'
import { Card, Heading, SizableText, View, XStack } from 'tamagui'

const index = () => {
    const background = bg()
    const [permission, requestPermission] = useCameraPermissions();
    const { userData, loading, error } = useUserData(); // Fetch user data using the custom hook
    const isPermissionGranted = Boolean(permission?.granted);

    console.log(userData)
    const attendanceLog = () => {
        if (isPermissionGranted) {
            router.push("/student/attendance/scanner")
        } else {
            requestPermission()
            router.push("/student/attendance/scanner")
        }
    }
    return (
        <View flex={1} backgroundColor={background} padding="$5" justifyContent='center' alignItems='center'>
            <Card padding="$5" backgroundColor={background} elevate>
                <XStack alignItems='center' gap="$2" backgroundColor={"$red5"} p="$2" borderRadius={"$1"}>
                    <AlertTriangle color={"red"} size={16} />
                    <SizableText color={"red"}>Access Denied!</SizableText>
                </XStack>
                <Heading mt="$4">NU Vision</Heading>
                <SizableText textAlign='left'>You must be in the clinic to continue working in your app.</SizableText>
                <Card.Footer>
                    <CustomButton flex={1} mt="$5" buttonText='Already in the clinic?' onPress={attendanceLog} />
                </Card.Footer>
            </Card>
            <StatusBar style='light' />
        </View>
    )
}

export default index