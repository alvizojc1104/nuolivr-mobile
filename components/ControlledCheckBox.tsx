import React from 'react';
import { Checkbox, Label, XStack, SizableText, Input } from 'tamagui';
import { Controller, useController, Control, FieldValues } from 'react-hook-form';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Check } from '@tamagui/lucide-icons';
import { theme } from '@/theme/theme';
import TextInput from './TextInput';

// Reusable Controlled Checkbox
const ControlledCheckbox = ({ label, value, isChecked, onChange, error }: FieldValues) => (
    <XStack alignItems='center' gap="$2">
        <Checkbox
            checked={isChecked}
            onCheckedChange={onChange}
            id={value}
            backgroundColor={isChecked ? theme.cyan10 : undefined}
        >
            <Checkbox.Indicator>
                <Check color={"white"} />
            </Checkbox.Indicator>
        </Checkbox>
        <Label flex={1} htmlFor={value}>{label}</Label>
    </XStack>
);

// Reusable Checkbox Group Component
const ControlledCheckboxGroup = ({ name, control, options, label, onOtherChange }: any) => {
    const { field, fieldState: { error } } = useController({
        name,
        control,
        defaultValue: [],
        rules: { required: "Required" },
    });

    const handleChange = (optionValue: any) => {
        const newValue = field.value.includes(optionValue)
            ? field.value.filter((val: any) => val !== optionValue)
            : [...field.value, optionValue];

        field.onChange(newValue);
    };

    return (
        <>
            <SizableText color={"$gray10"}>{label}</SizableText>
            {options.map((option: { value: React.Key | null | undefined; label: any; }) => (
                <ControlledCheckbox
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    isChecked={field.value.includes(option.value)}
                    error={error}
                    onChange={() => {
                        handleChange(option.value);
                        if (option.value === 'Other' && onOtherChange) {
                            onOtherChange(); // Callback to handle other checkbox
                        }
                    }}
                />
            ))}

            {/* Conditionally Render Input for "Other" if selected */}
            {field.value.includes('Other') && (
                <Animated.View entering={FadeIn}>
                    <TextInput name='familyOcularAndHealthHistory.other' label='Specify' placeholder='Please specify:' control={control}  required/>
                </Animated.View>
            )}
            {error && <SizableText size={"$2"} color={"red"}>{error.message}</SizableText>}
        </>
    );
};

export default ControlledCheckboxGroup;
