import { Check, ChevronRight } from '@tamagui/lucide-icons';
import React from 'react';
import { useController } from 'react-hook-form';
import { SelectProps } from 'tamagui';
import { Adapt, Select, Sheet } from 'tamagui';

interface ControlledSelectProps extends SelectProps {
    disabled?: boolean;
    name: string; // Name for the controlled field
    control: any; // Control from React Hook Form
    options: { value: string; label: string }[]; // Options for the select
    placeholder?: string; // Optional placeholder
    required?: boolean
    label?: string;
}

const ControlledSelect: React.FC<ControlledSelectProps> = ({
    disabled = false,
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
        <Select
            value={field.value}
            onValueChange={field.onChange}
        >
            <Select.Trigger disabled={!disabled} unstyled zIndex={100} size={"$4.5"} width={"100%"} iconAfter={ChevronRight} backgroundColor={"$background0"} borderColor={error && "$red9"} {...props}>
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
    );
};

export default ControlledSelect;
