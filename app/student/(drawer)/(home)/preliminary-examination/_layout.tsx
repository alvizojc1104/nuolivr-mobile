import { theme } from "@/theme/theme"
import { Stack } from "expo-router"
import { Heading } from "tamagui"

const _layout = () => {
    return (
        <Stack screenOptions={{ headerStyle: { backgroundColor: theme.cyan10 }, statusBarTranslucent: true, statusBarStyle: "light", headerTintColor: "white" }}>
            <Stack.Screen name="index" options={{  headerTitle: () => <Heading fontSize={"$7"} color={"white"}>Preliminary Examination</Heading> }} />
            <Stack.Screen name="visual-acuity" options={{ headerTitle: () => <Heading fontSize={"$7"} color={"white"}>Visual Acuity</Heading> }} />
            <Stack.Screen name="phorometry" options={{ headerTitle: () => <Heading fontSize={"$7"} color={"white"}>Phorometry</Heading> }} />
            <Stack.Screen name="ophthalmoscopy" options={{ headerTitle: () => <Heading fontSize={"$7"} color={"white"}>Ophthalmoscopy</Heading> }} />
            <Stack.Screen name="external-eye-examination" options={{ headerTitle: () => <Heading fontSize={"$7"} color={"white"}>External Eye Examination</Heading> }} />
            <Stack.Screen name="od" options={{ headerTitleAlign: "center", headerTitle: () => <Heading fontSize={"$7"} color={"white"}>Ocular Motility OD</Heading>, presentation: "modal" }} />
            <Stack.Screen name="os" options={{ headerTitleAlign: "center", headerTitle: () => <Heading fontSize={"$7"} color={"white"}>Ocular Motility OS</Heading>, presentation: "modal" }} />
        </Stack>
    )
}

export default _layout