import React, { useCallback, useState } from "react";
import { theme } from "@/theme/theme";
import { Camera, LogOut } from "@tamagui/lucide-icons";
import { StatusBar } from "expo-status-bar";
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	RefreshControl,
	TouchableOpacity,
} from "react-native";
import {
	Avatar,
	Button,
	Heading,
	ScrollView,
	SizableText,
	View,
	XStack,
} from "tamagui";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "expo-router";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import TextInput from "@/components/TextInput";
import SelectTextInput from "@/components/SelectTextInput";
import LoadingModal from "@/components/LoadingModal";
import CustomButton from "@/components/CustomButton";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import Loading from "@/components/Loading";

const url = process.env.EXPO_PUBLIC_API_URL;

interface IAccount {
	id: string;
	userId: string;
	imageUrl: string;
	studentOrFacultyID: string;
	fullName: string;
	firstName: string;
	lastName: string;
	middleName: string;
	emailAddress: string;
	address: {
		street: string;
		baranggay: string;
		city: string;
		province: string;
	};
	phoneNumber: string;
	birthday: string;
	gender: "male" | "female";
	role: string;
}

const Profile = () => {
	const { user, isLoaded } = useUser();
	const { control, handleSubmit, setValue, getValues, formState } =
		useForm<IAccount>({});
	const { signOut } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [edit, setEdit] = useState(true);
	const scale = useSharedValue(1);
	const [data, setData] = useState<IAccount>();
	const [refreshing, setRefreshing] = useState(false);

	useFocusEffect(
		useCallback(() => {
			const getAccount = async () => {
				try {
					const response = await axios.get(`${url}/account/get`, {
						params: { userId: user?.id },
					});
					const account: IAccount | any = response.data;
					setData(response.data);

					Object.keys(account).forEach((key) => {
						setValue(key as keyof IAccount, account[key]);
					});
				} catch (error) {
					console.log(JSON.stringify(error));
				}
			};

			getAccount();
		}, [])
	);

	if (!isLoaded) return null;

	const captureImage = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				quality: 0.75,
				aspect: [4, 4],
				base64: true,
			});

			if (!result.canceled) {
				setIsLoading(true);
				const base64 = `data:image/png;base64,${result.assets[0].base64}`;
				await user?.setProfileImage({
					file: base64,
				});
			}
		} catch (error) {
			Alert.alert("Error", "Error uploading photo.");
		} finally {
			setIsLoading(false);
		}
	};

	const editProfile = () => {
		setEdit(!edit);
	};

	const confirmLogout = () => {
		Alert.alert(
			"Logout",
			"Are you sure you want to log out?",
			[
				{ text: "No", style: "cancel" },
				{ text: "Yes", onPress: logout },
			],
			{ cancelable: true }
		);
	};

	const logout = async () => {
		try {
			await signOut();
			console.log("Logout successful");
		} catch (error) {
			console.error("Error during logout:", error);
			Alert.alert(
				"Error",
				"An error occurred while logging out. Please try again."
			);
		}
	};

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	const handlePressIn = () => {
		scale.value = withSpring(0.95, { stiffness: 500 });
	};

	const handlePressOut = () => {
		scale.value = withSpring(1, { stiffness: 500 }); // Smooth bounce out
	};

	const updateProfileAlert = () => {
		Alert.alert(
			"Update Profile",
			"Are you sure you want to update your profile?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Yes",
					onPress: () => {
						handleSubmit(updateProfileConfirm)();
					},
				},
			],
			{ cancelable: false }
		);
	};

	//UPDATE PROFILE
	const updateProfileConfirm: SubmitHandler<any> = async (data: any) => {
		setIsLoading(true);
		try {
			await axios.put(`${url}/account/update`, {
				...data,
				userId: user?.id,
			});
			Alert.alert("Success", "Profile updated successfully.");
			setEdit(!edit);
		} catch (error) {
			console.error("Error updating profile:", error);
			Alert.alert(
				"Error",
				"An error occurred while updating profile. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const refreshPage = async () => {
		setRefreshing(true);
		try {
			const response = await axios.get(`${url}/account/get`, {
				params: { userId: user?.id },
			});
			setData(response.data);
			const account: IAccount | any = response.data;

			Object.keys(account).forEach((key) => {
				setValue(key as keyof IAccount, account[key]);
			});
		} catch (error) {
			Alert.alert(
				"Error",
				"An error occurred while fetching account details."
			);
		}
		setRefreshing(false);
	};

	if (!data) return <Loading />;
	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
		>
			<ScrollView
				flex={1}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={() => {
							refreshPage();
						}}
					/>
				}
			>
				<View padding={"$5"} alignItems="center" width={"100%"}>
					<View position="relative">
						<Avatar circular size="$10">
							<Avatar.Image src={user?.imageUrl} />
							<Avatar.Fallback
								backgroundColor={theme.cyan5}
								delayMs={1000}
							/>
						</Avatar>
						<TouchableOpacity
							onPress={captureImage}
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
					<Heading mt="$4">{`${data?.fullName}`}</Heading>
					<SizableText color="$gray10">
						{user?.primaryEmailAddress?.emailAddress}
					</SizableText>
				</View>
				<View padding="$5">
					<XStack
						alignItems="center"
						justifyContent="space-between"
						width={"100%"}
					>
						<SizableText>Personal Information</SizableText>
						<SizableText
							color={edit ? theme.cyan10 : "$red10"}
							onPress={editProfile}
						>
							{edit ? "Edit Profile" : "Cancel"}
						</SizableText>
					</XStack>
					<TextInput
						disabled
						control={control}
						name="studentOrFacultyID"
						label="School ID"
					/>
					<TextInput
						disabled={edit}
						control={control}
						name="firstName"
						label="First Name"
					/>
					<TextInput
						disabled={edit}
						control={control}
						name="middleName"
						label="Middle Name"
					/>
					<TextInput
						disabled={edit}
						control={control}
						name="lastName"
						label="Last Name"
					/>
					<SelectTextInput
						disabled={edit}
						control={control}
						name="gender"
						label="Gender"
						options={[
							{ label: "Male", value: "male" },
							{ label: "Female", value: "female" },
						]}
					/>
					<TextInput
						disabled={edit}
						control={control}
						name="birthday"
						label="Birthday"
						left={"calendar-outline"}
					/>
					<TextInput
						disabled={edit}
						control={control}
						name="phoneNumber"
						label="Phone Number"
						left={"phone-outline"}
					/>
					<SizableText mt="$4">Address</SizableText>
					<TextInput
						disabled={edit}
						control={control}
						name="address.street"
						label="House No./Street Name/Lot Blk."
					/>
					<TextInput
						disabled={edit}
						control={control}
						name="address.baranggay"
						label="Barangay"
					/>
					<TextInput
						disabled={edit}
						control={control}
						name="address.city"
						label="City or Municipality"
					/>
					<TextInput
						disabled={edit}
						control={control}
						name="address.province"
						label="Province"
					/>
				</View>
				{!edit && (
					<CustomButton
						marginVertical="$3"
						marginHorizontal="$5"
						onPress={updateProfileAlert}
						buttonText="Update Profile"
					/>
				)}
				<Animated.View style={animatedStyle}>
					<Button
						width="90%"
						alignSelf="center"
						backgroundColor="$red10"
						color="white"
						icon={LogOut}
						onPressIn={handlePressIn}
						onPressOut={handlePressOut}
						onPress={confirmLogout}
						pressStyle={{ backgroundColor: "$red10" }}
						borderWidth={0}
						mb="$5"
					>
						Logout
					</Button>
				</Animated.View>
			</ScrollView>
			<LoadingModal
				isVisible={isLoading}
				text="Updating profile..."
				setIsVisible={setIsLoading}
			/>
			<StatusBar style="light" />
		</KeyboardAvoidingView>
	);
};

export default Profile;
