import { User } from '@tamagui/lucide-icons'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { useColorScheme, } from 'react-native'
import { Avatar, ListItem, SizableText, Square, View, YGroup, } from "tamagui"

const Notifications = () => {

    const colorScheme = useColorScheme()
    const bg = colorScheme === "dark" ? "#000" : "#FFF"


    return (
        <View flex={1} borderTopWidth={1} borderColor={"$gray5"}>
            <Square alignItems='flex-start' backgroundColor={"$gray1"} padding="$2">
                <SizableText fontWeight={"light"} ml="$2">RECENTLY</SizableText>
            </Square>
            <YGroup mt="$3">
                <YGroup.Item>
                    <ListItem
                        backgroundColor={bg}
                        icon={
                            <Avatar size={"$3"} circular backgroundColor={"$gray5"}>
                                <User />
                            </Avatar>
                        }
                        title={<SizableText>Mike Alvizo</SizableText>}
                        subTitle={"Test Notification"}
                        iconAfter={<SizableText size={"$1"}>10m ago</SizableText>}
                    />
                </YGroup.Item>
                <YGroup.Item>
                    <ListItem
                        backgroundColor={bg}
                        icon={
                            <Avatar size={"$3"} circular backgroundColor={"$gray5"}>
                                <User />
                            </Avatar>
                        }
                        title={<SizableText>Mike Alvizo</SizableText>}
                        subTitle={"Test Notification"}
                        iconAfter={<SizableText size={"$1"}>2d ago</SizableText>}
                    />
                </YGroup.Item>
                <YGroup.Item>
                    <ListItem
                        backgroundColor={bg}
                        icon={
                            <Avatar size={"$3"} circular backgroundColor={"$gray5"}>
                                <User />
                            </Avatar>
                        }
                        title={<SizableText>Mike Alvizo</SizableText>}
                        subTitle={"Test Notification"}
                        iconAfter={<SizableText size={"$1"}>3w ago</SizableText>}
                    />
                </YGroup.Item>
            </YGroup>
            <Square alignItems='flex-start' backgroundColor={"$gray1"} mt="$4" padding="$2">
                <SizableText fontWeight={"light"} ml="$2">OLDER</SizableText>
            </Square>
            <YGroup mt="$3">
                <YGroup.Item>
                    <ListItem
                        backgroundColor={bg}
                        icon={
                            <Avatar size={"$3"} circular backgroundColor={"$gray5"}>
                                <User />
                            </Avatar>
                        }
                        title={<SizableText>Mike Alvizo</SizableText>}
                        subTitle={"Test Notification"}
                        iconAfter={<SizableText size={"$1"}>10m ago</SizableText>}
                    />
                </YGroup.Item>
                <YGroup.Item>
                    <ListItem
                        backgroundColor={bg}
                        icon={
                            <Avatar size={"$3"} circular backgroundColor={"$gray5"}>
                                <User />
                            </Avatar>
                        }
                        title={<SizableText>Mike Alvizo</SizableText>}
                        subTitle={"Test Notification"}
                        iconAfter={<SizableText size={"$1"}>2d ago</SizableText>}
                    />
                </YGroup.Item>
                <YGroup.Item>
                    <ListItem
                        backgroundColor={bg}
                        icon={
                            <Avatar size={"$3"} circular backgroundColor={"$gray5"}>
                                <User />
                            </Avatar>
                        }
                        title={<SizableText>Mike Alvizo</SizableText>}
                        subTitle={"Test Notification"}
                        iconAfter={<SizableText size={"$1"}>3w ago</SizableText>}
                    />
                </YGroup.Item>
            </YGroup>
            <StatusBar style='light' />
        </View>
    )
}

export default Notifications