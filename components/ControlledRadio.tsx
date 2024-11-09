import React from 'react';
import { RadioGroup, Label, XStack, SizableText } from 'tamagui';
import { useController, Control } from 'react-hook-form';

interface ControlledRadioGroupProps {
    name: string;                        // Name of the form field
    control: Control<any>;               // Form control from react-hook-form
    label?: string;                      // Label for the radio group
    defaultValue?: string | null;        // Default value for the radio group
    options: { label: string; value: string }[]; // Options for the radio group
    onChange?: (value: string) => void;  // Optional callback for when the value changes
    required?: boolean;                  // Whether the field is required
}

const ControlledRadioGroup: React.FC<ControlledRadioGroupProps> = ({
    name,
    control,
    label,
    defaultValue = null, // Set defaultValue to null for validation to work
    options,
    onChange,
    required,
}) => {
    // Use useController to get access to the field's value, onChange, etc.
    const {
        field: { value, onChange: fieldOnChange, onBlur },
        fieldState: { error },
    } = useController({
        name,
        control,
        defaultValue,
        rules: {
            required: required ? 'Required' : false, // Validation rule
        },
    });

    return (
        <>
            {label && (
                <SizableText mt="$4" mb="$2">
                    {label}{required && <SizableText color={"red"}>*</SizableText>}
                </SizableText>
            )}

            <RadioGroup
                value={value}
                onValueChange={(newValue) => {
                    fieldOnChange(newValue); // Update form state
                    if (onChange) {
                        onChange(newValue); // Optional external onChange
                    }
                }}
                onBlur={onBlur} // Call onBlur to mark field as touched
            >
                <XStack gap="$2" alignItems='center'>
                    {options.map((option) => (
                        <XStack key={option.value} flex={1} alignItems='center' gap="$3">
                            <RadioGroup.Item value={option.value} id={`${name}-${option.value}`}>
                                <RadioGroup.Indicator />
                            </RadioGroup.Item>
                            <Label flex={1} htmlFor={`${name}-${option.value}`} textTransform='capitalize'>
                                {option.label}
                            </Label>
                        </XStack>
                    ))}
                </XStack>
            </RadioGroup>

            {error && (
                <SizableText size={"$2"} color="red">
                    {error.message}
                </SizableText>
            )}
        </>
    );
};

export default ControlledRadioGroup;
