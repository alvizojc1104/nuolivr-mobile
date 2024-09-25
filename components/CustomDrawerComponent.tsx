import { useAuth, useUser } from "@clerk/clerk-expo";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { LogOut } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { Avatar, Fieldset, H5, Heading, ListItem, Paragraph, SizableText, View, YStack } from "tamagui";
import Logout from "./Logout";

export default function CustomDrawerComponent(props: any) {
    const { signOut } = useAuth()
    const { user } = useUser()
    const [openAlert, setOpenAlert] = useState(false)

    const triggerAlert = () => setOpenAlert(true)
    return (
        <View flex={1} justifyContent="space-between" >
            <YStack height="40%" justifyContent="flex-end" alignItems="flex-start" padding="$3" backgroundColor="$blue11" >
                <Avatar circular size="$10">
                    <Avatar.Image src={user?.imageUrl} />
                </Avatar>
                <Heading color="$white1" onPress={()=>router.push("/(student)/profile")}>{user?.fullName}</Heading>
                <SizableText size="$3" color="$white1" textTransform="capitalize">College of Optometry</SizableText>
                <SizableText size="$3" color="$white1" textTransform="capitalize">{user?.publicMetadata.role}</SizableText>
                <SizableText size="$2" color="$gray7">{user?.primaryEmailAddress?.emailAddress}</SizableText>
            </YStack>
            <DrawerContentScrollView {...props} style={{ flex: 1 }}>
                <DrawerItemList {...props} />
                <DrawerItem label="Logout" onPress={triggerAlert} icon={() => <LogOut color='$red9' />} />
            </DrawerContentScrollView>
            <View borderTopWidth={1} borderColor="$gray7">
                <Paragraph>Footer</Paragraph>
            </View>
            <Logout openAlert={openAlert} setOpenAlert={setOpenAlert}/>
        </View>
    )
}