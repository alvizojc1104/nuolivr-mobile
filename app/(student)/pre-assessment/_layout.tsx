import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { SizableText } from 'tamagui'

const _layout = () => {
    const colorScheme = useColorScheme()
    const sceneBackgroundColor = colorScheme === "dark" ? "hsl(212, 35.0%, 9.2%)" : 'hsla(0, 0%, 100%, 0)';

    return (
        <Stack initialRouteName='new' screenOptions={{ contentStyle: { backgroundColor: sceneBackgroundColor } }}>
            <Stack.Screen name='new' options={{ headerTitle: () => (<SizableText>{`Pre-assessment (New)`}</SizableText>), headerTitleAlign:'center' }} />
            <Stack.Screen name='existing' options={{ headerTitle: () => (<SizableText>{`Pre-assessment (Existing)`}</SizableText>), headerTitleAlign:'center' }} />
        </Stack>
    )
}

export default _layout