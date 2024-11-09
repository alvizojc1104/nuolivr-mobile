import React from "react";
import { Heading, HeadingProps } from "tamagui";

interface TitleProps extends HeadingProps {
    text: string;
}

const Title: React.FC<TitleProps> = ({ text, ...props }) => {
    return (
        <Heading size={"$7"} textTransform="capitalize" {...props}>
            {text}
        </Heading>
    )
}

export default Title