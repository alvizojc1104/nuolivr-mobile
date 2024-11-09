import { SERVER } from '@/constants/link';
import { theme } from '@/theme/theme';
import axios from 'axios';
import { router, useGlobalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Alert, useColorScheme } from 'react-native';
import { Spinner, YStack } from 'tamagui';

const StartPage = () => {
  const colorScheme = useColorScheme()
  let { checkUserId }: any = useGlobalSearchParams()

  useEffect(() => {
    if (!checkUserId) {
      return
    } else {
      const getAccountData = async (checkUserId: string | undefined) => {
        try {
          const response = await axios.get(`${SERVER}/api/get-account/${checkUserId}`)
          console.log(response.data.role)

          if (response.data.role === "student") {
            router.replace("/student/(drawer)/(home)/")
          }
        } catch (error) {
          console.log(error)
        }
      }
      getAccountData(checkUserId)
    }

    return () => {
      checkUserId = ""
    }
  }, [])


  return (
    <YStack flex={1} justifyContent='center' backgroundColor={colorScheme == "dark" ? theme.cyan1 : "white"}>
      <Spinner size='large' color={theme.cyan10} />
    </YStack>
  );
};

export default StartPage;