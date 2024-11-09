import { theme } from "@/theme/theme"
import { Stack } from "expo-router"
import { SizableText } from "tamagui"

const _layout = () => {
    return (
        <Stack screenOptions={{ headerStyle: { backgroundColor: theme.cyan10 }, statusBarTranslucent: true, statusBarStyle: "light", headerTintColor: "white" }}>
            <Stack.Screen name="index" options={{  headerTitle: () => <SizableText color={"white"}>Preliminary Examination</SizableText> }} />
            <Stack.Screen name="visual-acuity" options={{ headerTitle: () => <SizableText color={"white"}>Visual Acuity</SizableText> }} />
            <Stack.Screen name="phorometry" options={{ headerTitle: () => <SizableText color={"white"}>Phorometry</SizableText> }} />
            <Stack.Screen name="external-eye-examination" options={{ headerTitle: () => <SizableText color={"white"}>External Eye Examination</SizableText> }} />
            <Stack.Screen name="od" options={{ headerTitleAlign: "center", headerTitle: () => <SizableText color={"white"}>Ocular Motility OD</SizableText>, presentation: "modal" }} />
            <Stack.Screen name="os" options={{ headerTitleAlign: "center", headerTitle: () => <SizableText color={"white"}>Ocular Motility OS</SizableText>, presentation: "modal" }} />
        </Stack>
    )
}

export default _layout