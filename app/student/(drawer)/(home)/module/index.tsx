import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-expo'
import axios from 'axios'
import { SERVER } from '@/constants/link'
import Loading from '@/components/Loading'

export interface IModule {
      _id: string;
      addedDate: string;
      id: {
            _id: string;
            createdBy: string;
            name: string;
      };
}

const Module = () => {
      const [modules, setModules] = useState<Array<IModule> | null>(null)
      const { user, isLoaded } = useUser()

      useEffect(() => {
            if (isLoaded && user) {
                  console.log(`${SERVER}/account/module?id=${user.id}`)
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

      if (!modules) {
            return <Loading />
      } else {
            return (
                  <View>
                        {
                              modules.map((item, index) => {
                                    return (<Text>{item?.id.name}</Text>)
                              })
                        }
                  </View>
            )
      }
}

export default Module