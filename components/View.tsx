import { View as TamaguiView, ViewProps } from 'tamagui';
import React from 'react';
import { bg } from '@/theme/theme';

interface CustomViewProps extends ViewProps {
    isRounded?: boolean;
    padded?: boolean
}

const View: React.FC<CustomViewProps> = ({ isRounded, padded, ...props }) => {
    const backgroundColor = bg()
    return (
        <TamaguiView
            {...props}
            style={[
                isRounded && { borderRadius: 10 }, // Example: round corners if isRounded is true
                props.style, // Preserve any additional styles passed in
            ]}
            padding={padded ? "$5" : null}
            backgroundColor={backgroundColor}
        />
    );
};

export default View;
