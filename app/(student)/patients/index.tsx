import { useUser } from "@clerk/clerk-expo";
import { ChevronRight, ListFilter, User } from "@tamagui/lucide-icons";
import { Link, Stack } from "expo-router";
import moment from "moment";
import { useState } from "react";
import { FlatList } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { SizableText, View, ScrollView, Card, YStack, Sheet, Select, XStack, H5, H4, Separator, ListItem, Label, YGroup, Avatar, Button } from "tamagui";

export default function MyPatients() {
    const { user, isLoaded } = useUser()
    const [loading, setLoading] = useState<boolean>(false)
    const [patientName, setPatientName] = useState<string>("");
    const [openSheet, setOpenSheet] = useState<boolean>(false)
    const [sort, setSort] = useState<string | undefined>("All")

    if (!isLoaded) {
        return <Spinner visible={true} />
    }

    // Sample patient data
    const patients = [
        { id: 1, name: "John Doe", age: 45, condition: "Myopia" },
        { id: 2, name: "Jane Smith", age: 32, condition: "Hyperopia" },
        { id: 3, name: "Michael Johnson", age: 28, condition: "Astigmatism" },
        { id: 4, name: "Emily Davis", age: 60, condition: "Presbyopia" },
        { id: 5, name: "Chris Brown", age: 50, condition: "Cataracts" }
    ];

    const handleSearchChange = (e: any) => {
        setPatientName(e.nativeEvent.text); // Access the text from the native event
    };

    // Filter patients based on search input
    const filteredPatients = patients.filter((patient) =>
        patient.name.toLowerCase().includes(patientName.toLowerCase())
    );

    //handle sort listing
    const handleSort = (sortBy: string) => {
        if (!sortBy) return
        setSort(sortBy)
        setOpenSheet(false)
    }
    return (
        <View flex={1}>
            <Spinner visible={loading} />
            <Stack.Screen options={{
                headerSearchBarOptions: { cancelButtonText: "Cancel", onChangeText: handleSearchChange, shouldShowHintSearchIcon: false, placeholder: "Search patient" },
            }}
            />
            <XStack gap="$3" padding="$3">
                <Card flex={1} padded elevate>
                    <SizableText>Patients this week:</SizableText>
                    <H4 fontWeight={900}>{patients.length}</H4>
                </Card>
                <Card flex={1} padded elevate>
                    <SizableText>Total:</SizableText>
                    <H4 fontWeight={900}>24</H4>
                </Card>
            </XStack>
            <ScrollView zIndex={100_000} width="100%" maxHeight="70%" position="absolute" top={0} alignSelf="center" contentContainerStyle={{ backgroundColor: "$background" }}>
                {patientName ? (
                    filteredPatients.map((patient) => (
                        <Link key={patient.id} href={{ pathname: "/patients/[patient_id]", params: { patient_id: patient.id, name: patient.name, age: patient.age, condition: patient.condition } }} asChild>
                            <ListItem title={patient.name} icon={<User size="$1" />} iconAfter={ChevronRight} />
                        </Link>

                    ))

                ) : (
                    null
                )}
            </ScrollView>
            <YGroup separator={<Separator />}>
                <YGroup.Item>
                    <XStack paddingHorizontal="$2" alignItems="center" mb="$2">
                        <SizableText>Recently added:</SizableText>
                        <XStack flex={1} />
                        <SizableText>Sort by:</SizableText>
                        <Button height="$3" ml="$2" themeInverse iconAfter={ListFilter} onPress={() => setOpenSheet(true)} fontSize="$1">{sort}</Button>
                    </XStack>
                </YGroup.Item>
                <FlatList
                    data={patients}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <YGroup.Item>
                            <Link
                                href={{ pathname: "/patients/[patient_id]", params: { patient_id: item.id, name: item.name, age: item.age, condition: item.condition } }}
                                asChild
                            >
                                <ListItem icon={<Avatar circular size="$5"><Avatar.Image src={user?.imageUrl} /></Avatar>} title={item.name} subTitle={<SizableText size="$1" color="$gray11">{moment(user?.createdAt).format("MMMM D, YYYY h:ss A")}</SizableText>} iconAfter={ChevronRight} pressTheme>
                                    <ListItem.Text>Condition: {item.condition}</ListItem.Text>
                                </ListItem>
                            </Link>
                            <Separator />
                        </YGroup.Item>

                    )}
                />
            </YGroup>
            <Sheet modal open={openSheet} onOpenChange={setOpenSheet} animation="quicker" snapPointsMode="fit">
                <Sheet.Overlay
                    animation="quicker"
                    exitStyle={{ opacity: 0 }}
                    enterStyle={{ opacity: 0 }}
                />
                <Sheet.Frame padding="$3">
                    <H5 fontWeight={900}>Sort by:</H5>
                    <ListItem backgroundColor="$background0" pressTheme title="All" onPress={()=>handleSort("All")}/>
                    <ListItem backgroundColor="$background0" pressTheme title="Pre-Assessments" onPress={()=>handleSort("Pre-assessment")}/>
                    <ListItem backgroundColor="$background0" pressTheme title="Visual Acuity" onPress={()=>handleSort("Visual Acuity")}/>
                </Sheet.Frame>
            </Sheet>
        </View>
    );
};
