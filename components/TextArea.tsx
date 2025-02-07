import React, { memo, useCallback, forwardRef, useMemo } from 'react';
import { HelperText, TextInput as PaperTextInput } from 'react-native-paper';
import { SizableText } from 'tamagui';
import { useController, Control } from 'react-hook-form';
import { KeyboardTypeOptions, StyleSheet, TextInput as RNTextInput } from 'react-native';
import { gray, theme } from '@/theme/theme';
import { MaskedTextInput } from 'react-native-mask-text';

// Separate constant styles and configurations
const INPUT_CONFIG = {
    borderRadius: 10,
    fontSize: 14,
    fontFamily: 'Inter',
    backgroundColor: 'white',
    marginTop: 16,
} as const;

interface TextInputProps {
    name: string;
    control: Control<any>;
    placeholder?: string;
    required?: boolean;
    label?: string;
    type?: KeyboardTypeOptions;
    rules?: object;
    onSubmitEditing?: () => void;
    masked?: boolean;
    mask?: string;
    suffix?: string;
    customStyles?: {
        input?: object;
        outline?: object;
        content?: object;
    };
}

const TextArea = forwardRef<typeof PaperTextInput, TextInputProps>(({
    name,
    control,
    placeholder,
    required,
    label,
    type = 'default',
    rules = {},
    onSubmitEditing,
    masked,
    mask,
    customStyles = {},
    ...props
}, ref) => {
    const {
        field,
        fieldState: { error },
    } = useController({
        control,
        name,
        rules: {
            required: required ? 'Required' : false,
            ...rules,
        },
    });

    // Memoize label component
    const labelComponent = useMemo(() => (
        <SizableText>
            {label}
            {required && <SizableText color="red">*</SizableText>}
        </SizableText>
    ), [label, required]);

    // Memoize error icon
    const errorIcon = useMemo(() => (
        error && <PaperTextInput.Icon icon="alert-circle-outline" color="red" />
    ), [error]);

    // Memoize styles
    const outlineStyle = useMemo(() => ({
        borderRadius: INPUT_CONFIG.borderRadius,
        ...customStyles.outline,
    }), [customStyles.outline]);

    const contentStyle = useMemo(() => ({
        fontFamily: INPUT_CONFIG.fontFamily,
        fontSize: INPUT_CONFIG.fontSize,
        ...customStyles.content,
    }), [customStyles.content]);

    const inputStyle = useMemo(() => ([
        styles.input,
        customStyles.input,
    ]), [customStyles.input]);

    // Callbacks
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
            label={labelComponent}
            placeholder={placeholder}
            placeholderTextColor={gray.gray10}
            value={field.value}
            onChangeText={handleChangeText}
            onBlur={handleBlur}
            onSubmitEditing={onSubmitEditing}
            blurOnSubmit={!onSubmitEditing}
            outlineStyle={outlineStyle}
            outlineColor={error ? "red" : gray.gray5}
            contentStyle={contentStyle}
            activeOutlineColor={error ? "red" : theme.cyan10}
            style={inputStyle}
            right={errorIcon}
            multiline
            numberOfLines={5}
        />
    );
});

const styles = StyleSheet.create({
    input: {
        backgroundColor: INPUT_CONFIG.backgroundColor,
        marginTop: INPUT_CONFIG.marginTop,
        flex: 1,
        fontFamily: INPUT_CONFIG.fontFamily,
    },
});

TextArea.displayName = 'TextArea';

export default memo(TextArea);
