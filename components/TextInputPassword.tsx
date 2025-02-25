import React, { memo, useCallback, forwardRef, useMemo } from 'react';
import { HelperText, TextInput as PaperTextInput } from 'react-native-paper';
import { SizableText, View } from 'tamagui';
import { useController, Control, UseFormGetValues } from 'react-hook-form';
import { KeyboardTypeOptions, StyleSheet, TextInput as RNTextInput } from 'react-native';
import { gray, theme } from '@/theme/theme';
import { MaskedTextInput } from 'react-native-mask-text';

interface TextInputProps {
    compare?: string | null;
    secure?: boolean;
    secureFunction?: () => void;
    getValues?: UseFormGetValues<any>;
    disabled?: boolean;
    left?: string | null;
    right?: string | null;
    name: string;
    control: Control<any>;
    placeholder?: string;
    required?: boolean;
    label?: string;
    type?: KeyboardTypeOptions;
    rules?: object;
    onSubmitEditing?: () => void;
    returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
    masked?: boolean;
    mask?: string;
    customStyles?: {
        input?: object;
        outline?: object;
        content?: object;
    };
}

const TextInput = memo(forwardRef<typeof PaperTextInput, TextInputProps>(({
    compare = null,
    secure = false,
    getValues,
    secureFunction,
    left = null,
    right = null,
    name,
    disabled = false,
    control,
    placeholder,
    required,
    label,
    type,
    rules = {},
    onSubmitEditing,
    masked,
    mask,
    returnKeyType = 'next',
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
            required: required ? "Required" : false,
            ...rules,
            validate: compare
                ? (value) =>
                    value === getValues?.(compare) || `Password do not match.`
                : undefined,
        },
    });


    // Callbacks
    const handleChangeText = useCallback((value: string) => {
        field.onChange(value);
    }, [field]);

    const handleBlur = useCallback(() => {
        field.onBlur();
    }, [field]);

    return (
        <View flex={1}>
            <PaperTextInput
                editable={!disabled}
                ref={ref as React.Ref<RNTextInput>}
                {...props}
                mode="outlined"
                label={<SizableText>{label}</SizableText>}
                placeholder={placeholder}
                placeholderTextColor={gray.gray10}
                keyboardType={type}
                value={field.value}
                onChangeText={handleChangeText}
                onBlur={handleBlur}
                onSubmitEditing={onSubmitEditing}
                returnKeyType={returnKeyType}
                blurOnSubmit={!onSubmitEditing}
                outlineStyle={styles.outlineStyle}
                contentStyle={styles.contentStyle}
                activeOutlineColor={theme.cyan10}
                style={styles.input}
                secureTextEntry={secure}
                left={left ? <PaperTextInput.Icon icon={left} /> : null}
                right={right ? <PaperTextInput.Icon icon={right || ""} onPress={secureFunction} /> : null}
                render={(props) =>
                    masked ? (
                        <MaskedTextInput
                            {...props}
                            mask={mask}
                            keyboardType='numeric'
                            onChangeText={handleChangeText}
                        />
                    ) : (
                        <RNTextInput
                            {...props}
                            onChangeText={handleChangeText}
                        />
                    )
                }
            />
            {error && <HelperText type="error" >{error.message}</HelperText>}
        </View>
    );
}));

const styles = StyleSheet.create({
    input: {
        fontSize: 14,
        fontFamily: 'Inter',
        backgroundColor: "transparent",
        marginTop: 8,
        width: "100%"
    },
    outlineStyle: {
        borderRadius: 10,
        borderColor: gray.gray5
    },
    contentStyle: {
        fontSize: 14,
        fontFamily: 'Inter',
    }

});

TextInput.displayName = 'TextInput';

export default TextInput
