import React, { useRef } from 'react';
import { View, TextInput } from 'react-native';
import { useForm, FieldValues } from 'react-hook-form';
import FocusableInput from '@/components/FocusableInput';

interface FormData {
    email: string;
    password: string;
}

const LoginForm: React.FC = () => {
    const { control } = useForm<FormData>();

    // Create refs for each input
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);

    return (
        <View>
            <FocusableInput
                ref={emailRef}
                name="email"
                control={control}
                label="Email"
                placeholder="Enter your email"
                keyboardType="email-address"
                rules={{
                    required: 'Email is required',
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                    }
                }}
                onSubmitEditing={() => passwordRef.current?.focus()}
            />

            <FocusableInput
                ref={passwordRef}
                name="password"
                control={control}
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
                rules={{
                    required: 'Password is required',
                    minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters'
                    }
                }}
                returnKeyType="done"
            />
        </View>
    );
};

export default LoginForm;