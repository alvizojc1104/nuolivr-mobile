import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
    return (
        <Stack initialRouteName='(drawer)' screenOptions={{ headerShown: false, }}>
            <Stack.Screen name='(drawer)' />
            <Stack.Screen name='attendance' />
        </Stack>
    )
}

export default _layout