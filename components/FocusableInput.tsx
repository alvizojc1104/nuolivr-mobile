import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import React, { forwardRef } from 'react';
import { Control, Controller, FieldValues, RegisterOptions } from 'react-hook-form';

interface FocusableInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
    name: string;
    control: Control<FieldValues | any>;
    rules?: RegisterOptions;
    label?: string;
    error?: {
        message?: string;
    };
}

const FocusableInput = forwardRef<TextInput, FocusableInputProps>(({
    name,
    control,
    rules = {},
    placeholder,
    label,
    secureTextEntry,
    keyboardType = 'default',
    autoCapitalize = 'none',
    error,
    onSubmitEditing,
    returnKeyType = 'next',
    ...props
}, ref) => {
    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, value, onBlur } }) => (
                <View style={styles.container}>
                    {label && <Text style={styles.label}>{label}</Text>}
                    <TextInput
                        ref={ref}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        style={[
                            styles.input,
                            error && styles.errorInput
                        ]}
                        secureTextEntry={secureTextEntry}
                        keyboardType={keyboardType}
                        autoCapitalize={autoCapitalize}
                        onSubmitEditing={onSubmitEditing}
                        returnKeyType={returnKeyType}
                        {...props}
                    />
                    {error && error.message && (
                        <Text style={styles.errorText}>{error.message}</Text>
                    )}
                </View>
            )}
        />
    );
});

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
        color: '#333',
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    errorInput: {
        borderColor: '#ff0000',
    },
    errorText: {
        color: '#ff0000',
        fontSize: 12,
        marginTop: 4,
    },
});

export default FocusableInput;