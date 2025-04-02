import React from 'react'
import { useNotification } from '@/context/NotificationContext'
import { SizableText, View } from 'tamagui'

const Index = () => {
      const { error, expoPushToken, notification } = useNotification()

      if (error) {
            return (
                  <View>
                        <SizableText> Error: {error.message}</SizableText>
                  </View>
            )

      }
      return (
            <View>
                  <SizableText>Your Push Notification Token: {expoPushToken}</SizableText>
                  <SizableText>Latest Notification</SizableText>
                  <SizableText>Title: {notification?.request.content.title}</SizableText>
                  <SizableText>Body: {notification?.request.content.body}</SizableText>
                  <SizableText>Data: {JSON.stringify(notification?.request.content.data)}</SizableText>
                  <SizableText>Notification ID: {notification?.request.identifier}</SizableText>
            </View>
      )
}

export default Index