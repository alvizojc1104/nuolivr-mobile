import { Adapt, Button, Card, Fieldset, H4, Input, Label, ListItem, ScrollView, Select, Sheet, SizableText, Square, View, XStack, YStack } from "tamagui";
import { AutocompleteInput } from 'react-native-autocomplete-input';
import { useCallback, useState } from "react";
import { CalendarClock, Check, ChevronRight, Dot, Plus, Trash2, User } from "@tamagui/lucide-icons";
import { H5 } from "tamagui";
import DateTimePicker from "react-native-modal-datetime-picker";
import Spinner from "react-native-loading-spinner-overlay";
import moment from "moment";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useColorScheme } from "react-native";

const myPatients = [
  "John Doe",
  "Jane Smith",
  "Michael Johnson",
  "Emily Davis",
  "William Brown",
  "Jessica Wilson",
  "David Martinez",
  "Sophia Garcia",
  "James Anderson",
  "Olivia Thomas",
  "Daniel Moore",
  "Emma Taylor",
  "Benjamin Lee",
  "Mia Harris",
  "Christopher Clark",
  "Isabella Lewis",
  "Alexander Walker",
  "Ava Hall",
  "Matthew Young",
  "Chloe Allen"
];

const chiefComplaintItems = [
  { complaint: "Visual Acuity Concern" },
  { complaint: "Eye Pain" },
  { complaint: "Redness" },
  { complaint: "Itching" },
  { complaint: "Discharge" },
  { complaint: "Floaters or flashes" },
  { complaint: "Other" },
]

const Existing = () => {
  const colorScheme = useColorScheme()
  const [query, setQuery] = useState("");
  const [hideItems, setHideItems] = useState(true);
  const [chiefComplaint, setChiefComplaint] = useState<string>("")
  const [otherChiefComplaint, setOtherChiefComplaint] = useState<string>("")
  const [complaintStarted, setComplaintStarted] = useState<Date | undefined>(undefined)
  const [patientHistoryArray, setPatientHistoryArray] = useState<Array<String>>([])
  const [patientHistoryText, setPatientHistoryText] = useState<string>("")
  const [showDatePicker2, setShowDatePicker2] = useState(false);
  const [loading, setLoading] = useState(false)

  // Filter the data based on the query
  const filteredData = myPatients.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item: string) => {
    setQuery(item); // Set the selected item as the query
    setHideItems(true)
  };

  const addPatientHistory = (text: string) => {
    let updatedPatientHistory: String[] = []

    if (text) {
      updatedPatientHistory = [...patientHistoryArray, text]
      //set the new array to the state
      setPatientHistoryArray(updatedPatientHistory)
    } else {
      return
    }
    setPatientHistoryText("")
    console.log(updatedPatientHistory)
  }

  const deletePatientHistoryItem = (indexToRemove: number) => {
    const updatedHistory = patientHistoryArray.filter((_, index) => index !== indexToRemove);
    setPatientHistoryArray(updatedHistory);
  };

  const openDatePicker2 = useCallback(() => {
    setShowDatePicker2(true);
  }, []);

  const hideDatePicker2 = useCallback(() => {
    setShowDatePicker2(false);
  }, []);

  const onSaveAssessment = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 3000);
  }

  const handleConfirmComplaintDate = useCallback((date: Date) => {
    setComplaintStarted(date);
    hideDatePicker2();
  }, [hideDatePicker2]);

  const renderResultList = () => {
    if (filteredData.length === 0) {
      return null; // Don't render the list if there are no results
    }

    return (
      <Card padding="$3">
        {filteredData.map((item, index) => (
          <ListItem key={index} padding="$2" title={item} pressTheme onPress={() => handleSelect(item)} />
        ))}
      </Card>
    );
  };
  return (
    <View flex={1} padding="$3" alignItems="center">
      <ScrollView flex={1} keyboardShouldPersistTaps="handled">
        <Spinner visible={loading} />
        <H4>Ocular Assessment Form for Existing Patients</H4>
        <SizableText color="$gray11" marginBottom="$3">Please fill in all fields before saving.</SizableText>
        <H5 fontWeight={900}>Patient Name: </H5>
        <View position="relative" height="$4" zIndex={100_000}>
          <AutocompleteInput
            data={filteredData}
            value={query}
            onChangeText={setQuery}
            hideResults={hideItems}
            renderTextInput={() => (
              <Input
                value={query}
                placeholder="Search patient..."
                onChangeText={(text) => {
                  setQuery(text);
                  setHideItems(false)
                }
                }
                borderWidth={0} // Remove input border
              />
            )}
            renderResultList={renderResultList} // Pass the function instead of JSX
            inputContainerStyle={{ borderWidth: 0 }}
            listContainerStyle={{ width: "100%" }}
          />

        </View>
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
            <SizableText size="$4" color={complaintStarted ? undefined : "$gray11"}>{moment(complaintStarted).format("MMMM D, YYYY")}</SizableText>
          </Card>
          <Card padded marginTop="$4">
            <SizableText size="$4" fontWeight={900}>Patient Medical History</SizableText>
            {!patientHistoryArray.length ? (<ListItem icon={<Dot size="$1" />} title="No history added." />) :
              (
                patientHistoryArray.map((historyItem, index) => (
                  <ListItem size="$4" key={index} icon={<Dot size="$1" />} title={historyItem} iconAfter={<TouchableOpacity onPress={() => deletePatientHistoryItem(index)}><Trash2 size="$1" color="$red10" /></TouchableOpacity>} />
                ))
              )}
            <Card.Footer>
              <XStack gap="$3" marginTop="$2" width="100%">
                <Input flex={1} placeholder="Type here..." placeholderTextColor="$gray11" borderTopWidth={0} borderLeftWidth={0} borderRightWidth={0} borderColor="$black1" value={patientHistoryText} onChangeText={setPatientHistoryText} />
                <Button chromeless theme="green_active" icon={<Plus color="$green10" size="$1" />} onPress={() => addPatientHistory(patientHistoryText)}>Add</Button>
              </XStack>
            </Card.Footer>
          </Card>
        </Fieldset>
        <DateTimePicker
          date={complaintStarted || new Date()}
          isVisible={showDatePicker2}
          onConfirm={handleConfirmComplaintDate}
          onCancel={hideDatePicker2}
          maximumDate={new Date()}
        />
      </ScrollView>
      <Button size="$4" width="100%" marginTop="$3" theme="active" onPress={onSaveAssessment}>Save</Button>
    </View>
  );
};

export default Existing;
