import { Stack } from "expo-router"
import { useColorScheme } from "react-native";
import { Heading } from "tamagui";

const PublicLayout = () => {
  const colorScheme = useColorScheme();

  const sceneBackgroundColor =
    colorScheme === "dark"
      ? "hsl(212, 35.0%, 9.2%)" // Dark mode background color
      : 'hsla(0, 0%, 100%, 0)'; // Light mode background color

  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: sceneBackgroundColor }, headerShown:false }} >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup"  />
    </Stack>
  )
}

export default PublicLayout