import { Stack } from "expo-router"

const PublicLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false,statusBarTranslucent: true, statusBarAnimation:"fade", statusBarStyle:"dark", contentStyle:{backgroundColor:"#fff"}}} >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  )
}

export default PublicLayout