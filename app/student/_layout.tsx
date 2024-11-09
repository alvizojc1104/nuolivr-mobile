import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { SizableText } from 'tamagui'

const _layout = () => {
    return (
        <Stack initialRouteName='(drawer)' screenOptions={{ headerShown: false,  }}>
            <Stack.Screen name='(drawer)' />
            <Stack.Screen name='attendance' />
            <Stack.Screen name='profile' options={{ presentation: 'modal', headerShown: true, headerTitle: () => (<SizableText >Profile</SizableText>) }} />
        </Stack>
    )
}

export default _layout