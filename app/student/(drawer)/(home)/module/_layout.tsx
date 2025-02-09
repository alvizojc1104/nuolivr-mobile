import React from 'react'
import { Stack } from 'expo-router'
import { theme } from '@/theme/theme'
import { SizableText, View, XStack } from 'tamagui'

const Layout = () => {
      return (
            <Stack screenOptions={{ statusBarTranslucent: true, headerShown: true, statusBarColor: theme.cyan10, headerStyle: { backgroundColor: theme.cyan10 }, headerTintColor: "white" }}>
                  <Stack.Screen name='index' options={{ headerTitle: () => <SizableText color={"white"}>My Modules</SizableText>, headerTitleAlign: "center" }} />
                  <Stack.Screen name='[moduleId]' options={({ route }) => ({
                        title: route?.params?.moduleName || "Module",
                        headerTintColor:"white",
                        headerTitle: () => (
                              <XStack alignItems='center' gap="$3" >
                                    <View backgroundColor={theme.cyan5} padding="$2"  borderRadius={"$1"} justifyContent='center' alignItems='center'>
                                          <SizableText color={theme.cyan10}>{route?.params?.iconText}</SizableText>
                                    </View>
                                    <SizableText color={"white"}>{route?.params?.moduleName || "Module"}</SizableText>
                              </XStack>
                        )
                  })} />
            </Stack>
      )
}

export default Layout