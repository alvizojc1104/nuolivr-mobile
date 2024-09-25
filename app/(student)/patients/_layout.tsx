import { Stack } from "expo-router"
import { SizableText } from "tamagui"

const Layout = () => {
  return (
   <Stack>
    <Stack.Screen name="index" options={{headerTitle: ()=><SizableText>My Patients</SizableText>, headerTitleAlign:'center'}}/>
    <Stack.Screen name="[patient_id]" />
   </Stack>
  )
}

export default Layout