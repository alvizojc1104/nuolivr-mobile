import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { theme } from '@/theme/theme'
import { SizableText } from 'tamagui'

const _layout = () => {
    return (
        <Stack screenOptions={{ headerStyle: { backgroundColor: theme.cyan10 }, headerTintColor: "white",statusBarTranslucent:true, statusBarStyle:"light", }}>
            <Stack.Screen name='[patient_id]' options={{ headerTitle: () => <SizableText color={"white"}>Patient</SizableText> }} />
            <Stack.Screen name='export-pdf' options={{ headerTitle: () => <SizableText color={"white"}>Export to PDF</SizableText> }} />
        </Stack>
    )
}

export default _layout