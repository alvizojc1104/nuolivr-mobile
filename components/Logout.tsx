import { useAuth } from "@clerk/clerk-expo"
import { router } from "expo-router"
import { memo, useState } from "react"
import { Alert } from "react-native"
import Spinner from "react-native-loading-spinner-overlay"
import { AlertDialog, Button, View, XStack, YStack } from "tamagui"

const Logout = ({ openAlert, setOpenAlert }: any) => {
  const { signOut } = useAuth()
  const [loading, setLoading] = useState(false)

  const onLogOut = () => {
    setLoading(true)
    try {
      signOut()
    } catch (error) {
      Alert.alert("Error", "An error occured while logging out.")
    }
  }

  return (
    <View flex={1}>
      {loading ? (
        <Spinner visible={loading} />
      ) :
        (
          <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
            <AlertDialog.Portal>
              <AlertDialog.Overlay
                key="overlay"
                animation="quick"
                opacity={0.5}
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
              />
              <AlertDialog.Content
                width="90%"
                elevate
                key="content"
                animation={[
                  'quick',
                  {
                    opacity: {
                      overshootClamping: true,
                    },
                  },
                ]}
                enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                x={0}
                scale={1}
                opacity={1}
                y={0}
              >
                <YStack space>
                  <AlertDialog.Title>Logout</AlertDialog.Title>
                  <AlertDialog.Description>
                    Are you sure you want to logout?
                  </AlertDialog.Description>

                  <XStack gap="$3" justifyContent="flex-end">
                    <AlertDialog.Cancel asChild>
                      <Button theme="active" chromeless >Cancel</Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                      <Button theme="red_active" onPress={onLogOut}>Confirm</Button>
                    </AlertDialog.Action>
                  </XStack>
                </YStack>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog>
        )}
    </View>
  )
}

export default memo(Logout)