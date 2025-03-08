import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { SERVER } from "./link";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

export const baseImageOS = `${SERVER}/uploads/images/9fb5a49c-16e9-4380-b020-3e95ac8d7725.png`;
export const baseImageOD = `${SERVER}/uploads/images/de565f96-ddc0-4259-bab7-723ec9317f46.png`;
export const uploadImage = async (uri: string) => {
  const fileName = uri.split("/").pop(); // Get filename from path
  console.log("Uploading file:", fileName);

  // Ensure correct MIME type based on file extension
  const mimeType = fileName?.endsWith(".png") ? "image/png" : "image/jpeg";

  const formData = new FormData();
  formData.append("file", {
    uri,
    name: fileName,
    type: mimeType,
  } as any);

  try {
    const { data } = await axios.post(`${SERVER}/upload/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Upload successful:", data.fileUrl);
    return data.fileUrl;
  } catch (error) {
    console.error("Upload error:", error);
    Alert.alert("Upload Failed", "Something went wrong!");
  }
};

export const pickImage = async (
  setImageUri: Dispatch<SetStateAction<string>>
) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.7,
    aspect: [1, 1],
  });

  if (!result.canceled) {
    setImageUri(result.assets[0].uri);
  }
};
