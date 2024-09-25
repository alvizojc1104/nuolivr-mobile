import React from 'react'
import { Drawer } from 'expo-router/drawer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useColorScheme } from 'react-native'
import CustomDrawerComponent from '@/components/CustomDrawerComponent'
import { Avatar,  SizableText,  } from 'tamagui'
import { useUser } from '@clerk/clerk-expo'
import { Home,  Megaphone } from '@tamagui/lucide-icons'
import { DrawerActions } from '@react-navigation/native'
import { useNavigation } from 'expo-router'


const _layout = () => {
    const { user } = useUser()
    const colorScheme = useColorScheme()
    const navigation = useNavigation()
    const tabColor = colorScheme === "dark" ? 'hsl(211, 85.1%, 27.4%)' : 'hsl(211, 100%, 43.2%)'
    const sceneBackgroundColor = colorScheme === "dark" ? "hsl(212, 35.0%, 9.2%)" : 'hsla(0, 0%, 100%, 0)';

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer)
    }

    return (
        <GestureHandlerRootView>
            <Drawer drawerContent={CustomDrawerComponent} screenOptions={{
                sceneContainerStyle: { backgroundColor: sceneBackgroundColor }, headerTintColor: "#fff",
                headerLeft: () => (<Avatar circular marginLeft="$3" onPress={openDrawer}>
                    <Avatar.Image src={user?.imageUrl} />
                </Avatar>),
                headerShown: false,
            }}>
                <Drawer.Screen name='(home)' options={{
                    drawerLabel: ({ color }) => (<SizableText color={color}>Home</SizableText>),
                    drawerIcon: ({ size, color }) => (<Home size={size} color={color} />)
                }} />
                <Drawer.Screen name='announcement-page' options={{
                    headerShown: true,
                    drawerLabel: ({ color }) => (<SizableText color={color}>Announcement</SizableText>),
                    headerTitle: () => (<SizableText size="$5" fontWeight={900}>Announcements</SizableText>),
                    drawerIcon: ({ size, color }) => (<Megaphone size={size} color={color} />)
                }} />
            </Drawer>
        </GestureHandlerRootView>
    )
}

export default _layout