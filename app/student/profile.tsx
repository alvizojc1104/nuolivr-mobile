import { useUser } from "@clerk/clerk-expo";
import Spinner from "react-native-loading-spinner-overlay";
import { Avatar, Button, Card, Heading, SizableText, View } from "tamagui";
import { Alert, ToastAndroid, TouchableOpacity } from "react-native";
import { Camera } from "@tamagui/lucide-icons"; // You can replace this with any other icon if preferred
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";

const Profile = () => {
  const { isLoaded, user } = useUser();
  const [loading, setLoading] = useState(false);
  if (!isLoaded) {
    return <Spinner visible={true} />;
  }

  const showToast = () => {
    ToastAndroid.showWithGravityAndOffset(
      'Profile photo changed successfully!',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };


  const captureImage = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.75,
        aspect: [4, 4],
        base64: true,
      });

      if (!result.canceled) {
        setLoading(true);
        const base64 = `data:image/png;base64,${result.assets[0].base64}`;
        await user?.setProfileImage({
          file: base64,
        });
        showToast()
      }
    } catch (error) {
      Alert.alert("Error", "Error uploading photo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View flex={1} padding="$3" gap="$3">
      <Spinner visible={loading} />
      <Card padded elevate alignItems="center">
        <View position="relative">
          <Avatar circular size="$10">
            <Avatar.Image src={user?.imageUrl} />
            <Avatar.Fallback backgroundColor="$yellow10" delayMs={200} />
          </Avatar>
          <TouchableOpacity
            onPress={captureImage}
            style={{
              position: 'absolute',
              bottom: 0,
              right: -5,
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
              elevation: 5,
            }}
          >
            <Camera size={20} color="black" />
          </TouchableOpacity>
        </View>
        <Heading>{user?.fullName}</Heading>
        <SizableText>College of Optometry</SizableText>
        <SizableText theme="alt1" size="$2">{user?.primaryEmailAddress?.emailAddress}</SizableText>
        <SizableText size="$2" color="$gray9">Joined {user?.createdAt?.toDateString()}</SizableText>
      </Card>
      <Button theme="active">Edit Profile</Button>
    </View>
  );
};

export default Profile;
