import { Check, ChevronRight } from '@tamagui/lucide-icons';
import React from 'react';
import { useController } from 'react-hook-form';
import { SelectProps } from 'tamagui';
import { Adapt, Select, Sheet, SizableText } from 'tamagui';

interface ControlledSelectProps extends SelectProps {
    name: string; // Name for the controlled field
    control: any; // Control from React Hook Form
    options: { value: string; label: string }[]; // Options for the select
    placeholder?: string; // Optional placeholder
    required?: boolean
    label?: string;
}

const ControlledSelect: React.FC<ControlledSelectProps> = ({
    name,
    control,
    options,
    placeholder,
    required,
    label,
    ...props
}) => {
    const { field, fieldState: { error } } = useController({
        control, name, rules: {
            required: required ? `Required` : false
        }
    });

    return (
        <>
            {label &&
                <SizableText mt="$4" mb="$2">
                    {label}
                    {required && <SizableText style={{ color: 'red' }}>*</SizableText>}
                </SizableText>
            }
            <Select
                value={field.value}
                onValueChange={field.onChange}
            >
                <Select.Trigger iconAfter={ChevronRight} backgroundColor={"$background0"} {...props}>
                    <Select.Value placeholder={placeholder} />
                </Select.Trigger>
                <Adapt when={"sm"} platform='touch'>
                    <Sheet
                        modal
                        dismissOnOverlayPress
                        snapPointsMode='fit'
                        animation={"quickest"}>
                        <Sheet.Handle width="$3" height={5} alignSelf="center" />
                        <Sheet.Frame borderTopRightRadius={"$5"} borderTopLeftRadius={"$5"}>
                            <Adapt.Contents />
                        </Sheet.Frame>
                        <Sheet.Overlay
                            animation="quicker"
                            enterStyle={{ opacity: 0 }}
                            exitStyle={{ opacity: 0 }}
                        />
                    </Sheet>
                </Adapt>
                <Select.Content zIndex={200000}>
                    <Select.Viewport>
                        <Select.Group>
                            <Select.Label>{label}</Select.Label>
                            {options.map((option, i) => (
                                <Select.Item key={option.value} value={option.value} index={i}>
                                    <Select.ItemText>{option.label}</Select.ItemText>
                                    <Select.ItemIndicator>
                                        <Check size={16} color={"$green10"} />
                                    </Select.ItemIndicator>
                                </Select.Item>
                            ))}
                        </Select.Group>
                    </Select.Viewport>
                </Select.Content>
            </Select>
            {error && <SizableText size={"$1"} style={{ color: 'red' }} ml="$2">{error.message}</SizableText>}
        </>
    );
};

export default ControlledSelect;
