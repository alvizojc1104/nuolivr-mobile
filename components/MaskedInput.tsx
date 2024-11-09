import React, { forwardRef } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { MaskedTextInput } from "react-native-mask-text";
import { SizableText, View } from 'tamagui';
import { useController, Control, FieldValues, RegisterOptions } from 'react-hook-form';
import { gray } from '@/theme/theme';

interface MaskedInputProps extends Omit<TextInputProps, 'onChangeText'> {
    name: string;
    control: Control<FieldValues>;
    rules?: RegisterOptions;
    placeholder?: string;
    mask: string;
    keyboardType?: TextInputProps['keyboardType'];
    onSubmitEditing?: () => void;
    returnKeyType?: TextInputProps['returnKeyType'];
    blurOnSubmit?: boolean;
    label?: string;
}

const MaskedInput = forwardRef<TextInput, MaskedInputProps>(({
    name,
    control,
    rules = {},
    placeholder,
    mask,
    keyboardType = 'default',
    onSubmitEditing,
    returnKeyType,
    blurOnSubmit,
    label,
    ...rest
}, ref) => {
    const { field } = useController({
        control,
        defaultValue: '',
        name,
        rules
    });

    return (
        <View>
            {label && <SizableText textTransform='capitalize' mb="$2">{label}</SizableText>}
            <MaskedTextInput
                {...rest}
                ref={ref}
                value={field.value}
                onChangeText={(masked: string, unmasked: string) => {
                    field.onChange(masked);
                    console.log('Masked:', masked);
                    console.log('Unmasked:', unmasked);
                }}
                mask={mask}
                placeholder={placeholder}
                style={styles.maskInput}
                keyboardType={keyboardType}
                onSubmitEditing={onSubmitEditing}
                returnKeyType={returnKeyType}
                blurOnSubmit={blurOnSubmit}
            />
        </View>
    );
});

export default MaskedInput;

const styles = StyleSheet.create({
    maskInput: {
        backgroundColor: gray.gray3,
        fontFamily: "Inter",
        paddingVertical: 9,
        paddingHorizontal: 16,
        borderRadius: 9,

    },
});