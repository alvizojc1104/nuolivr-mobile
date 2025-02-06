import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const Layout = () => {
      return (
            <Stack screenOptions={{ statusBarTranslucent: true, headerShown: false }}>
                  <Stack.Screen name='index' />
                  <Stack.Screen name='[moduleId]' />
            </Stack>
      )
}

export default Layout