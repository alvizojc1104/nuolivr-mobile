import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Heading, Paragraph } from 'tamagui'

const _layout = () => {
    const colorScheme = useColorScheme()
    const sceneBackgroundColor =
        colorScheme === "dark"
            ? "hsl(212, 35.0%, 9.2%)" // Dark mode background color
            : 'hsla(0, 0%, 100%, 0)'; // Light mode background color
    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: sceneBackgroundColor } }} >
            <Stack.Screen name='home' />
            <Stack.Screen name='book' />
            <Stack.Screen name='profile' options={{ headerShown: true, headerTitle: () => (<Heading fontWeight={900}>My Profile</Heading>), }} />
        </Stack>
    )
}

export default _layout