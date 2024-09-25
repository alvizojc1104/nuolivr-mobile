import { Stack, useLocalSearchParams } from "expo-router"
import { SizableText, View } from "tamagui"

const PatientDetails = () => {
  const { patient_id, name, age, condition } = useLocalSearchParams()
  return (
    <View flex={1}>
      <Stack.Screen options={{ headerTitle: () => <SizableText>Patient: {name}</SizableText> }} />
      <SizableText>Patient Name: {name} </SizableText>
      <SizableText>Patient Age: {age} </SizableText>
      <SizableText>Patient Condition: {condition} </SizableText>
    </View>
  )
}

export default PatientDetails