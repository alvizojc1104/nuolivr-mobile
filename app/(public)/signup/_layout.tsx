import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "white" } }}>
            <Stack.Screen name='index' />
            <Stack.Screen name='verify' />
            <Stack.Screen name='form' />
        </Stack>
    )
}

export default _layout