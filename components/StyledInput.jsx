import { Eye, EyeOff } from "@tamagui/lucide-icons";
import { useState } from "react";
import { Input, Circle, XStack, Theme } from "tamagui";

const StyledInput = ({ password, setPassword, placeholder, allValid, is }) => {
  const [isSecured, setIsSecured] = useState(true);

  return (
    <XStack
      alignItems="center"
      borderColor="$blue5"
      borderWidth={1}
      borderRadius="$5"
      margin="$1"
      backgroundColor="$blue2"
    >
      <Input
        size="$5"
        theme="blue_active"
        value={password}
        onChangeText={setPassword}
        placeholder={placeholder}
        placeholderTextColor="$gray9"
        flex={1}
        borderWidth={0}
        backgroundColor="$blue2"
        secureTextEntry={isSecured ? true : false}
      />
      <Circle
        chromeless
        size="$5"
        height="100%"
        onPress={() => setIsSecured(!isSecured)}
        marginLeft={-20}
      >
        {isSecured ? (
          <EyeOff size="$1" alignContent="center" />
        ) : (
          <Eye size="$1" />
        )}
      </Circle>
    </XStack>
  );
};

export default StyledInput;
