import { useAuth, useUser } from "@clerk/clerk-expo";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { Edit3, LogOut, TimerOff } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Appearance, Platform, TouchableNativeFeedback, TouchableOpacity, useColorScheme } from "react-native";
import { Avatar, Heading, SizableText, Switch, View, XStack, YStack } from "tamagui";
import { theme } from "@/theme/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CustomDrawerComponent(props: any) {
    const { user } = useUser()
    const { signOut } = useAuth()
    const colorScheme = useColorScheme();
    const [scheme, setScheme] = useState<any>(colorScheme)

    const onLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                { text: "No", style: "cancel" },
                { text: "Yes", onPress: handleSignOut }
            ]
        )
    }

    const handleSignOut = async () => {
        try {
            await signOut().then(() => {
                router.replace("/login")
            })
        } catch (error) {
            console.error("Error signing out:", error)
        }
    }

    const openScanner = () => {
        router.push("/student/attendance/scanner")
    }

    const viewProfile = () => {
        router.push("/student/account")
    }

    const formatRole = (role: string) => {
        return role.replace(/-/g, " ")
    }

    return (
        <View flex={1} justifyContent="space-between">
            <YStack height="40%" justifyContent="flex-end" alignItems="flex-start" padding="$3" backgroundColor={theme.cyan10} >
                <Avatar elevate circular size="$10">
                    <Avatar.Image src={user?.imageUrl} />
                </Avatar>
                <TouchableOpacity onPress={viewProfile}>
                    <Heading color="white">{user?.fullName}</Heading>
                </TouchableOpacity>
                <SizableText size="$3" color="$white1" textTransform="capitalize">College of Optometry</SizableText>
                <SizableText size="$3" color="$white1" textTransform="capitalize">{formatRole(user?.publicMetadata.role as string)}</SizableText>
                <SizableText size="$2" color="$gray7">{user?.primaryEmailAddress?.emailAddress}</SizableText>
            </YStack>
            <DrawerContentScrollView {...props} style={{ flex: 1 }}>
                <DrawerItemList {...props} />
                <DrawerItem label={() => <SizableText>Time Out</SizableText>} onPress={openScanner} icon={({ color }) => <TimerOff color={color} />} />
                <DrawerItem label={() => <SizableText>Logout</SizableText>} onPress={onLogout} icon={() => <LogOut color="red" />} />
            </DrawerContentScrollView>
        </View>
    )
}
