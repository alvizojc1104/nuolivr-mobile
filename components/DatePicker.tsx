import React from 'react';
import { Button, SizableText } from 'tamagui'; // or any button component you're using
import DateTimePicker from 'react-native-modal-datetime-picker';

interface ControlledDatePickerProps {
    selectedDate: Date | null; // The currently selected date
    isVisible: boolean; // Control visibility
    onConfirm: (date: Date) => void; // Function to handle date selection
    onCancel: () => void; // Function to handle cancel action
    required?: boolean; // Indicate if the date is required
    errorMessage?: string; // Error message to display if date is required and not selected
}

const ControlledDatePicker: React.FC<ControlledDatePickerProps> = ({
    selectedDate,
    isVisible,
    onConfirm,
    onCancel,
    required,
    errorMessage,
}) => {
    return (
        <>
            <DateTimePicker
                date={selectedDate || new Date()} // Default to current date if null
                isVisible={isVisible}
                mode="date"
                onConfirm={onConfirm}
                onCancel={onCancel}
                maximumDate={new Date()} // Prevent future dates
                display="default"
            />
            {required && !selectedDate && (
                <SizableText style={{ color: 'red' }}>{errorMessage || 'Date is required'}</SizableText>
            )}
            {/* Button to show the DatePicker */}
            <Button onPress={onCancel}>Show DatePicker</Button>
        </>
    );
};

export default ControlledDatePicker;
