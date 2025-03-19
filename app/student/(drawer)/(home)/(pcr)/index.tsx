import { Calendar, Camera, UserRound } from "@tamagui/lucide-icons";
import { StatusBar } from "expo-status-bar";
import React, {
	Dispatch,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import { Alert, Platform, TouchableOpacity } from "react-native";
import { Avatar, Card, ScrollView, SizableText, View } from "tamagui";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "@clerk/clerk-expo";
import DateTimePicker from "react-native-modal-datetime-picker";
import { SubmitHandler, useForm } from "react-hook-form";
import TextInput from "@/components/TextInput";
import { SERVER } from "@/constants/link";
import axios from "axios";
import { router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { KeyboardAvoidingView } from "react-native";
import SelectTextInput from "@/components/SelectTextInput";
import LoadingModal from "@/components/LoadingModal";
import { pickImage, uploadImage } from "@/constants/uploadService";
import moment from "moment";

interface FormData {
	firstName: string;
	middleName: string;
	lastName: string;
	gender: string;
	age: number;
	civilStatus: string;
	occupationOrCourse: string;
	hobbiesOrAvocation: string;
	contactInformation: {
		fullAddress: string;
		emailAddress: string;
		mobile: string;
	};
}

const gender = [
	{ label: "Male", value: "male" },
	{ label: "Female", value: "female" },
];

const civilStatus = [
	{ value: "single", label: "Single" },
	{ value: "married", label: "Married" },
	{ value: "divorced", label: "Divorced" },
	{ value: "separated", label: "Separated" },
	{ value: "widowed", label: "Widowed" },
];

const Demographic: React.FC = () => {
	const { control, handleSubmit } = useForm<FormData>({
		defaultValues: { middleName: "" },
	});
	const { user } = useUser();
	const [uploading, setUploading] = useState(false);
	const [imageUri, setImageUri] = useState("");
	const [datePickerVisible, setDatePickerVisible] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	const inputRefs = useRef<any>(
		Array.from({ length: 5 }, () => React.createRef())
	);

	useEffect(() => {
		(async () => {
			if (
				Platform.OS !== "web" &&
				(await ImagePicker.getMediaLibraryPermissionsAsync()).status !==
					"granted"
			) {
				await ImagePicker.requestMediaLibraryPermissionsAsync();
			}
		})();
	}, []);

	const focus = (index: number) => {
		inputRefs.current[index].current.focus();
	};

	const onSubmit: SubmitHandler<FormData> = async (data) => {
		setUploading(true);
		let downloadURL: any;
		try {
			// Upload image if imageUri exists
			if (imageUri) {
				downloadURL = await uploadImage(imageUri).then(() => {});
			}

			// Prepare patient data to send
			const patientData = {
				...data,
				addedBy: user?.id,
				birthdate: selectedDate?.toISOString(),
				...(downloadURL && { imageUrl: downloadURL }),
			};

			// Make both requests concurrently
			const [uploadResponse, patientResponse] = await Promise.all([
				imageUri ? uploadImage(imageUri) : Promise.resolve(null),
				axios.post(`${SERVER}/patient/add`, patientData),
			]);

			console.log(patientResponse.data._id);

			// Show success alert
			Alert.alert(
				"New patient added!",
				"Would you like to proceed to the preliminary examination now?",
				[
					{
						text: "Later",
						style: "cancel",
						onPress: () => router.back(),
					},
					{
						text: "Yes",
						onPress: () => {
							router.replace({
								pathname:
									"/student/(drawer)/(home)/(pcr)/eye-triage",
								params: { _patientId: patientResponse.data?._id },
							});
						},
					},
				]
			);

			// Reset imageUri after submission
			setImageUri("");
		} catch (error) {
			Alert.alert("An error occured", "Please try again later.");
			console.error(JSON.stringify(error, null, 2));
		} finally {
			setUploading(false);
		}
	};

	const handleConfirm = (date: Date) => {
		setSelectedDate(date);
		setDatePickerVisible(false);
	};

	return (
		<>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
				keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 80}
			>
				<ScrollView flex={1} contentContainerStyle={{ gap: "$2" }}>
					<View padding="$5">
						<SizableText color={"$gray10"} mb="$2">
							PATIENT PHOTO
						</SizableText>
						<View position="relative" alignSelf="center">
							<Avatar
								circular
								size="$10"
								backgroundColor={"$gray3"}
							>
								{imageUri ? (
									<Avatar.Image src={imageUri} />
								) : (
									<UserRound />
								)}
							</Avatar>
							<TouchableOpacity
								onPress={() => pickImage(setImageUri)}
								style={{
									position: "absolute",
									bottom: 0,
									right: -5,
									backgroundColor: "white",
									borderRadius: 20,
									padding: 5,
									shadowColor: "#000",
									shadowOffset: { width: 0, height: 2 },
									shadowOpacity: 0.3,
									shadowRadius: 3,
									elevation: 5,
								}}
							>
								<Camera size={20} color="black" />
							</TouchableOpacity>
						</View>
					</View>
					<View padding="$5">
						<SizableText color={"$gray11"}>
							DEMOGRAPHIC DATA
						</SizableText>
						<TextInput
							control={control}
							name="firstName"
							label="First Name"
							placeholder="Enter first name"
							required
							onSubmitEditing={() => focus(0)}
						/>
						<TextInput
							name="middleName"
							control={control}
							label="Middle Name"
							placeholder="Enter middle name"
							ref={inputRefs.current[0]}
							onSubmitEditing={() => focus(1)}
						/>
						<TextInput
							name="lastName"
							control={control}
							label="Last Name"
							placeholder="Enter last name"
							required
							ref={inputRefs.current[1]}
						/>
						<SelectTextInput
							name="gender"
							control={control}
							label="Gender"
							options={gender}
							placeholder="Select gender"
							required
						/>
						<SizableText mt="$4">
							Birthday<SizableText color={"red"}>*</SizableText>
						</SizableText>
						<Card
							size={"$3"}
							flexDirection="row"
							alignItems="center"
							justifyContent="space-between"
							bordered
							borderRadius={"$4"}
							backgroundColor={"white"}
							onPress={() => setDatePickerVisible(true)}
							paddingVertical="$2.5"
							paddingHorizontal="$3.5"
							pressTheme
						>
							{selectedDate ? (
								<SizableText>
									{moment(selectedDate).format(
										"MMMM D, YYYY"
									)}
								</SizableText>
							) : (
								<SizableText color={"$gray10"}>
									Enter birthday
								</SizableText>
							)}
							<Calendar color={"$gray10"} />
						</Card>
						{!selectedDate && (
							<SizableText color={"red"} size={"$2"} ml="$2">
								Please select a date
							</SizableText>
						)}
						<DateTimePicker
							date={selectedDate || new Date()}
							isVisible={datePickerVisible}
							mode="date"
							onConfirm={handleConfirm}
							onCancel={() => setDatePickerVisible(false)}
							maximumDate={new Date()}
							display="spinner"
						/>
						<SelectTextInput
							name="civilStatus"
							control={control}
							label="Civil Status"
							options={civilStatus}
							placeholder="Select civil status"
							required
						/>
						<TextInput
							name="occupationOrCourse"
							control={control}
							label="Occupation/Course"
							placeholder="Enter occupation/course"
							required
							onSubmitEditing={() => focus(2)}
						/>
						<TextInput
							name="hobbiesOrAvocation"
							control={control}
							label="Hobbies/Avocation"
							placeholder="Enter hobbies/avocation"
							required
							ref={inputRefs.current[2]}
						/>
					</View>
					<View padding="$5">
						<SizableText color={"$gray10"}>
							CONTACT INFORMATION
						</SizableText>
						<TextInput
							name="contactInformation.fullAddress"
							control={control}
							label="Full Address"
							placeholder="Enter full address"
							required
							onSubmitEditing={() => focus(3)}
						/>
						<TextInput
							name="contactInformation.emailAddress"
							control={control}
							label="Email Address"
							placeholder="exampl@gmail.com"
							type="email-address"
							required
							ref={inputRefs.current[3]}
							onSubmitEditing={() => focus(4)}
						/>
						<TextInput
							masked
							mask="9999 999 9999"
							name="contactInformation.mobile"
							control={control}
							label="Mobile Number"
							placeholder="Enter mobile number"
							type="phone-pad"
							required
							ref={inputRefs.current[4]}
						/>
					</View>
					<View paddingHorizontal="$5" paddingVertical="$3">
						<CustomButton
							onPress={handleSubmit(onSubmit)}
							buttonText={"Save"}
						/>
					</View>
					<StatusBar style="light" />
				</ScrollView>
			</KeyboardAvoidingView>
			<LoadingModal text="Adding new patient..." isVisible={uploading} />
		</>
	);
};

export default Demographic;
