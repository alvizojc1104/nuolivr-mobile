import { ActivityIndicator } from "react-native"
import { theme } from "@/theme/theme"
import { View } from "tamagui"

const Loading = () => {
    return (
        <View flex={1} alignItems="center" justifyContent="center">
            <ActivityIndicator size={"large"} color={theme.cyan10} />
        </View>
    )
}

export default Loading