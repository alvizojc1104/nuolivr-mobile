import { useAuth, useUser } from "@clerk/clerk-expo";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { Edit3, LogOut, TimerOff } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Appearance, ColorSchemeName, Platform, TouchableOpacity, useColorScheme } from "react-native";
import { Avatar, Heading, SizableText, Switch, View, XStack, YStack } from "tamagui";
import Logout from "./Logout";
import { theme } from "@/theme/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CustomDrawerComponent(props: any) {
    const { user } = useUser()
    const [openAlert, setOpenAlert] = useState(false)
    const colorScheme = useColorScheme();
    const [scheme, setScheme] = useState<any>(colorScheme)

    const triggerAlert = () => setOpenAlert(true)

    const openScanner = () => {
        router.push("/student/attendance/scanner")
    }

    const toggleTheme = async () => {
        const newScheme = scheme === 'dark' ? 'light' : 'dark';
        setScheme(newScheme);
        await AsyncStorage.setItem('colorScheme', JSON.stringify(newScheme)); //* Save the new scheme
        if (Platform.OS !== 'web') Appearance.setColorScheme(newScheme);
    };

    return (
        <View flex={1} justifyContent="space-between" >
            <YStack height="40%" justifyContent="flex-end" alignItems="flex-start" padding="$3" backgroundColor={theme.cyan10} >
                <Avatar elevate circular size="$10">
                    <Avatar.Image src={user?.imageUrl} />
                </Avatar>
                <TouchableOpacity onPress={() => router.push("/student/account")}>
                    <XStack alignItems="center" gap="$2" >
                        <Heading size={"$7"} color="white">{user?.fullName}</Heading>
                        <Edit3 size={"$1"} color={"white"} />
                    </XStack>
                </TouchableOpacity>
                <SizableText size="$3" color="$white1" textTransform="capitalize">College of Optometry</SizableText>
                <SizableText size="$3" color="$white1" textTransform="capitalize">{user?.publicMetadata.role}</SizableText>
                <SizableText size="$2" color="$gray7">{user?.primaryEmailAddress?.emailAddress}</SizableText>
                <XStack w={"100%"} alignItems="center" justifyContent="space-between" mt="$4">
                    <SizableText color={"white"}>Dark Mode</SizableText>
                    <Switch size={"$3"} defaultChecked={scheme === 'light'} checked={scheme === 'dark'} onCheckedChange={toggleTheme}>
                        <Switch.Thumb animation={"quicker"} backgroundColor={theme.cyan10} />
                    </Switch>
                </XStack>
            </YStack>
            <DrawerContentScrollView {...props} style={{ flex: 1 }}>
                <DrawerItemList {...props} />
                <DrawerItem label="Time Out" onPress={openScanner} icon={() => <TimerOff color='$gray9' />} />
                <DrawerItem label="Logout" onPress={triggerAlert} icon={() => <LogOut color='$red9' />} />
                <Logout openAlert={openAlert} setOpenAlert={setOpenAlert} />
            </DrawerContentScrollView>
        </View>
    )
}
