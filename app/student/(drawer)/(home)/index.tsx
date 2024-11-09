import React, { useCallback, useEffect, useState } from 'react'
import { Bell, ChevronRight, ClipboardList, Pill, Plus, Sun, User } from '@tamagui/lucide-icons'
import { Href, Link, router, useFocusEffect } from 'expo-router'
import { Pressable, RefreshControl, TouchableNativeFeedback, useColorScheme, View as RNView } from 'react-native'
import { Card, Circle, ListItem, ScrollView, Separator, YGroup } from 'tamagui'
import { Avatar, Heading, SizableText, View, XStack, YStack } from "tamagui"
import { darkTheme, theme } from '@/theme/theme'
import { StatusBar } from 'expo-status-bar'
import { DrawerActions, useNavigation } from '@react-navigation/native'
import { useUser } from '@clerk/clerk-expo'
import { usePatientList } from '@/hooks/usePatientList'
import moment from 'moment'

const Module = (props: { href: Href, label: string, icon: any }) => {
    return (
        <TouchableNativeFeedback onPress={() => router.push(props.href)}>
            <YStack alignItems="center" justifyContent="center" padding="$1" flex={1} width={100}>
                <Circle borderWidth={1} borderColor={"$gray10"} padded>
                    {props.icon}
                </Circle>
                <SizableText>{props.label}</SizableText>
            </YStack>
        </TouchableNativeFeedback>
    )
}

const Home = () => {
    const colorScheme = useColorScheme()
    const bg = colorScheme === "dark" ? darkTheme.cyan3 : "#FFF"
    const navigation = useNavigation()
    const { user } = useUser()
    const { patients, fetchPatients, }: any = usePatientList();
    const [refreshing, setRefreshing] = useState(false);
    const [disable, setDisable] = useState(false)

    useFocusEffect(
        useCallback(() => {
            refreshPage()
            setDisable(false)
        }, [user?.id])
    );

    const refreshPage = async () => {
        setRefreshing(true);
        await fetchPatients(user?.id);
        setRefreshing(false);
    };

    const viewPatient = (patientId: string, patientName: string) => {
        router.push({
            pathname: `/student/patient/[patient_id]`,
            params: { patient_id: patientId, patientName: patientName },
        });
        setDisable(true)
    };

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer())
    }
    const navigate = (href: Href<string>) => {
        router.push(href)
    }

    return (
        <View flex={1}>
            <XStack alignItems='center' pt="$8" pb="$2" paddingHorizontal="$5">
                <Avatar>
                    <Avatar.Image src={require("@/assets/images/logo.png")} objectFit='contain' />
                </Avatar>
                <XStack flex={1} />
                <Pressable onPress={() => navigate("/student/notifications")} >
                    <Bell />
                </Pressable>
                <Pressable onPress={openDrawer} style={{ marginLeft: 20 }}>
                    <Avatar circular>
                        <Avatar.Image src={user?.imageUrl} />
                    </Avatar>
                </Pressable>
            </XStack>
            <ScrollView contentContainerStyle={{ gap: "$5", paddingTop: "$5" }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshPage} />}>
                <YStack paddingHorizontal="$5">
                    <XStack alignItems='center' gap="$2">
                        <Sun size={"$1"} color={theme.cyan10} />
                        <SizableText size={"$1"} color={theme.cyan10} textTransform='uppercase'>{moment(new Date).format("dddd, MMMM D")}</SizableText>
                    </XStack>
                    <Heading size={"$9"}>Overview</Heading>

                    <XStack gap="$3" mt="$3">
                        <Card backgroundColor={bg} bordered borderColor={colorScheme === "dark" ? theme.cyan12 : "$gray4"} padded flex={1}>
                            <SizableText>Patients</SizableText>
                            <SizableText size={"$6"} fontWeight={900}>{patients ? patients.length : 0}</SizableText>
                        </Card>
                        <Card backgroundColor={bg} bordered borderColor={colorScheme === "dark" ? theme.cyan12 : "$gray4"} padded flex={1}>
                            <SizableText>Prescriptions</SizableText>
                            <SizableText size={"$6"} fontWeight={900}>0</SizableText>
                        </Card>
                    </XStack>
                </YStack>
                <XStack gap="$2" paddingHorizontal="$5">
                    <Module
                        href={"/student/(pcr)"}
                        label='Add patient'
                        icon={<Plus />}
                    />
                    <Module href={"/student/patients"} label='My Patients' icon={<ClipboardList />} />
                    {/* <Module href={"#"} label='Prescriptions' icon={<Pill color={"white"} />} /> */}
                </XStack>
                <View>
                    <XStack alignItems='center' justifyContent='space-between' mb="$2" paddingHorizontal="$5">
                        <Heading>Recent</Heading>
                        <Link href={"/student/patients"}>
                            <SizableText color={theme.cyan10}>{"See all"}</SizableText>
                        </Link>
                    </XStack>
                    {patients
                        ?.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((patient: any) => (
                            <RNView key={patient._id}>
                                <TouchableNativeFeedback
                                    disabled={disable}
                                    background={TouchableNativeFeedback.Ripple('#ccc', false)}
                                    onPress={() => viewPatient(patient._id, `${patient.firstName} ${patient.lastName}`)}
                                >
                                    <ListItem
                                        backgroundColor={'$background0'}
                                        icon={
                                            <Avatar size={'$4'} circular>
                                                <Avatar.Image src={patient.imageUrl} />
                                            </Avatar>
                                        }
                                        title={`${patient.firstName} ${patient.middleName} ${patient.lastName}`}
                                        subTitle={`${moment(patient?.createdAt).startOf('day').fromNow()}`}
                                        iconAfter={ChevronRight}
                                    />
                                </TouchableNativeFeedback>
                            </RNView>
                        ))}
                </View>
            </ScrollView>
            <StatusBar style='auto' />
        </View>
    )

}

export default Home