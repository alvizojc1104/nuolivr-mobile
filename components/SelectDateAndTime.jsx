import { FlatList, useColorScheme } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Heading, SizableText, YStack } from "tamagui";
import moment from "moment";
import { StyleSheet, Text, View } from "react-native";
import CalendarPicker from "react-native-calendar-picker";

const SelectDateAndTime = () => {
  const colorScheme = useColorScheme();
  const [days, setDays] = useState([]);
  const [times, setTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date()); // Set the initial selected date to today

  const onDateChange = (date) => {
    setSelectedStartDate(date);
  };

  const disableSpecificDates = (date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Disable Sundays (0) and Saturdays (6)
  };

  const startDate = selectedStartDate ? selectedStartDate.toString() : "";
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  useEffect(() => {
    getDays();
    getTime();
  }, []);

  const getDays = () => {
    const nextFourteenDays = [];
    let dayCount = 1;
    let daysAdded = 0;

    while (daysAdded < 12) {
      const date = moment().add(dayCount, "days");
      const dayOfWeek = date.day();

      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        nextFourteenDays.push({
          date: date,
          day: date.format("ddd"),
          formattedDate: date.format("D MMM"),
        });
        daysAdded++;
      }

      dayCount++;
    }

    setDays(nextFourteenDays);
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

  const buttonStyle2 = {
    width: "30%",
    paddingHorizontal: "$3",
    borderWidth: 0.5,
    borderColor: "hsl(211, 85.1%, 27.4%)",
    margin: 4,
    borderRadius: 10,
    paddingVertical: "$3",
    alignItems: "center",
  };

  const renderButton = (item, isSelected, onPress, buttonStyle) => (
    <Button
      pressTheme
      unstyled
      style={[
        buttonStyle,
        isSelected
          ? { backgroundColor: "hsl(211, 89.7%, 34.1%)" }
          : "hsla(0, 0%, 100%, 0.034)",
      ]}
      onPress={onPress}
    >
      <YStack alignItems="center" justifyContent="center">
        <SizableText size="$1" style={isSelected ? { color: "white" } : null}>
          {item.day || item.time}
        </SizableText>
        {item.formattedDate && (
          <SizableText
            fontSize="$4"
            fontWeight={900}
            style={isSelected ? { color: "white" } : null}
          >
            {item.formattedDate}
          </SizableText>
        )}
      </YStack>
    </Button>
  );

  return (
    <YStack paddingHorizontal="$3">
      <Heading size="$7" marginBottom="$3" alignSelf="center">
        Book Appointment
      </Heading>

      <CalendarPicker
        onDateChange={onDateChange}
        minDate={tomorrow}
        disabledDates={(date) => disableSpecificDates(date)}
        selectedDayStyle={styles.selectedDayStyle}
        selectedDayTextColor="white"
        selectedStartDate={startDate}
        textStyle={{
          color: colorScheme === "dark" ? "white" : "black",
        }}
      />

      <View>
        <Text style={{ color: colorScheme === "dark" ? "white" : "black" }}>
          SELECTED DATE: {startDate}
        </Text>
      </View>

      <Heading size="$1" marginTop="$3" alignSelf="center">
        Preferred Time
      </Heading>
      <FlatList
        data={times}
        numColumns={3}
        keyExtractor={(item) => item.time}
        renderItem={({ item }) =>
          renderButton(
            item,
            selectedTime === item.time,
            () => setSelectedTime(item.time),
            buttonStyle2
          )
        }
        contentContainerStyle={{ alignItems: "flex-start" }}
      />
    </YStack>
  );
};

export default SelectDateAndTime;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    padding: 5,
    borderRadius: 10,
  },
  selectedDayStyle: {
    backgroundColor: "hsl(211, 89.7%, 34.1%)",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
