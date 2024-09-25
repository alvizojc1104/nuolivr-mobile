import React from 'react'
import { Drawer } from 'expo-router/drawer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useColorScheme } from 'react-native'
import CustomDrawerComponent from '@/components/CustomDrawerComponent'
import { Avatar, SizableText, View, } from 'tamagui'
import { useUser } from '@clerk/clerk-expo'
import { DrawerActions } from '@react-navigation/native'
import { useNavigation } from 'expo-router'
import { Tabs } from 'expo-router'
import { Heading } from 'tamagui'
import { LayoutDashboard, MoreHorizontal, NotepadText, ScanEye } from '@tamagui/lucide-icons'


const _layout = () => {
    const { user } = useUser()
    const colorScheme = useColorScheme()
    const navigation = useNavigation()
    const sceneBackgroundColor = colorScheme === "dark" ? "hsl(212, 35.0%, 9.2%)" : undefined;
    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer)
    }
    return (
        <Tabs screenOptions={{
            headerTintColor: "#fff",
            headerLeft: () => (<Avatar circular marginLeft="$3" onPress={openDrawer}>
                <Avatar.Image src={user?.imageUrl} />
            </Avatar>),
            headerTitleAlign:'center',
            tabBarHideOnKeyboard:true,
        }}
            sceneContainerStyle={{ backgroundColor: sceneBackgroundColor }}
            
        >
            <Tabs.Screen name="index" options={{
                headerTitle: () => <SizableText size="$5" fontWeight={900}>Dashboard</SizableText>,
                tabBarIcon: ({ size, color }) => (<LayoutDashboard size={size} color={color} />),
                tabBarLabel: ({ color }) => <SizableText color={color} size="$1">Dashboard</SizableText>
            }} />
            <Tabs.Screen name="preassessments" options={{
                headerTitle: () => <SizableText size="$5" fontWeight={900}>Pre Assessment</SizableText>,
                tabBarIcon: ({ size, color }) => (<NotepadText size={size} color={color} />),
                tabBarLabel: ({ color }) => <SizableText color={color} size="$1">Pre Assessments</SizableText>,
            }} />
            <Tabs.Screen name="visual-acuity" options={{
                headerTitle: () => <SizableText size="$5" fontWeight={900}>Visual Acuity</SizableText>,
                tabBarIcon: ({ size, color }) => (<ScanEye size={size} color={color} />),
                tabBarLabel: ({ color }) => <SizableText color={color} size="$1" ellipse>Visual Acuity</SizableText>
            }} />
            <Tabs.Screen name="more" options={{
                headerTitle: () => <SizableText size="$5" fontWeight={900}>More</SizableText>,
                tabBarIcon: ({ size, color }) => (<MoreHorizontal size={size} color={color} />),
                tabBarLabel: ({ color }) => <SizableText color={color} size="$1">More</SizableText>
            }} />
        </Tabs>
    )
}

export default _layout