import React, { useState } from 'react'
import { Button, SizableText, View, XStack } from 'tamagui'
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Plus } from '@tamagui/lucide-icons';

const VisualAcuity = () => {
  const [visualAcuities, setVisualAcuities] = useState<Array<String> | undefined>(undefined)

  return (
    <>
      <Stack.Screen options={{
        headerRight: () => (
          <Button size="$3" themeInverse marginRight="$3" circular icon={<Plus fontWeight={900} />} onPress={() => router.push("/(student)/acuity")} />
        )
      }} />
      {visualAcuities ? (
        <View>
          <SizableText>VisualAcuity</SizableText>
        </View>
      ) :
        (
          <View flex={1} height="100%" justifyContent='center' alignItems='center'>
            <SizableText size="$1">You have no visual acuities yet.</SizableText>
            <XStack width="100%" justifyContent='center' alignItems='center' marginTop="$1">
              <SizableText size="$1" >{`Click `}</SizableText>
              <Plus size={12} />
              <SizableText size="$1">{` to add a new visual acuity session.`}</SizableText>
            </XStack>
          </View>
        )}
    </>
  )
}

export default VisualAcuity