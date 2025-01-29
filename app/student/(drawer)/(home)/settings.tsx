import AsyncStorage from '@react-native-async-storage/async-storage'
import { Lock, LogOut, Moon } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Appearance, Platform, TouchableNativeFeedback, useColorScheme } from 'react-native'
import { ListItem, ScrollView, SizableText, Switch, View, Button } from 'tamagui'
import LoadingModal from '@/components/LoadingModal'
import { useAuth } from '@clerk/clerk-expo'

const Settings = () => {
    const { isLoaded } = useAuth()
    const colorScheme = useColorScheme();
    const [scheme, setScheme] = useState<any>(colorScheme)
    const [isLoading, _] = useState(false)

    if (!isLoaded) {
        return;
    }

    const toggleTheme = async () => {
        const newScheme = scheme === 'dark' ? 'light' : 'dark';
        setScheme(newScheme);
        await AsyncStorage.setItem('colorScheme', JSON.stringify(newScheme)); //* Save the new scheme
        if (Platform.OS !== 'web') Appearance.setColorScheme(newScheme);
    };


    return (
        <View flex={1}>
            <LoadingModal isVisible={isLoading} text='Logging out...' />
            <ScrollView flex={1} contentContainerStyle={{ paddingVertical: "$5" }}>
                <SizableText marginHorizontal="$5" fontWeight={"bold"}>Account</SizableText>
                <TouchableNativeFeedback>
                    <ListItem title="Change Password" icon={<Lock />} paddingVertical="$4" paddingHorizontal="$5" backgroundColor={"$background0"} />
                </TouchableNativeFeedback>
                <SizableText marginHorizontal="$5" mt="$4" fontWeight={"bold"}>App</SizableText>
                <TouchableNativeFeedback>
                    <ListItem
                        onPress={toggleTheme}
                        title="Dark Mode"
                        icon={<Moon />}
                        paddingVertical="$4"
                        paddingHorizontal="$5"
                        backgroundColor={"$background0"}
                        iconAfter={
                            <Switch size={"$2"} defaultChecked={scheme === 'light'} checked={scheme === 'dark'}>
                                <Switch.Thumb />
                            </Switch>
                        }
                    />
                </TouchableNativeFeedback>
            </ScrollView>
        </View>
    )
}

export default Settings