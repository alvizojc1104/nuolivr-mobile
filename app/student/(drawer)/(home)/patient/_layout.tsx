import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { theme } from '@/theme/theme'
import { Heading } from 'tamagui'

const _layout = () => {
    return (
        <Stack screenOptions={{ headerStyle: { backgroundColor: theme.cyan10 }, headerTintColor: "white",statusBarTranslucent:true, statusBarStyle:"light", }}>
            <Stack.Screen name='[patient_id]' options={{ headerTitle: () => <Heading fontSize={"$7"} color={"white"}>Patient</Heading> }} />
            <Stack.Screen name='export-pdf' options={{ headerTitle: () => <Heading fontSize={"$7"} color={"white"}>Export to PDF</Heading> }} />
        </Stack>
    )
}

export default _layout