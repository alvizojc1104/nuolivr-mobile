import React from 'react'
import { Stack } from 'expo-router'
import { Heading } from 'tamagui'
import { theme } from '@/theme/theme'

const _layout = () => {

    return (
        <Stack screenOptions={{ statusBarTranslucent: true, statusBarStyle: 'light', contentStyle:{backgroundColor:"white"} }}>
            <Stack.Screen name='index' options={{ headerTintColor: "white", headerTitle: () => <Heading fontSize={"$7"} color={"white"}>New Patient</Heading>, headerTitleAlign: "center", headerShadowVisible: false, headerStyle: { backgroundColor: theme.cyan10 } }} />
            <Stack.Screen name='eye-triage' options={{ headerTintColor: "white", headerTitle: () => <Heading fontSize={"$7"} color={"white"}>Eye Triage</Heading>, headerShadowVisible: false, headerStyle: { backgroundColor: theme.cyan10 } }} />
            <Stack.Screen name='initial-observation' options={{ headerTintColor: "white", headerTitle: () => <Heading fontSize={"$7"} color={"white"}>Patient Case Record</Heading>, headerShadowVisible: false, headerStyle: { backgroundColor: theme.cyan10 } }} />
        </Stack>
    )
}

export default _layout