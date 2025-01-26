import { Stack } from "expo-router"
import { useColorScheme } from "react-native";
import { Heading } from "tamagui";

const PublicLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false,statusBarTranslucent: true, statusBarAnimation:"fade", statusBarStyle:"dark"}} >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  )
}

export default PublicLayout