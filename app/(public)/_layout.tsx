import { Stack } from "expo-router"
import { useColorScheme } from "react-native";
import { Heading } from "tamagui";

const PublicLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false,statusBarTranslucent: true, statusBarAnimation:"fade"}} >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" />
    </Stack>
  )
}

export default PublicLayout