import React from 'react'
import { Drawer } from 'expo-router/drawer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import CustomDrawerComponent from '@/components/CustomDrawerComponent'
import { SizableText, } from 'tamagui'
import { Home, } from '@tamagui/lucide-icons'
import { theme } from '@/theme/theme'


const _layout = () => {

    return (
        <GestureHandlerRootView>
            <Drawer drawerContent={CustomDrawerComponent} screenOptions={{
                headerTintColor: "#ccf",
                headerShown: false,
                drawerActiveBackgroundColor: theme.cyan3,
                drawerActiveTintColor: theme.cyan10,
                drawerStyle: { width: "80%" },
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