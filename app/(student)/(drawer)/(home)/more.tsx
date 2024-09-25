import React, { useState } from 'react'
import {  useUser } from '@clerk/clerk-expo'
import { Avatar,  Card, ListItem, Separator, SizableText, View, YGroup, YStack } from 'tamagui'
import Spinner from 'react-native-loading-spinner-overlay'
import { ChevronRight, CircleUserRound, LogOut, NotepadText, ScanFace, Settings } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import Logout from '@/components/Logout'

const More = () => {
  const { isLoaded, user } = useUser()
  const [openAlert, setOpenAlert] = useState(false)

  if (!isLoaded) {
    return
  }

  const triggerAlert = () => setOpenAlert(true)

  const viewProfile = () => {
    router.push("/profile")
  }

  return (
    <View flex={1} padding="$3" gap="$3">
      <Spinner visible={false} />
      <Card padded elevate pressTheme flexDirection='row' alignItems='center' gap="$3" onPress={viewProfile}>
        <Avatar circular size="$7">
          <Avatar.Image src={user?.imageUrl} />
        </Avatar>
        <YStack flex={1}>
          <SizableText fontWeight={900}>{user?.fullName}</SizableText>
          <SizableText size="$3">View Profile</SizableText>
        </YStack>
        <ChevronRight size="$1" />
      </Card>
      <Card elevate>
        <YGroup separator={<Separator />}>
          <YGroup.Item >
            <ListItem size="$5" title="Account" icon={<CircleUserRound size="$1.5" color="$blue11" />} iconAfter={ChevronRight} pressTheme />
          </YGroup.Item>
          <YGroup.Item >
            <ListItem size="$5" title="My Patients" icon={<NotepadText size="$1.5" color="$blue11" />} iconAfter={ChevronRight} pressTheme onPress={()=>router.push("/patients")}/>
          </YGroup.Item>
          <YGroup.Item >
            <ListItem size="$5" title="Visual Acuities" icon={<ScanFace size="$1.5" color="$blue11" />} iconAfter={ChevronRight} pressTheme />
          </YGroup.Item>
          <YGroup.Item >
            <ListItem size="$5" title="Settings" icon={<Settings size="$1.5" color="$blue11" />} iconAfter={ChevronRight} pressTheme />
          </YGroup.Item>
          <YGroup.Item >
            <ListItem size="$5" title={<SizableText size="$5" color="$red11">Logout</SizableText>} color="$red11" icon={<LogOut size="$1.5" color="$red11" />} pressTheme onPress={triggerAlert} />
          </YGroup.Item>
        </YGroup>
      </Card>
      <Logout openAlert={openAlert} setOpenAlert={setOpenAlert} />
    </View>
  )
}

export default More