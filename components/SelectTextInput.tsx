import React from 'react';
import { TextInput as PaperTextInput } from 'react-native-paper';
import { SizableText, YStack } from 'tamagui';
import { useController, Control } from 'react-hook-form';
import ControlledSelect from './ControlledSelect'; // Import your ControlledSelect component

interface SelectTextInputProps {
    name: string;
    control: Control<any>;
    options: { value: string; label: string }[];
    placeholder?: string;
    required?: boolean;
    label?: string;
}

const SelectTextInput: React.FC<SelectTextInputProps> = ({
    name,
    control,
    options,
    placeholder,
    required,
    label,
}) => {
    const { field, fieldState: { error } } = useController({
        control,
        name,
        rules: { required: required ? `Required` : false },
    });

    return (
        <YStack>
            <PaperTextInput
                mode="outlined"
                label={label}
                value={field.value}
                render={(props) => (
                    <ControlledSelect
                        name={name}
                        control={control}
                        options={options}
                        placeholder={placeholder}
                        required={required}
                        onValueChange={field.onChange}
                        {...props}
                    />
                )}
                outlineColor="gray"
                activeOutlineColor="cyan"
                style={{ backgroundColor: 'white' }}
                error={!!error}
            />
            {error && (
                <SizableText size="$1" style={{ color: 'red' }} ml="$2">
                    {error.message}
                </SizableText>
            )}
        </YStack>
    );
};

export default SelectTextInput;
