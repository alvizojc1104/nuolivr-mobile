import { useColorScheme } from 'react-native';
import { Spinner, YStack } from 'tamagui';

const StartPage = () => {
  const colorScheme = useColorScheme()
  return (
    <YStack flex={1} justifyContent='center' backgroundColor={colorScheme == "dark" ? "$blue2" : "$white0"}>
      <Spinner size='small' color='$blue10' />
    </YStack>
  );
};

export default StartPage;