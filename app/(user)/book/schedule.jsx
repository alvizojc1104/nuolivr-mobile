import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChevronLeft, ChevronRight } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import {
  Button,
  Heading,
  ScrollView,
  Separator,
  SizableText,
  YStack,
} from "tamagui";

export default function App() {
  const colorScheme = useColorScheme();
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [times, setTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    getTime();
  }, []);

  const onDateChange = (date) => {
    setSelectedStartDate(date);
  };

  const disableSpecificDates = (date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Disable Sundays (0) and Saturdays (6)
  };

  const goToReview = async () => {
    if (!selectedStartDate || !selectedTime) {
      Alert.alert("Missing Fields", "Please choose time and date.");
    } else {
      try {
        await AsyncStorage.mergeItem(
          "@patientData",
          JSON.stringify({
            appointment_date: selectedStartDate.toISOString(),
            appointment_time: selectedTime,
          })
        );

        router.push("/book/review");
      } catch (error) {
        Alert.alert("Error", "Error saving date and time");
        console.error("Failed to save appointment data:", error);
      }
    }
  };

  const getTime = () => {
    const timeList = [];
    for (let i = 8; i <= 11; i++) {
      timeList.push({
        time: `${i}:00 AM`,
      });
    }
    for (let i = 1; i <= 4; i++) {
      timeList.push({
        time: `${i}:00 PM`,
      });
    }

    setTimes(timeList);
  };

  const tomorrow = new Date();
  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: "$3",
        paddingTop: "$3",
        flex: 1,
        gap: "$3",
        paddingBottom: "$5",
      }}
    >
      <Heading size="$7" marginTop="$1" marginBottom="$1">
        Select Date
      </Heading>
      <Separator marginBottom="$3" />
      <CalendarPicker
        onDateChange={onDateChange}
        minDate={tomorrow}
        selectedDayTextColor="white"
        selectedDayStyle={styles.selectedDayStyle}
        disabledDates={(date) => disableSpecificDates(date)}
        previousTitle="Prev"
        nextTitle="Next"
        textStyle={{
          color: colorScheme === "dark" ? "white" : "black",
          fontWeight: 400,
        }}
      />
      <Heading size="$7" marginBottom="$1">
        Select Time
      </Heading>
      <Separator marginBottom="$3" />
      <View style={styles.timeContainer}>
        {times.map((item) => (
          <TouchableOpacity
            key={item.time}
            style={[
              styles.timeButton,
              {
                backgroundColor:
                  selectedTime == item.time ? "hsl(211, 89.7%, 34.1%)" : null,
                borderColor:
                  colorScheme == "dark" ? "hsl(211, 89.7%, 34.1%)" : "black",
              },
            ]}
            onPress={() => setSelectedTime(item.time)}
          >
            <SizableText
              textAlign="center"
              fontWeight={900}
              color={selectedTime == item.time ? "white" : null}
            >
              {item.time}
            </SizableText>
          </TouchableOpacity>
        ))}
      </View>
      <YStack flex={1} />
      <Button
        theme="blue_active"
        size="$5"
        fontWeight={900}
        onPress={goToReview}
      >
        Next 2/3
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  selectedDayStyle: {
    backgroundColor: "hsl(211, 89.7%, 34.1%)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
  },
  timeButton: {
    width: "25%",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 0.5,
    marginRight: 10,
    borderRadius: 8,
    margin: 8,
  },
  timeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    display: "flex",
    width: "100%",
    alignSelf: "center",
  },
});
