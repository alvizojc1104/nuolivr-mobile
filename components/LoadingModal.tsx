import { theme } from '@/theme/theme';
import React from 'react';
import { Modal, ActivityIndicator } from 'react-native';
import { SizableText, View } from 'tamagui';

interface LoadingModalProps {
    visible: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ visible }) => {
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={() => {
                // Handle modal close if needed
            }}
        >
            <View alignItems='center' justifyContent='flex-start' flex={1} flexDirection='row'>
                <ActivityIndicator size={"large"} color={theme.cyan10} />
                <SizableText>Loading...</SizableText>
            </View>
        </Modal>
    );
};

export default LoadingModal;