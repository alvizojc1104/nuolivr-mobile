import React from 'react';
import { useController } from 'react-hook-form';
import { RadioGroup, XStack, SizableText, Label } from 'tamagui';

interface ControlledRadioGroupProps {
    name: string; // Name for the controlled field
    control: any; // Control from React Hook Form
    options: { value: string; label: string }[]; // Options for the radio group
    label: string; // Label for the radio group
    required?: boolean; // Optional required validation
}

const ControlledRadioGroup: React.FC<ControlledRadioGroupProps> = ({
    name,
    control,
    options,
    label,
    required,
}) => {
    const {
        field,
        fieldState: { error }
    } = useController({
        control,
        name,
        rules: {
            required: required ? 'Required' : false,
        },
    });

    return (
        <>
            <SizableText mt="$4">
                {label}
                {required && <SizableText style={{ color: 'red' }}>*</SizableText>}
            </SizableText>
            <RadioGroup value={field.value} onValueChange={field.onChange}>
                <XStack gap="$4">
                    {options.map((option, index) => (
                        <XStack key={index} alignItems="center" gap="$2">
                            <RadioGroup.Item value={option.value} id={`${name}-${option.value}-${index}`} />
                            <Label htmlFor={`${name}-${option.value}-${index}`}>
                                {option.label}
                            </Label>
                        </XStack>
                    ))}
                </XStack>
            </RadioGroup>
            {error && <SizableText size="$2" style={{ color: 'red' }} ml="$2">{error.message}</SizableText>}
        </>
    );
};

export default ControlledRadioGroup;
