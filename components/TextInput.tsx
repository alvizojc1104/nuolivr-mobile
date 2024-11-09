import React, { memo, useCallback, forwardRef } from 'react';
import { HelperText, TextInput as PaperTextInput } from 'react-native-paper';
import { SizableText, YStack } from 'tamagui';
import { useController, Control } from 'react-hook-form';
import { KeyboardTypeOptions, StyleSheet, TextInput as RNTextInput } from 'react-native';
import { gray, theme } from '@/theme/theme';

interface TextInputProps {
    name: string;
    control: Control<any>;
    placeholder?: string;
    required?: boolean;
    label?: string;
    type?: KeyboardTypeOptions;
    rules?: object;
    onSubmitEditing?: () => void;
    returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
}

const TextInput = forwardRef<typeof PaperTextInput, TextInputProps>(({
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
        <PaperTextInput
            ref={ref as React.Ref<RNTextInput>}
            {...props}
            mode="outlined"
            label={<SizableText>{label}{required && <SizableText color="red">*</SizableText>}</SizableText>}
            keyboardType={type || 'default'}
            value={field.value}
            onChangeText={handleChangeText}
            onBlur={handleBlur}
            onSubmitEditing={onSubmitEditing}
            returnKeyType={returnKeyType}
            blurOnSubmit={onSubmitEditing ? false : true}
            outlineStyle={{
                borderRadius: 14,
            }}
            outlineColor={error ? "red" : gray.gray5}
            contentStyle={{
                fontFamily: "Inter",
                fontSize: 14
            }}
            activeOutlineColor={error ? "red" : theme.cyan10}
            style={styles.input}
            right={error && <PaperTextInput.Icon icon={"alert-circle-outline"} color={"red"} />}
        />


    );
});

const styles = StyleSheet.create({
    input: {
        backgroundColor: 'white',
        marginTop: 18,
        flex: 1,
        fontFamily: "Inter",
    },
    requiredMark: {
        color: 'red',
    },
    errorText: {
        color: 'red',
    },
});

TextInput.displayName = 'TextInput';
export default memo(TextInput);
