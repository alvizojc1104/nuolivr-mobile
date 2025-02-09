import { theme } from '@/theme/theme';
import { ChevronRight } from '@tamagui/lucide-icons';
import React from 'react'
import { TouchableNativeFeedback } from 'react-native'
import { SizableText, View, XStack } from 'tamagui'



const Modules = ({ name, iconText,  onPress }: { name: string, iconText: string, onPress: () => void }) => {



      return (
            <TouchableNativeFeedback
                  background={TouchableNativeFeedback.Ripple('#ccc', false)}
                  onPress={onPress}
            >
                  <View padding="$2" flexDirection='row' justifyContent='space-between' alignItems='center' borderBottomWidth={.5} borderBottomColor={"#ccc"}>
                        <XStack alignItems='center' gap="$4">
                              <View backgroundColor={theme.cyan5} padding="$3" borderRadius={"$1"} width={"$5"} h="$5" justifyContent='center' alignItems='center'>
                                    <SizableText color={theme.cyan10}>{iconText}</SizableText>
                              </View>
                              <SizableText>{name}</SizableText>
                        </XStack>
                        <ChevronRight size={20} />
                  </View>
            </TouchableNativeFeedback>
      )
}

export default Modules