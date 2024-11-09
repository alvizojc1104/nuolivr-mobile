import React, { forwardRef } from 'react';
import { TextInput as PaperTextInput, TextInputProps as PaperTextInputProps } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useController, Control, FieldValues, RegisterOptions } from 'react-hook-form';
import { gray, theme } from '@/theme/theme';

interface ControlledTextInputProps extends Omit<PaperTextInputProps, 'onChangeText'> {
    name: string;
    control: Control<FieldValues>;
    rules?: RegisterOptions;
    placeholder?: string;
    label: string;
    onSubmitEditing?: () => void;
    returnKeyType?: PaperTextInputProps['returnKeyType'];
    blurOnSubmit?: boolean;
}

const ControlledTextInput = forwardRef(({
    name,
    control,
    rules = {},
    placeholder,
    label,
    onSubmitEditing,
    returnKeyType,
    blurOnSubmit = false,
    ...rest
}: ControlledTextInputProps, ref: any) => {
    const { field } = useController({
        control,
        defaultValue: '',
        name,
        rules
    });

    return (
        <PaperTextInput
            {...rest}
            ref={ref}
            label={label}
            mode="outlined"
            placeholder={placeholder}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            blurOnSubmit={blurOnSubmit}
            outlineStyle={{
                borderRadius: 12,
                borderColor: "black",
            }}
            activeOutlineColor={"black"}
            contentStyle={{
                fontFamily:"Inter"
            }}
            style={styles.input}
            
        />
    );
});

export default ControlledTextInput;

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#fff',
        fontFamily:"Inter",
        fontSize: 16
    },
});
