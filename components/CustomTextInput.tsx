import React, { memo, useCallback, forwardRef } from 'react';
import { Input, InputProps, SizableText, YStack } from 'tamagui';
import { useController, Control } from 'react-hook-form';
import { KeyboardTypeOptions } from 'react-native';

interface TextInputProps extends InputProps {
    name: string;
    control: Control<any>;
    placeholder?: string;
    required?: boolean;
    label?: string;
    type?: KeyboardTypeOptions;
    rules?: object; // Add support for custom rules
    onSubmitEditing?: () => void;
    returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
}

const CustomTextInput = forwardRef<typeof Input, TextInputProps>(({
    name,
    control,
    placeholder,
    required,
    label,
    type,
    rules = {},
    onSubmitEditing,
    returnKeyType = 'next',
    ...props
}, ref) => {
    const {
        field,
        fieldState: { error },
    } = useController({
        control,
        name,
        rules: {
            required: required ? `Required` : false,
            ...rules,
        },
    });

    const handleChangeText = useCallback((value: string) => {
        field.onChange(value);
    }, [field]);

    const handleBlur = useCallback(() => {
        field.onBlur();
    }, [field]);

    return (
        <YStack flex={1}>
            {label && (
                <SizableText mt="$4" mb="$2">
                    {label}
                    {required && <SizableText style={styles.requiredMark}>*</SizableText>}
                </SizableText>
            )}
            <Input
                ref={ref as React.Ref<any>}
                {...props}
                backgroundColor={"$gray3"}
                borderWidth={0}
                keyboardType={type || "default"}
                placeholder={placeholder}
                value={field.value}
                onChangeText={handleChangeText}
                onBlur={handleBlur}
                onSubmitEditing={onSubmitEditing}
                returnKeyType={returnKeyType}
                blurOnSubmit={onSubmitEditing ? false : true}
            />
            {error && (
                <SizableText
                    size="$1"
                    style={styles.errorText}
                    ml="$2"
                >
                    {error.message}
                </SizableText>
            )}
        </YStack>
    );
});


// Move styles outside the component to prevent recreation on each render
const styles = {
    requiredMark: {
        color: 'red',
    },
    errorText: {
        color: 'red',
    },
};

// Memoize the component to avoid unnecessary re-renders
export default memo(CustomTextInput);