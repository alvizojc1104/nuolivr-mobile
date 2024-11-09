import React from 'react';
import { Button, ButtonProps, Spinner } from 'tamagui';
import { ChevronRight } from '@tamagui/lucide-icons';
import { theme } from '@/theme/theme';

interface CustomButtonProps extends ButtonProps {
    saving?: boolean;
    onPress: () => void;
    buttonText?: string;
    icon?: any;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    saving = false,
    onPress,
    buttonText = "Continue",
    icon,
    ...props
}) => {

    return (
        <Button
            disabled={saving}
            icon={saving ? <Spinner size="small" /> : null}
            iconAfter={!saving ? icon : null}
            onPress={onPress}
            borderWidth={0}
            backgroundColor={theme.cyan10}
            color="white"
            pressStyle={{ backgroundColor: theme.cyan11 }}
            disabledStyle={{ opacity: 0.8 }}
            {...props}
        >
            {saving ? "Loading..." : buttonText}
        </Button>
    );
};

export default CustomButton;
