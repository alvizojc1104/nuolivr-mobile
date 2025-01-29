import React from "react";
import { Heading, HeadingProps, SizableText } from "tamagui";

interface TitleProps extends HeadingProps {
    text: string;
}

const Title: React.FC<TitleProps> = ({ text, ...props }) => {
    return (
        <SizableText size={"$5"} fontWeight={"bold"} textTransform="capitalize" {...props}>
            {text}
        </SizableText>
    )
}

export default Title