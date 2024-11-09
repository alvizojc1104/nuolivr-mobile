import { theme } from "@/theme/theme"
import { Button } from "tamagui"

const PlainButton = ({ onPress, text }: any) => {
  return (
    <Button onPress={onPress} borderWidth={0} backgroundColor={theme.cyan10} color={"white"} pressStyle={{ backgroundColor: theme.cyan11 }}>{text}</Button>

  )
}

export default PlainButton