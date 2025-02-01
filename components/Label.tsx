import { theme } from '@/theme/theme';
import React, { useMemo } from 'react';
import { SizableText, SizableTextProps } from 'tamagui';

interface LabelProps extends SizableTextProps {
    text: string;
}

const Label: React.FC<LabelProps> = ({ text, ...props }) => {
    return useMemo(() => (
        <SizableText
            flex={1}
            backgroundColor={"$gray5"}
            padding="$1"
            borderRadius="$4"
            mt="$5"
            letterSpacing={5}
            textAlign='center'
            textTransform="uppercase"
            {...props}
        >
            {text}
        </SizableText>
    ), [text, props]);
};

export default Label;
