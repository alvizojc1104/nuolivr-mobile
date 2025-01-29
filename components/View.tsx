import { View as TamaguiView, ViewProps } from 'tamagui';
import React from 'react';

interface CustomViewProps extends ViewProps {
    isRounded?: boolean;
    padded?: boolean
}

const View: React.FC<CustomViewProps> = ({ isRounded, padded, ...props }) => {
    return (
        <TamaguiView
            {...props}
            style={[
                isRounded && { borderRadius: 10 }, // Example: round corners if isRounded is true
                props.style, // Preserve any additional styles passed in
            ]}
            padding={padded ? "$5" : null}
        />
    );
};

export default View;
