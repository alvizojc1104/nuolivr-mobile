import { theme } from "@/theme/theme";
import { Settings } from "@tamagui/lucide-icons";
import { router, Stack } from "expo-router";
import { SizableText, } from "tamagui";

const _layout = () => {

    const goToSettings = () => {
        router.push("/student/settings")
    }

    return (
        <Stack screenOptions={{ headerTintColor: "white", headerStyle: { backgroundColor: theme.cyan10 }, contentStyle: { backgroundColor: "white" } }}>
            <Stack.Screen name="index" options={{ headerShown: false, title: "Home", statusBarTranslucent: true, statusBarStyle: "dark" }} />
            <Stack.Screen name="account" options={{ headerTitle: () => (<SizableText color={"white"}>My Account</SizableText>), headerRight: () => <Settings color={"white"} onPress={goToSettings} />, headerTitleAlign: "center", headerShadowVisible: false, statusBarTranslucent: true, statusBarStyle: "light", }} />
            <Stack.Screen name="notifications" options={{ headerTitle: () => (<SizableText color={"white"}>Notifications</SizableText>), headerTitleAlign: "center", headerShadowVisible: false, statusBarTranslucent: true, statusBarStyle: "light", }} />
            <Stack.Screen name="(pcr)" options={{ headerShown: false }} />
            <Stack.Screen name="preliminary-examination" options={{ headerShown: false }} />
            <Stack.Screen name="patients" options={{ headerTitle: () => <SizableText color={"white"}>My Patients</SizableText>, headerTitleAlign: "center", statusBarTranslucent: true, statusBarStyle: "light", }} />
            <Stack.Screen name="module" options={{ headerShown: false, statusBarTranslucent: true, statusBarStyle: "light", }} />
            <Stack.Screen name="settings" options={{ headerTitle: () => <SizableText color={"white"}>Settings</SizableText>, statusBarTranslucent: true, statusBarStyle: "light", }} />
            <Stack.Screen name="search-patient" options={{ headerShown: false, presentation: "modal", statusBarTranslucent: true, statusBarStyle: "light", }} />
            <Stack.Screen name="patient" options={{ headerShown: false, statusBarTranslucent: true, statusBarStyle: "light", }} />
        </Stack>
    )
}

export default _layout