import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { H5, ScrollView, Separator, SizableText, Tabs, TabsContentProps } from 'tamagui'


const ModuleDetail = () => {
  const params = useLocalSearchParams()
  useEffect(() => {


    return () => {

    }
  }, [])

  return (
    <ScrollView flex={1} backgroundColor={"white"}>
      <Tabs
        flex={1}
        defaultValue="tab1"
        orientation="horizontal"
        flexDirection="column"
        width={"100%"}
        height={150}
        borderWidth={0}
        overflow="hidden"
      >
        <Tabs.List
          disablePassBorderRadius="bottom"
          aria-label="Manage your account"
          width={"100%"}
        >
          <Tabs.Tab flex={1} value="tab1">
            <SizableText>Submissions</SizableText>
          </Tabs.Tab>
          <Tabs.Tab flex={1} value="tab2">
            <SizableText>Members</SizableText>
          </Tabs.Tab>
        </Tabs.List>
        <Separator />
        <TabsContent value="tab1">
        </TabsContent>

        <TabsContent value="tab2">
          <H5>Connections</H5>
        </TabsContent>
      </Tabs>
    </ScrollView>
  )
}

const TabsContent = (props: TabsContentProps) => {
  return (
    <Tabs.Content
      backgroundColor="$background"
      key="tab3"
      padding="$2"
      alignItems="center"
      justifyContent="center"
      flex={1}
      borderColor="$background"
      borderRadius="$2"
      borderTopLeftRadius={0}
      borderTopRightRadius={0}
      borderWidth="$2"
      {...props}
    >
      {props.children}
    </Tabs.Content>
  )
}

export default ModuleDetail