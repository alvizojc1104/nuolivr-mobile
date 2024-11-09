import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { SizableText } from 'tamagui'
import { theme } from '@/theme/theme'

const _layout = () => {
    return (
        <Stack screenOptions={{ headerShown: false, headerStyle: { backgroundColor: theme.cyan10 }, statusBarHidden: true }}>
            <Stack.Screen name='index' />
        </Stack>
    )
}

export default _layout