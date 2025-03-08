import logo from "@/assets/images/logo.png";
import { H5, Image, SizableText } from "tamagui";
import { YStack } from "tamagui";
const StartPage = () => {

  return (
    <YStack flex={1} justifyContent='center' alignItems='center'>
      <Image src={logo} width={80} height={80} objectFit="contain" />
      <H5 marginTop="$2" fontWeight={900}>NU Vision</H5>
      <SizableText marginTop="$2">Loading ...</SizableText>
    </YStack>
  );
};

export default StartPage;