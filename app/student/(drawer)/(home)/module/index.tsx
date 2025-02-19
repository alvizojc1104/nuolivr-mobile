import { Alert, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-expo'
import axios from 'axios'
import { SERVER } from '@/constants/link'
import Loading from '@/components/Loading'
import Modules from '@/components/Modules'
import { ScrollView, SizableText, View } from 'tamagui'
import { router } from 'expo-router'
import CustomButton from '@/components/CustomButton'
import { Plus } from '@tamagui/lucide-icons'

export interface IModule {
      _id: string;
      addedDate: string;
      id: {
            _id: string;
            createdBy: string;
            name: string;
            acronym: string;
      };
      icon: string;
      onPress: () => void;
}

const Module = () => {
      const [modules, setModules] = useState<Array<IModule> | null>(null)
      const { user, isLoaded } = useUser()
      const [refreshing, setRefreshing] = useState(false)

      useEffect(() => {
            if (isLoaded && user) {
                  axios.get(`${SERVER}/account/module?id=${user.id}`)
                        .then(response => {
                              setModules(response.data.modules)
                        })
                        .catch(error => {
                              Alert.alert("Error", error.response.data.message)
                        })
            }

            return () => {

            }
      }, [])

      const openModule = (id: string, name: string, acronym: string) => {
            router.push({ pathname: `/student/module/[moduleId]`, params: { moduleName: name, iconText: acronym, moduleId: id } })
      }

      const refreshPage = async () => {
            setRefreshing(true);
            await axios.get(`${SERVER}/account/module?id=${user?.id}`)
                  .then(response => {
                        setModules(response.data.modules)
                        console.log(response.data.modules)
                  })
                  .catch(error => {
                        Alert.alert("Error", error.response.data.message)
                  })
            setRefreshing(false);
      };

      if (!modules) {
            return <Loading />
      }

      return (
            <View flex={1} backgroundColor={"white"}>
                  <ScrollView flex={1} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshPage} />}>
                        {modules.length === 0 ?
                              <View alignItems='center' justifyContent='center' flex={1} padding="$5">
                                    <SizableText textAlign='center' color={"gray"}>You have no modules yet. Ask your faculty or join a module by using a join code.</SizableText>
                              </View>
                              :
                              modules.map((item, index) => {
                                    return (
                                          <View key={index}>
                                                <Modules name={item.id.name} iconText={item.id.acronym} onPress={() => openModule(item.id._id, item.id.name, item.id.acronym)} />
                                          </View>
                                    )
                              })
                        }
                  </ScrollView>
                  <View position="absolute" bottom={"$5"} right="$5">
                        <CustomButton buttonText='Join' iconAfter={Plus} onPress={() => Alert.alert("Join module")} />
                  </View>
            </View>

      )

}

export default Module