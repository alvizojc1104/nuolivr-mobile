import React from 'react'
import { Stack } from 'expo-router'
import { SizableText } from 'tamagui'
import { theme } from '@/theme/theme'

const _layout = () => {

    return (
        <Stack screenOptions={{ statusBarTranslucent: true, statusBarStyle: 'light', contentStyle:{backgroundColor:"white"} }}>
            <Stack.Screen name='index' options={{ headerTintColor: "white", headerTitle: () => <SizableText color={"white"}>New Patient</SizableText>, headerTitleAlign: "center", headerShadowVisible: false, headerStyle: { backgroundColor: theme.cyan10 } }} />
            <Stack.Screen name='eye-triage' options={{ headerTintColor: "white", headerTitle: () => <SizableText color={"white"}>Eye Triage</SizableText>, headerShadowVisible: false, headerStyle: { backgroundColor: theme.cyan10 } }} />
            <Stack.Screen name='initial-observation' options={{ headerTintColor: "white", headerTitle: () => <SizableText color={"white"}>Patient Case Record</SizableText>, headerShadowVisible: false, headerStyle: { backgroundColor: theme.cyan10 } }} />
        </Stack>
    )
}

export default _layout