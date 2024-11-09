import Label from '@/components/Label';
import { usePatientList } from '@/hooks/usePatientList';
import { theme } from '@/theme/theme';
import { useUser } from '@clerk/clerk-expo';
import { ChevronRight } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { TouchableNativeFeedback, View as RNView, RefreshControl } from 'react-native';
import { Avatar, Card, Input, ListItem, ScrollView, Separator, SizableText, View, XStack } from 'tamagui';

const MyPatients = () => {
    const { user } = useUser();
    const { patients, fetchPatients, error, loading }: any = usePatientList();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setRefreshing(true);
            await fetchPatients(user?.id);
            setRefreshing(false);
        };

        fetchData();
    }, [user?.id]);

    const refreshPage = async () => {
        setRefreshing(true);
        await fetchPatients(user?.id);
        setRefreshing(false);
    };

    // Handle error case
    if (error) {
        return (
            <View flex={1} alignItems="center" justifyContent="center">
                <SizableText color="red">{`Error: ${error}`}</SizableText>
            </View>
        );
    }

    const viewPatient = (patientId: string, patientName: string) => {
        router.push({
            pathname: `/student/patient/[patient_id]`,
            params: { patient_id: patientId, patientName: patientName },
        });
    };

    return (
        <ScrollView
            flex={1}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshPage} />}
        >
            {loading ? <View flex={1} /> :

                <><RNView style={{ borderRadius: 5, overflow: 'hidden', marginHorizontal: 16, marginTop: 16 }}>
                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple('#ccc', false)}
                        onPress={() => router.push('/student/search-patient')}
                    >
                        <Card paddingVertical="$2" paddingHorizontal="$5">
                            <Input unstyled placeholder="Search" disabled />
                        </Card>
                    </TouchableNativeFeedback>
                </RNView><XStack paddingHorizontal="$5" mt="$4">
                        <SizableText mb="$2" mt="$4">Recently added:</SizableText>
                    </XStack>
                    <View>
                        {patients
                            ?.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map((patient: any) => (
                                <RNView key={patient._id}>
                                    <TouchableNativeFeedback
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
                                            subTitle={`${moment(patient?.createdAt).calendar()}`}
                                            iconAfter={ChevronRight}
                                        />
                                    </TouchableNativeFeedback>
                                    <Separator />
                                </RNView>
                            ))}

                    </View>
                </>
            }
            <StatusBar style="light" />
        </ScrollView>

    );
};

export default MyPatients;
