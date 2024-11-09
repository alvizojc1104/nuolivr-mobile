import { darkTheme, theme } from "@/theme/theme";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { Input, SizableText, View } from "tamagui";

const _layout = () => {
    const colorScheme = useColorScheme()
    const bg = colorScheme === "dark" ? darkTheme.cyan1 : "#FFF"

    return (
        <Stack screenOptions={{ contentStyle: { backgroundColor: bg }, headerTintColor: "white", headerStyle: { backgroundColor: theme.cyan10 } }}>
            <Stack.Screen name="index" options={{ headerShown: false, title: "Home", contentStyle: { backgroundColor: bg }, statusBarTranslucent: true, statusBarStyle: colorScheme === "dark" ? "light" : "dark", }} />
            <Stack.Screen name="account" options={{ headerTitle: () => (<SizableText color={"white"}>Account</SizableText>), headerTitleAlign: "center", headerShadowVisible: false, statusBarTranslucent: true, statusBarStyle: "light", }} />
            <Stack.Screen name="notifications" options={{ headerTitle: () => (<SizableText color={"white"}>Notifications</SizableText>), headerTitleAlign: "center", headerShadowVisible: false, statusBarTranslucent: true, statusBarStyle: "light", }} />
            <Stack.Screen name="(pcr)" options={{ headerShown: false }} />
            <Stack.Screen name="preliminary-examination" options={{ headerShown: false }} />
            <Stack.Screen name="patients" options={{ headerTitle: () => <SizableText color={"white"}>My Patients</SizableText>, headerTitleAlign: "center", statusBarTranslucent: true, statusBarStyle: "light", }} />
            <Stack.Screen name="search-patient" options={{ headerShown: false, presentation: "modal", statusBarTranslucent: true, statusBarStyle: "light", }} />
            <Stack.Screen name="patient" options={{ headerShown: false, statusBarTranslucent: true, statusBarStyle: "light", }} />
        </Stack>
    )
}

export default _layout