import { View, Text, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import { Avatar, Card, Heading, SizableText, XStack, YStack } from 'tamagui'
import { useUser } from '@clerk/clerk-expo'
import { ScrollView } from 'tamagui'
import { ChevronRight, Megaphone } from '@tamagui/lucide-icons'

const StudentPage = () => {
    const { user } = useUser()
    return (
        <ScrollView contentContainerStyle={{ justifyContent: 'flex-start', alignItems: "flex-start", width: "100%", paddingHorizontal: "$3", paddingTop: "$3", paddingBottom: "$10", gap: "$3" }}>
            <Heading size="$7" marginVertical="$1">Good afternoon, {user?.firstName}.</Heading>
            <XStack gap="$3">
                <Card padded elevate flex={1} pressTheme>
                    <SizableText>My Patients:</SizableText>
                    <Heading>89</Heading>
                </Card>
                <Card padded elevate flex={1} pressTheme>
                    <SizableText>Pre-Assessments:</SizableText>
                    <Heading>21</Heading>
                </Card>
            </XStack>
            <Card padded elevate width='100%' >
                <XStack flex={1} justifyContent='space-between' marginBottom="$3">
                    <SizableText fontWeight={900}>Latest Patient Data</SizableText>
                    <SizableText theme="alt1">View all</SizableText>
                </XStack>
                <LatestPatientData imageUrl={user?.imageUrl} fullName={user?.fullName} date={user?.createdAt?.toLocaleString()} />
                <LatestPatientData imageUrl={user?.imageUrl} fullName={user?.fullName} date={user?.createdAt?.toLocaleString()} />
                <LatestPatientData imageUrl={user?.imageUrl} fullName={user?.fullName} date={user?.createdAt?.toLocaleString()} />
                <LatestPatientData imageUrl={user?.imageUrl} fullName={user?.fullName} date={user?.createdAt?.toLocaleString()} />
            </Card>
            <Card padded elevate width="100%" gap="$3" backgroundColor="$blue11">
                <XStack alignItems='center' gap="$2">
                    <Megaphone color="$yellow10" />
                    <SizableText color="$yellow10" fontWeight={900}>Announcements</SizableText>
                </XStack>
                <Heading color="$white1" size="$7" ellipse>Submission of Pre-Assessments</Heading>
                <SizableText color="$white1">The submission for all of your pre-assesments will be on November 21, 2024</SizableText>
                <SizableText color="$gray7" size="$2">Posted by: Dr. Mary Rose Paredes</SizableText>
            </Card>
           
        </ScrollView>
    )
}
export default memo(StudentPage)

const LatestPatientData = ({ imageUrl, fullName, date }: any) => {
    return (
        <TouchableOpacity style={{ flexDirection: "row", gap: 15, alignItems: 'center', marginBottom: 15 }}>
            <Avatar circular flex={1}>
                <Avatar.Image src={imageUrl} />
            </Avatar>
            <YStack flex={3}>
                <SizableText>{fullName}</SizableText>
                <SizableText color="$gray9">{date}</SizableText>
            </YStack>
            <ChevronRight flex={1} />
        </TouchableOpacity>
    )
}