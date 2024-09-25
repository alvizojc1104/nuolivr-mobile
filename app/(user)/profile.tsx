import { useUser } from "@clerk/clerk-expo";
import React, { useEffect, useState, useRef } from "react";
import { Alert, FlatList, Pressable, TouchableOpacity } from "react-native";
import { Avatar, Button, Card, Fieldset, Heading, Input, Paragraph, ScrollView, SizableText, XStack, YStack } from "tamagui";
import * as ImagePicker from 'expo-image-picker';
import { Contact, Image, MapPin, PenSquare } from "@tamagui/lucide-icons";
import Spinner from "react-native-loading-spinner-overlay";
import axios from "axios";

const Profile = () => {
  const { user, isLoaded } = useUser();
  const [edit, setEdit] = useState(false);
  const [editContact, setEditContact] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState({
    house_number: '',
    barangay: '',
    municipality: '',
    province: '',
    zip_code:''
  });
  const [userData, setUserData] = useState<any>(null);
  const barangayRef = useRef<any>(null);
  const municipalityRef = useRef<any>(null);
  const provinceRef = useRef<any>(null);
  const zipcodeRef = useRef<any>(null);

  if (!isLoaded) {
    return <Spinner visible={true} />;
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`http://192.168.129.1:5001/api/get/user/${user?.id}`);
        setUserData(res.data);
        if (res.data?.address) {
          setAddress(res.data.address);
          setMiddleName(res.data.personal_details.middleName)
          setPhoneNumber(res.data.personal_details.phone_number)
        }

      } catch (error) {
        console.error(error);
      }
    };

    if (user?.id) getUser();
  }, [user?.id]);

  const onChangeAddress = (field: string, value: string) => {
    setAddress({ ...address, [field]: value });
  };

  const captureImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.75,
      aspect: [4, 4],
      base64: true
    });

    if (!result.canceled) {
      const base64 = `data:image/png;base64,${result.assets[0].base64}`;
      user?.setProfileImage({
        file: base64,
      });
    }
  };

  const onSaveUser = async () => {
    try {
      if (!firstName || !lastName) return;
      setIsLoading(true);
      await user?.update({
        firstName,
        lastName,
      });
      await axios.put("http://192.168.129.1:5001/api/update/name", { user_id: user?.id, firstName, middleName, lastName })
        .then(res => {
          Alert.alert("Update Profile", res.data.message)
        })
        .catch(error => { console.error(error) })
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setEdit(false);
    }
  };

  const onSavePhoneNumber = async () => {
    try {
      if (!phoneNumber) return;
      setIsLoading(true);
      await axios.put(`http://192.168.129.1:5001/api/update/phone_number`, { user_id: user?.id, phone_number: phoneNumber })
        .then(res => {
          Alert.alert("Phone number", res.data.message);
          setEditContact(false)
        })
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setEdit(false);
    }
  };

  const onSaveAddress = async () => {
    try {
      setIsLoading(true);
      if (!address.barangay || !address.municipality || !address.province || !address.zip_code) {
        Alert.alert("Validation Error", "Please fill in all the address fields.");
        return;
      }

      const body = {
        user_id: user?.id,
        address: { ...address },
      };

      await axios.put("http://192.168.129.1:5001/api/update/address", body);
      Alert.alert("Home Address", "Updated successfully.");
      setEditAddress(false);
      setUserData((prev: any) => ({
        ...prev,
        address,
      }));
    } catch (error) {
      alert("Error updating address");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <YStack flex={1}>
      <ScrollView
        flex={1}
        contentContainerStyle={{ justifyContent: "flex-start", alignItems: 'center', gap: "$3" }}
      >
        <Spinner visible={isLoading} />
        <Card elevate alignItems="center" width="90%" padded marginVertical="$3">
          <Avatar padded circular size="$12">
            <Avatar.Image src={user?.imageUrl} objectFit="contain" />
            <Avatar.Fallback delayMs={200} backgroundColor="$blue8" />
          </Avatar>
          {edit ? (
            <YStack width='100%' gap="$2">
              <TouchableOpacity onPress={captureImage}>
                <XStack alignSelf="center" marginTop="$3" alignItems="center" gap="$1">
                  <Image size="$1" color="$blue10" />
                  <SizableText theme="alt1">Change Photo</SizableText>
                </XStack>
              </TouchableOpacity>
              <Paragraph fontWeight={900} marginTop="$2" alignSelf="center">Edit Profile</Paragraph>
              <Input theme="gray" size='$5' placeholder="First Name" value={firstName} onChangeText={setFirstName} />
              <Input theme="gray" size='$5' placeholder="Middle Name" value={middleName} onChangeText={setMiddleName} />
              <Input theme="gray" size='$5' placeholder="Last Name" value={lastName} onChangeText={setLastName} />
              <Button theme='blue_active' onPress={onSaveUser} marginTop="$3">Save</Button>
              <Button theme="red" chromeless onPress={() => { setEdit(false); }}>Cancel</Button>
            </YStack>
          ) : (
            <>
              <TouchableOpacity onPress={() => setEdit(true)}>
                <XStack alignItems="center" gap="$2" marginTop="$3">
                  <Heading size='$7' fontWeight='bold'>{user?.firstName} {middleName} {user?.lastName}</Heading>
                  <PenSquare size="$1" />
                </XStack>
              </TouchableOpacity>
              <Paragraph theme='alt1'>{user?.primaryEmailAddress?.emailAddress}</Paragraph>
              <SizableText size="$1" color='$gray11'>Joined: {user?.createdAt?.toLocaleDateString()}</SizableText>
            </>
          )}
        </Card>

        <Fieldset alignSelf="flex-start" marginHorizontal="$5" gap="$3">
          <XStack alignItems="center" gap="$2" width='100%'>
            <Contact size="$1" />
            <Paragraph size='$5'>Contact Information</Paragraph>
            <XStack flex={1} />
            {editContact ? (
              <XStack gap="$3">
                <Pressable onPress={() => setEditContact(false)}>
                  <SizableText color="$red10">Cancel</SizableText>
                </Pressable>
                <SizableText color="$green10" onPress={onSavePhoneNumber}>SAVE</SizableText>
              </XStack>
            ) : (
              <Pressable onPress={() => setEditContact(true)}>
                <SizableText color="$green10">Edit</SizableText>
              </Pressable>
            )}
          </XStack>
          <Input
            size="$5"
            theme={editContact ? "blue" : "gray"}
            editable={editContact}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </Fieldset>

        <Fieldset alignSelf="flex-start" marginHorizontal="$5" gap="$3">
          <XStack alignItems="center" gap="$2" width='100%'>
            <MapPin size="$1" />
            <Paragraph size='$5'>Home Address</Paragraph>
            <XStack flex={1} />
            {editAddress ? (
              <XStack gap="$3">
                <SizableText color="$red10" onPress={() => setEditAddress(false)}>Cancel</SizableText>
                <SizableText color="$green10" onPress={onSaveAddress}>SAVE</SizableText>
              </XStack>
            ) : (
              <Pressable onPress={() => setEditAddress(true)}>
                <SizableText color="$green10">Edit</SizableText>
              </Pressable>
            )}
          </XStack>
          {editAddress ? (
            <YStack gap="$3">
            <Input
              size="$5"
              value={address.house_number}
              onChangeText={(text) => onChangeAddress("house_number", text)}
              theme="blue"
              placeholder="House Number, Street Name/Village"
              returnKeyType="next" // Show "Next" button on keyboard
              onSubmitEditing={() => barangayRef.current?.focus()} // Focus next input when submitted
              blurOnSubmit={false} // Prevents keyboard from closing on submit
            />
            <Input
              ref={barangayRef}
              size="$5"
              value={address.barangay}
              onChangeText={(text) => onChangeAddress("barangay", text)}
              theme="blue"
              placeholder="Barangay"
              returnKeyType="next"
              onSubmitEditing={() => municipalityRef.current?.focus()}
              blurOnSubmit={false}
            />
            <Input
              ref={municipalityRef}
              size="$5"
              value={address.municipality}
              onChangeText={(text) => onChangeAddress("municipality", text)}
              theme="blue"
              placeholder="City/Municipality"
              returnKeyType="next"
              onSubmitEditing={() => provinceRef.current?.focus()}
              blurOnSubmit={false}
            />
            <Input
              ref={provinceRef}
              size="$5"
              value={address.province}
              onChangeText={(text) => onChangeAddress("province", text)}
              theme="blue"
              placeholder="Province"
              onSubmitEditing={() => zipcodeRef.current?.focus()}
              blurOnSubmit={false}
              returnKeyType="next" // Show "Done" button on the last input
            />
            <Input
              ref={zipcodeRef}
              size="$5"
              value={address.zip_code}
              onChangeText={(text) => onChangeAddress("zip_code", text)}
              theme="blue"
              placeholder="Zip Code"
              keyboardType="numeric"
              returnKeyType="done" // Show "Done" button on the last input
            />
          </YStack>
                    
          ) : (
            <SizableText
              color="$gray9"
              padding="$2"
              borderRadius="$2"
            >
              {userData?.address.province !== "" 
                ? `${userData?.address.house_number} ${userData?.address.barangay} ${userData?.address.municipality} ${userData?.address.province} ${userData?.address.zip_code}`
                : "No address yet."}
            </SizableText>
          )}
        </Fieldset>
      </ScrollView>
    </YStack>
  );
};

export default Profile;
