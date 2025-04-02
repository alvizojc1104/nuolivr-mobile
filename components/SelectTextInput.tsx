import React, { forwardRef } from 'react';
import { TextInput as RNTextInput } from "react-native";
import { HelperText, TextInput as PaperTextInput } from 'react-native-paper';
import { SelectProps, SizableText, } from 'tamagui';
import { useController, Control } from 'react-hook-form';
import ControlledSelect from './ControlledSelect'; // Import your ControlledSelect component
import { gray } from '@/theme/theme';

interface SelectTextInputProps extends SelectProps {
    onCustomValueChange?: (value: string) => void;
    disabled?: boolean;
    name: string;
    control: Control<any>;
    options: { value: string; label: string }[];
    placeholder?: string;
    required?: boolean;
    onSubmitEditing?: () => void;
    label?: string;
}

const SelectTextInput = forwardRef<typeof PaperTextInput, SelectTextInputProps>(({
    disabled = false,
    name,
    control,
    options,
    placeholder,
    required,
    label,
    onSubmitEditing
}, ref) => {
    const { field, fieldState: { error } } = useController({
        control,
        name,
        rules: { required: required ? `Required` : false },
    });

    return (
        <>
            <PaperTextInput
                mode="outlined"
                ref={ref as React.Ref<RNTextInput>}
                label={<SizableText>{label}</SizableText>}
                value={field.value}
                onSubmitEditing={onSubmitEditing}
                render={(props) => (
                    <ControlledSelect
                        disabled={!disabled}
                        name={name}
                        control={control}
                        options={options}
                        placeholder={placeholder}
                        required={required}
                        onValueChange={field.onChange}
                        {...props}
                    />
                )}
                outlineColor={gray.gray5}
                outlineStyle={{
                    borderRadius: 10
                }}
                contentStyle={{
                    width: '100%',
                }}
                activeOutlineColor={gray.gray5}
                style={{ backgroundColor: 'white', width: "100%", marginTop: 16 }}
            />
            {error && (
                <HelperText type="error">
                    {error.message}
                </HelperText>
            )}
        </>
    );
});

export default SelectTextInput;
