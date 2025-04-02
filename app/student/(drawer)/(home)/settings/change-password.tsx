import CustomButton from "@/components/CustomButton";
import LoadingModal from "@/components/LoadingModal";
import TextInputPassword from "@/components/TextInputPassword";
import api from "@/utils/axios";
import { useUser } from "@clerk/clerk-expo";
import { PenLine } from "@tamagui/lucide-icons";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import { ScrollView, SizableText, View, YStack } from "tamagui";

const ChangePassword = () => {
	const [showPassword, setShowPassword] = useState(true);
	const { user } = useUser();
	const form = useForm<{ newPassword: string; confirmNewPassword: string }>({
		defaultValues: {
			newPassword: "",
			confirmNewPassword: "",
		},
	});

	const updatePassword = useMutation({
		mutationKey: ["updatePassword"],
		mutationFn: async (data: {
			newPassword: string;
			confirmNewPassword: string;
		}) => {
			const body = {
				password: data.newPassword,
				userId: user?.id,
			};
			await api.put(`/account/reset-password`, body);
			console.log(data);
			return data;
		},
		onSuccess: () => {
			Alert.alert(
				"Success",
				"Your password has been updated successfully.",
				[
					{
						text: "OK",
						onPress: () => {
							router.back();
						},
					},
				]
			);
		},
		onError: (error) => {
			// Handle error, e.g., show an error message
			console.error(
				"Error updating password:",
				JSON.stringify(error, null, 2)
			);
		},
	});

	const onSubmit = (data: {
		newPassword: string;
		confirmNewPassword: string;
	}) => {
		if (data.newPassword !== data.confirmNewPassword) {
			Alert.alert("Error", "Passwords do not match.");
			return;
		}
		updatePassword.mutate(data);
	};

	const confirmUpdatePassword = () => {
		Alert.alert(
			"Confirm Update Password",
			"Are you sure you want to update your password?",
			[
				{ text: "Cancel", style: "cancel" },
				{ text: "OK", onPress: () => form.handleSubmit(onSubmit)() },
			],
			{ cancelable: true }
		);
	};
	return (
		<ScrollView
			flex={1}
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<View padding="$4" flexGrow={1}>
				<SizableText size="$4" marginBottom="$1">
					Please enter your new password and confirm it below.
				</SizableText>
				<YStack gap="$1">
					<TextInputPassword
						name="newPassword"
						control={form.control}
						placeholder="Enter new password"
						label="New Password"
						left="lock-outline"
						right={showPassword ? "eye-off-outline" : "eye-outline"}
						secure={showPassword}
						secureFunction={() => setShowPassword(!showPassword)}
						rules={{
							required: "Password is required",
							minLength: {
								value: 8,
								message:
									"Password must be at least 8 characters",
							},
							pattern: {
								value: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
								message:
									"Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
							},
						}}
					/>
					<TextInputPassword
						name="confirmNewPassword"
						control={form.control}
						placeholder="Re-enter new password"
						label="Confirm New Password"
						left="lock-outline"
						right={showPassword ? "eye-off-outline" : "eye-outline"}
						secure={showPassword}
						secureFunction={() => setShowPassword(!showPassword)}
						rules={{
							required: "Password is required",
						}}
						compare={"newPassword"}
						getValues={form.getValues}
					/>
				</YStack>
				<CustomButton
					buttonText="Update Password"
					onPress={confirmUpdatePassword}
					marginTop="$4"
					iconAfter={PenLine}
				/>
			</View>
			<LoadingModal
				isVisible={updatePassword.isPending}
				text="Updating your password..."
			/>
		</ScrollView>
	);
};

export default ChangePassword;
