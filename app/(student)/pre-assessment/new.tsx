import { useState, useCallback, useMemo, memo } from "react";
import { Alert, FlatList, Keyboard, TouchableOpacity } from "react-native";
import { Adapt, Button, Card, Fieldset, H4, H5, Input, Label, ListItem, ScrollView, Select, SelectProps, Sheet, SizableText, Square, View, XStack } from "tamagui";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Calendar, CalendarClock, CalendarPlus, Check, ChevronRight, Dot, GitPullRequestCreateArrow, Phone, Plus, Trash2, UserRound } from "@tamagui/lucide-icons";
import moment from "moment";
import Spinner from "react-native-loading-spinner-overlay";
import { useFocusEffect } from "expo-router";

const chiefComplaintItems = [
  { complaint: "Visual Acuity Concern" },
  { complaint: "Eye Pain" },
  { complaint: "Redness" },
  { complaint: "Itching" },
  { complaint: "Discharge" },
  { complaint: "Floaters or flashes" },
  { complaint: "Other" },
]


const New = (props: SelectProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDatePicker2, setShowDatePicker2] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [openSheet, setOpenSheet] = useState<boolean>(false)
  const [chiefComplaint, setChiefComplaint] = useState<string>("")
  const [otherChiefComplaint, setOtherChiefComplaint] = useState<string>("")
  const [complaintStarted, setComplaintStarted] = useState<Date | undefined>(undefined)
  const [patientHistoryArray, setPatientHistoryArray] = useState<Array<String>>([])
  const [patientHistoryText, setpatientHistoryText] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)


  const openGenderSheet = () => {
    setOpenSheet(true)
  }

  const formatPhoneNumber = useCallback((input: string) => {
    if (input.length === 13) {
      Keyboard.dismiss();
    }

    const cleaned = input.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,4})(\d{0,3})(\d{0,4})$/);

    if (match) {
      const formattedNumber = [match[1], match[2], match[3]]
        .filter(Boolean)
        .join(' ');
      setPhoneNumber(formattedNumber);
    } else {
      setPhoneNumber(input);
    }
  }, []);

  const openDatePicker = useCallback(() => {
    setShowDatePicker(true);
  }, []);

  const hideDatePicker = useCallback(() => {
    setShowDatePicker(false);
  }, []);

  const openDatePicker2 = useCallback(() => {
    setShowDatePicker2(true);
  }, []);

  const hideDatePicker2 = useCallback(() => {
    setShowDatePicker2(false);
  }, []);

  const calculateAge = useCallback((date: Date) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }, []);

  const handleConfirm = useCallback((date: Date) => {
    const age = calculateAge(date);

    if (age < 5) {
      Alert.alert("Age Limit", "Please double check the date of birth.");
    } else {
      setSelectedDate(date);
    }

    hideDatePicker();
  }, [calculateAge, hideDatePicker]);

  const handleConfirmComplaintDate = useCallback((date: Date) => {
    setComplaintStarted(date);
    hideDatePicker2();
  }, [hideDatePicker2]);

  const formattedDate = useMemo(
    () => (selectedDate ? moment(selectedDate).format("MMMM D, YYYY") : "Select date of birth"),
    [selectedDate]
  );

  const formattedComplaintDate = useMemo(
    () => (complaintStarted ? moment(complaintStarted).format("MMMM D, YYYY") : "Complaint started..."),
    [complaintStarted]
  );

  const addPatientHistory = (text: string) => {
    let updatedPatientHistory: String[] = []

    if (text) {
      updatedPatientHistory = [...patientHistoryArray, text]
      //set the new array to the state
      setPatientHistoryArray(updatedPatientHistory)
    } else {
      return
    }
    setpatientHistoryText("")
    console.log(updatedPatientHistory)
  }

  const deletePatientHistoryItem = (indexToRemove: number) => {
    const updatedHistory = patientHistoryArray.filter((_, index) => index !== indexToRemove);
    setPatientHistoryArray(updatedHistory);
  };

  const onSaveAssessment = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 3000);
  }

  return (
    <View flex={1} gap="$3">
      <Spinner visible={loading} />
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: "$3", paddingTop: "$3", paddingBottom: "$5", gap: "$3" }}>
        <Fieldset>
          <H4>Ocular Assessment Form for New Patients</H4>
          <SizableText color="$gray11">Please fill in all fields before submitting.</SizableText>
        </Fieldset>
        <Fieldset marginTop="$2">
          <H5 fontWeight={900}>Patient Details</H5>
          <Label>Full Name</Label>
          <Card size="$4" flexDirection="row" alignItems="center" pressTheme gap="$3">
            <Square backgroundColor="$blue8" size="$4" borderTopLeftRadius="$5" borderBottomLeftRadius="$5">
              <UserRound color="$backgroundPress" />
            </Square>
            <Input
              flex={1}
              size="$4"
              borderWidth={0}
              placeholder="First Name, Middle Name, Last Name"
              placeholderTextColor="$gray11"
              paddingLeft={-5}
              keyboardType="default"
            />
          </Card>
          <Label>Gender</Label>
          <Card size="$4" flexDirection="row" alignItems="center" pressTheme gap="$3" onPress={openGenderSheet}>
            <Square backgroundColor="$blue8" size="$4" borderTopLeftRadius="$5" borderBottomLeftRadius="$5">
              <GitPullRequestCreateArrow color="$backgroundPress" />
            </Square>
            <SizableText size="$4" color={gender ? undefined : "$gray11"}>{gender ? gender : "Select a gender"}</SizableText>
          </Card>
          <Label>Date of Birth</Label>
          <Card size="$4" flexDirection="row" alignItems="center" pressTheme gap="$3" onPress={openDatePicker}>
            <Square backgroundColor="$blue8" size="$4" borderTopLeftRadius="$5" borderBottomLeftRadius="$5">
              <Calendar color="$backgroundPress" />
            </Square>
            <SizableText size="$4" color={selectedDate ? undefined : "$gray11"}>{formattedDate}</SizableText>
          </Card>
          <Label>Contact Number</Label>
          <Card size="$4" flexDirection="row" alignItems="center" pressTheme gap="$3">
            <Square backgroundColor="$blue8" size="$4" borderTopLeftRadius="$5" borderBottomLeftRadius="$5">
              <Phone color="$backgroundPress" />
            </Square>
            <Input
              flex={1}
              size="$4"
              borderWidth={0}
              placeholder="Mobile Number"
              placeholderTextColor="$gray11"
              paddingLeft={-5}
              keyboardType="phone-pad"
              maxLength={13}
              value={phoneNumber}
              onChangeText={formatPhoneNumber}
            />
          </Card>
        </Fieldset>
        <Fieldset marginTop="$3">
          <H5 fontWeight={900}>Chief Complaint</H5>
          <Label>Reason for Eye Checkup:</Label>
          <Select value={chiefComplaint} onValueChange={setChiefComplaint}>
            <Card size="$4" pressTheme >
              <Select.Trigger size="$4.5" iconAfter={ChevronRight} borderWidth={0} fontSize="$4">
                <Select.Value placeholder="Select reason..." size="$4" />
              </Select.Trigger>
            </Card>
            <Adapt when="sm" platform="touch">
              <Sheet
                native={!!props.native}
                modal
                dismissOnSnapToBottom
                animation="quicker"
                snapPointsMode="fit"
              >
                <Sheet.Frame>
                  <Sheet.ScrollView>
                    <Adapt.Contents />
                  </Sheet.ScrollView>
                </Sheet.Frame>
                <Sheet.Overlay
                  animation="quicker"
                  enterStyle={{ opacity: 0 }}
                  exitStyle={{ opacity: 0 }}
                />
              </Sheet>
            </Adapt>
            <Select.Content zIndex={100000}>
              <Select.Viewport width="100%">
                <Select.Group>
                  <Select.Label fontSize="$4">Select Chief Complaint</Select.Label>
                  {chiefComplaintItems.map((item, i) => (
                    <Select.Item key={i} value={item.complaint} index={i}>
                      <Select.ItemText size="$4">{item.complaint}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size="$1" color="$green10" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Viewport>
            </Select.Content>
          </Select>
          <Input display={chiefComplaint == "Other" ? "block" : "none"} size="$4" marginTop="$2" placeholder="Please specify..." placeholderTextColor="$gray11" value={otherChiefComplaint} onChangeText={setOtherChiefComplaint} />
          <Label>Complaint experience started:</Label>
          <Card size="$4" flexDirection="row" alignItems="center" pressTheme gap="$3" onPress={openDatePicker2}>
            <Square backgroundColor="$red9" size="$4" borderTopLeftRadius="$5" borderBottomLeftRadius="$5">
              <CalendarClock color="$backgroundPress" />
            </Square>
            <SizableText size="$4" color={complaintStarted ? undefined : "$gray11"}>{formattedComplaintDate}</SizableText>
          </Card>
          <Card padded elevation={10} marginTop="$4">
            <SizableText size="$4" fontWeight={900}>Patient Medical History</SizableText>
            {!patientHistoryArray.length ? (<ListItem icon={<Dot size="$1" />} title="No history added." />) :
              (
                patientHistoryArray.map((historyItem, index) => (
                  <ListItem size="$4" key={index} icon={<Dot size="$1" />} title={historyItem} iconAfter={<TouchableOpacity onPress={() => deletePatientHistoryItem(index)}><Trash2 size="$1" color="$red10" /></TouchableOpacity>} />
                ))
              )}
            <Card.Footer>
              <XStack gap="$3" marginTop="$2" width="100%">
                <Input flex={1} placeholder="Type here..." placeholderTextColor="$gray11" borderTopWidth={0} borderLeftWidth={0} borderRightWidth={0} borderColor="$black1" value={patientHistoryText} onChangeText={setpatientHistoryText} />
                <Button chromeless theme="green_active" icon={<Plus color="$green10" size="$1" />} onPress={() => addPatientHistory(patientHistoryText)}>Add</Button>
              </XStack>
            </Card.Footer>
          </Card>
        </Fieldset>
        <Button size="$4" marginTop="$3" theme="active" onPress={onSaveAssessment}>Save</Button>
      </ScrollView>
      <DateTimePicker
        date={selectedDate || new Date()}
        isVisible={showDatePicker}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={new Date()}
      />
      <DateTimePicker
        date={complaintStarted || new Date()}
        isVisible={showDatePicker2}
        onConfirm={handleConfirmComplaintDate}
        onCancel={hideDatePicker2}
        maximumDate={new Date()}
      />
      <GenderSheet gender={gender} setGender={setGender} openSheet={openSheet} setOpenSheet={setOpenSheet} />
    </View>
  );
};

export default New;

const GenderSheet = memo(({ gender, setGender, openSheet, setOpenSheet }: any) => {
  useFocusEffect(
    useCallback(() => {
      return () => {
        setOpenSheet(false);
      };
    }, [setOpenSheet])
  );

  const onSaveGender = (gender: string) => {
    setGender(gender)
    setOpenSheet(false)
  }
  return (
    <Sheet
      modal
      open={openSheet}
      onOpenChange={setOpenSheet}
      dismissOnOverlayPress
      disableDrag
      animation="quicker"
      snapPointsMode='fit'
    >
      <Sheet.Overlay
        animation="quicker"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Frame>
        <SizableText size="$4" margin="$3" fontWeight={900}>Select Gender</SizableText>
        <ListItem size="$4" title="Male" pressTheme onPress={() => onSaveGender("Male")} iconAfter={gender == "Male" ? Check : undefined} />
        <ListItem size="$4" title="Female" pressTheme onPress={() => onSaveGender("Female")} iconAfter={gender == "Female" ? Check : undefined} />
      </Sheet.Frame>
    </Sheet>
  )
})