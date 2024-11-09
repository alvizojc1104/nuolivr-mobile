import { theme } from '@/theme/theme'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { router, Stack } from 'expo-router'
import React from 'react'
import { TouchableNativeFeedback, View as RNView } from 'react-native'
import { Input, View, XStack } from 'tamagui'

const SearchPatient = () => {

    const back = () => {
        router.back()
    }
    return (
        <>
            <View flex={1}>
                <XStack alignItems='center' backgroundColor={theme.cyan10} gap="$4" paddingTop="$8" paddingHorizontal="$5" paddingBottom="$3">
                    <RNView style={{ borderRadius: 25, overflow: 'hidden' }}>
                        <TouchableNativeFeedback style={{ padding: 10 }} onPress={back}>
                            <ArrowLeft color={"white"} size={22} />
                        </TouchableNativeFeedback>
                    </RNView>
                    <Input autoFocus color={"white"} unstyled placeholder='Search patient' placeholderTextColor={"white"} flex={1} />
                </XStack>
            </View>
        </>
    )
}

export default SearchPatient