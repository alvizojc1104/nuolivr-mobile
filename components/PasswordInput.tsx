import React, { memo, useCallback, useMemo, useState, forwardRef } from 'react';
import { HelperText, TextInput as PaperTextInput } from 'react-native-paper';
import { SizableText } from 'tamagui';
import { useController, Control } from 'react-hook-form';
import { StyleSheet, TextInput as RNTextInput } from 'react-native';
import { gray, theme } from '@/theme/theme';

interface PasswordInputProps {
    name: string;
    control: Control<any>;
    label?: string;
    required?: boolean;
    rules?: object;
    customStyles?: {
        input?: object;
        outline?: object;
        content?: object;
    };
}

const PasswordInput = forwardRef<typeof PaperTextInput, PasswordInputProps>(({
    name,
    control,
    label = "Password",
    required = true,
    rules = {},
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
            required: required ? "Password is required" : false,
            pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                message: "Password must include at least 8 characters, an uppercase letter, a lowercase letter, a number, and a special character.",
            },
            ...rules,
        },
    });

    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev);
    };

    // Real-time validation status
    const validationStatus = useMemo(() => ({
        hasLowercase: /[a-z]/.test(field.value || ""),
        hasUppercase: /[A-Z]/.test(field.value || ""),
        hasDigit: /\d/.test(field.value || ""),
        hasSpecialChar: /[@$!%*?&]/.test(field.value || ""),
        hasMinLength: (field.value || "").length >= 8,
    }), [field.value]);

    const handleChangeText = useCallback((value: string) => {
        field.onChange(value);
    }, [field.value]);

    const handleBlur = useCallback(() => {
        field.onBlur();
    }, [field]);

    return (
        <>
            <PaperTextInput
                ref={ref as React.Ref<RNTextInput>}
                {...props}
                mode="outlined"
                label={<SizableText>{label}</SizableText>}
                value={field.value}
                onChangeText={handleChangeText}
                onBlur={handleBlur}
                secureTextEntry={!passwordVisible}
                right={
                    <PaperTextInput.Icon
                        icon={"eye"}
                    />
                }
                activeOutlineColor={theme.cyan10}
                outlineStyle={styles.outlineStyle}
                contentStyle={styles.contentStyle}
                style={styles.input}
            />
            <HelperText type='error' style={{ color: validationStatus.hasLowercase ? "green" : "" }}>Must have one lowercase letter.</HelperText>
            <HelperText type='error' style={{ color: validationStatus.hasUppercase ? "green" : "" }}>Must have one uppercase letter.</HelperText>
            <HelperText type='error' style={{ color: validationStatus.hasDigit ? "green" : "" }}>Must have one digit.</HelperText>
            <HelperText type='error' style={{ color: validationStatus.hasSpecialChar ? "green" : "" }}>Must have one special character.</HelperText>
        </>
    );
});

const styles = StyleSheet.create({
    input: {
        fontSize: 14,
        fontFamily: "Inter",
        backgroundColor: "transparent",
        marginTop: 16,
        width: "100%",
    },
    outlineStyle: {
        borderRadius: 10,
        borderColor: gray.gray5,
    },
    contentStyle: {
        fontSize: 14,
        fontFamily: "Inter",
    },
    helperContainer: {
        marginTop: 8,
    },
    helperText: {
        fontSize: 12,
    },
    valid: {
        color: "green",
    },
    invalid: {
        color: "gray",
    },
});

PasswordInput.displayName = "PasswordInput";

export default memo(PasswordInput);
