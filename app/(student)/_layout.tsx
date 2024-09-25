import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { SizableText } from 'tamagui'

const _layout = () => {
    return (
        <Stack initialRouteName='(drawer)' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='(drawer)' />
            <Stack.Screen name='profile' options={{ presentation: 'modal', headerShown: true, headerTitle: () => (<SizableText >Profile</SizableText>) }} />
            <Stack.Screen name='pre-assessment' />
            <Stack.Screen name='acuity' options={{presentation:'modal', headerShown:true, headerTitle:()=><SizableText>New Visual Acuity</SizableText>}} />
            <Stack.Screen name='patients' />
        </Stack>
    )
}

export default _layout