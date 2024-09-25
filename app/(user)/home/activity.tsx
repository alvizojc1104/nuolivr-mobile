import React, { useEffect, useState, useMemo } from "react";
import {
  Button,
  Card,
  Heading,
  Paragraph,
  SizableText,
  Tabs,
  YGroup,
  YStack,
  XStack,
} from "tamagui";
import { CalendarClock, Plus } from "@tamagui/lucide-icons";
import BookButton from "../../../components/BookButton";
import { useUser } from "@clerk/clerk-expo";
import Spinner from "react-native-loading-spinner-overlay";
import axios from "axios";
import { Alert, FlatList } from "react-native";
import moment from "moment";
import { router } from "expo-router";
import { API_URL } from "@/constants/link";


// Define Appointment Interface
interface Appointment {
  _id: string;
  fullName: string;
  age: string;
  gender: string;
  appointment_date: string;
  appointment_time: string;
  symptoms: string;
  status: string;
}

// Define Props for AppointmentCard
interface AppointmentCardProps {
  appointment: Appointment;
}

// AppointmentCard Component
const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const formattedDate = useMemo(() => {
    return moment(appointment.appointment_date).format("MMMM D, YYYY");
  }, [appointment.appointment_date]);

  return (
    <Card
      key={appointment._id}
      padded
      elevate
      marginVertical="$2"
      marginHorizontal="$2"
      backgroundColor="$gray3"
    >
      <Heading size="$7">{formattedDate}</Heading>
      <YStack gap="$1">
        <SizableText fontWeight="bold">
          Patient Name: {appointment.fullName}
        </SizableText>
        <SizableText>
          Appointment Time: {appointment.appointment_time}
        </SizableText>
        <SizableText textTransform="capitalize">
          Status: {appointment.status}
        </SizableText>
      </YStack>
      <Card.Footer justifyContent="flex-end">
        <Button theme="red_active">Cancel Request</Button>
      </Card.Footer>
    </Card>
  );
};

// Main Activity Component
const Activity = () => {
  const { isLoaded, user } = useUser();
  const [pendingAppointments, setPendingAppointments] = useState<
    Appointment[] | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  console.log(`${API_URL}/api/get/user/pending-appointments/${user?.id}`)


  useEffect(() => {
    if (!isLoaded || !user) return;

    const getPendingAppointments = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/api/get/user/pending-appointments/${user.id}`
        );
        setPendingAppointments(response.data.pendingAppointments);
      } catch (error) {
        Alert.alert(
          "Error Fetching Appointments",
          "Please check your internet connection and try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    getPendingAppointments();
  }, [isLoaded, user]);

  // Memoize processed appointments (e.g., sorted by date)
  const processedAppointments = useMemo(() => {
    if (!pendingAppointments) return [];
    return [...pendingAppointments].sort(
      (a, b) =>
        new Date(b.appointment_date).getTime() -
        new Date(a.appointment_date).getTime()
    );
  }, [pendingAppointments]);

  // Memoize the appointment list
  const appointmentList = useMemo(() => {
    return (
      <FlatList
        data={processedAppointments}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <AppointmentCard appointment={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    );
  }, [processedAppointments]);

  return (
    <>
      <Spinner visible={isLoading} />
      <Tabs
        orientation="horizontal"
        flexDirection="column"
        flex={1}
        overflow="hidden"
        defaultValue="tab1"
      >
        <Tabs.List
          aria-label="Activity"
          marginVertical="$2"
          padding="$2"
          gap="$2"
          width="100%"
          alignSelf="center"
        >
          <Tabs.Tab flex={1} value="tab1" elevate borderRadius="$2">
            <SizableText>Pending</SizableText>
          </Tabs.Tab>
          <Tabs.Tab flex={1} value="tab2" elevate borderRadius="$2">
            <SizableText>Upcoming</SizableText>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Content value="tab1" flex={1}>
          {processedAppointments.length === 0 ? (
            <YStack justifyContent="center" alignItems="center" flex={1}>
              <CalendarClock size="$5" />
              <YGroup
                marginVertical="$4"
                justifyContent="center"
                alignItems="center"
              >
                <YGroup.Item>
                  <Paragraph>You have no pending appointments.</Paragraph>
                </YGroup.Item>
              </YGroup>
              <BookButton route="book" title="Book" />
            </YStack>
          ) : (
            <>
              {appointmentList}
              <Button
                onPress={() => router.push("/book/")}
                justifyContent="center"
                iconAfter={Plus}
                position="absolute"
                bottom={20}
                right={20}
                zIndex={100}
                circular
                size="$5"
                theme="active"
              />
            </>
          )}
        </Tabs.Content>

        <Tabs.Content value="tab2" flex={1} padding="$3">
          <YStack justifyContent="center" alignItems="center" flex={1}>
            <CalendarClock size="$5" />
            <YGroup
              marginVertical="$4"
              justifyContent="center"
              alignItems="center"
            >
              <YGroup.Item>
                <Paragraph fontWeight="900">
                  You have no upcoming appointments.
                </Paragraph>
                <SizableText textAlign="center" size="$1">
                  Schedule your healthcare appointments at your convenience.
                </SizableText>
              </YGroup.Item>
            </YGroup>
            <BookButton route="book" title="Book" />
          </YStack>
        </Tabs.Content>
      </Tabs>
    </>
  );
};

export default Activity;
