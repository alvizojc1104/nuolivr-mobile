import React from 'react';
import { Button, ButtonProps, Spinner } from 'tamagui';
import { theme } from '@/theme/theme';

interface CustomButtonProps extends ButtonProps {
    loading?: boolean;
    onPress: () => void;
    buttonText?: string;
    icon?: any;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    loading = false,
    onPress,
    buttonText = "Continue",
    icon,
    ...props
}) => {

    return (
        <Button
            disabled={loading}
            onPress={onPress}
            borderWidth={0}
            backgroundColor={theme.cyan10}
            color="white"
            pressStyle={{ backgroundColor: theme.cyan11 }}
            disabledStyle={{ opacity: 0.8 }}
            {...props}
        >
            {loading ? "Loading..." : buttonText}
        </Button>
    );
};

export default CustomButton;
