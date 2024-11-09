import React from 'react'
import { Drawer } from 'expo-router/drawer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useColorScheme } from 'react-native'
import CustomDrawerComponent from '@/components/CustomDrawerComponent'
import {  SizableText, } from 'tamagui'
import { Home, } from '@tamagui/lucide-icons'
import { useNavigation } from 'expo-router'
import { theme } from '@/theme/theme'


const _layout = () => {
    const colorScheme = useColorScheme()
    const navigation = useNavigation()
    const sceneBackgroundColor = colorScheme === "dark" ? "hsl(212, 35.0%, 9.2%)" : 'hsla(0, 0%, 100%, 0)';

    return (
        <GestureHandlerRootView>
            <Drawer drawerContent={CustomDrawerComponent} screenOptions={{
                sceneContainerStyle: { backgroundColor: sceneBackgroundColor }, headerTintColor: "#ccf",
                headerShown: false,
                drawerActiveBackgroundColor: theme.cyan3,
                drawerActiveTintColor: theme.cyan10
            }}>
                <Drawer.Screen name='(home)' options={{
                    drawerLabel: ({ color }) => (<SizableText color={color}>Home</SizableText>),
                    drawerIcon: ({ size, color }) => (<Home size={size} color={color} />)
                }} />
            </Drawer>
        </GestureHandlerRootView>
    )
}

export default _layout