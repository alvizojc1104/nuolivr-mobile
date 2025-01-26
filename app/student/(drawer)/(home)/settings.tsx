import AsyncStorage from '@react-native-async-storage/async-storage'
import { Lock, LogOut, Moon } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Appearance, Platform, TouchableNativeFeedback, useColorScheme } from 'react-native'
import { ListItem, ScrollView, SizableText, Switch, View, Button } from 'tamagui'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Alert } from 'react-native'
import LoadingModal from '@/components/LoadingModal'
import { useAuth } from '@clerk/clerk-expo'

const Settings = () => {
    const { signOut, isLoaded } = useAuth()
    const colorScheme = useColorScheme();
    const [scheme, setScheme] = useState<any>(colorScheme)
    const [isLoading, setIsLoading] = useState(false)
    const scale = useSharedValue(1);

    if (!isLoaded) {
        return;
    }

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.95, { stiffness: 500 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { stiffness: 500 }); // Smooth bounce out
    };

    const toggleTheme = async () => {
        const newScheme = scheme === 'dark' ? 'light' : 'dark';
        setScheme(newScheme);
        await AsyncStorage.setItem('colorScheme', JSON.stringify(newScheme)); //* Save the new scheme
        if (Platform.OS !== 'web') Appearance.setColorScheme(newScheme);
    };

    const confirmLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                { text: "No", style: "cancel" },
                { text: "Yes", onPress: logout },
            ],
            { cancelable: true }
        )
    }

    const logout = async () => {
        try {
            setIsLoading(true);
            await signOut();
            console.log("Logout successful");
        } catch (error) {
            console.error("Error during logout:", error);
            Alert.alert("Error", "An error occurred while logging out. Please try again.");
        } finally {
            setIsLoading(false);
        }
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
            <Animated.View style={animatedStyle}>
                <Button
                    position="absolute"
                    bottom="$3"
                    width="90%"
                    alignSelf="center"
                    backgroundColor="$red10"
                    color="white"
                    icon={LogOut}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={confirmLogout}
                    pressStyle={{ backgroundColor: "$red11" }}
                    borderWidth={0}
                >
                    Logout
                </Button>
            </Animated.View>
        </View>
    )
}

export default Settings