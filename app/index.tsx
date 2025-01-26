import { theme } from '@/theme/theme';
import { useColorScheme } from 'react-native';
import { Spinner, YStack } from 'tamagui';

const StartPage = () => {
  const colorScheme = useColorScheme()

  return (
    <YStack flex={1} justifyContent='center' backgroundColor={colorScheme == "dark" ? theme.cyan1 : "white"}>
      <Spinner size='large' color={theme.cyan10} />
    </YStack>
  );
};

export default StartPage;