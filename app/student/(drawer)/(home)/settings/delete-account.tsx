import CustomButton from "@/components/CustomButton";
import DestructiveButton from "@/components/DestructiveButton";
import LoadingModal from "@/components/LoadingModal";
import TextInput from "@/components/TextInput";
import api from "@/utils/axios";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Trash } from "@tamagui/lucide-icons";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Alert } from "react-native";
import { SizableText, View } from "tamagui";

const DeleteAccount = () => {
	const { user } = useUser();
	const { signOut } = useAuth();
	const form = useForm<{ email: string }>({
		defaultValues: {
			email: "",
		},
	});

	const deleteAccount = useMutation({
		mutationKey: ["deleteAccount"],
		mutationFn: async () => {
			await api.delete(`/account/delete?id=${user?.publicMetadata?._id}`);
		},
		onSuccess: async () => {
			await signOut();
			Alert.alert(
				"Success",
				"Your account has been deleted temporarily for 30 days. Please contact the administrator if you wish to restore your account within this period."
			);
		},
		onError: (error) => {
			Alert.alert(
				"Error",
				"An error occurred while deleting your account. Please try again later."
			);
			console.log(JSON.stringify(error, null, 2));
		},
	});

	const confirmDelete = () => {
		if (
			form.getValues("email") !== user?.primaryEmailAddress?.emailAddress
		) {
			Alert.alert(
				"Invalid Email",
				"The email address you entered does not match your account email address.",
				[
					{
						text: "OK",
					},
				]
			);
			return;
		}

		Alert.alert(
			"Confirm Delete",
			"Are you sure you want to delete your account? This action cannot be undone.",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					onPress: () => form.handleSubmit(onSubmit)(),
				},
			]
		);
	};

	const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
		await deleteAccount.mutateAsync();
	};
	return (
		<View
			flex={1}
			justifyContent="flex-start"
			alignItems="flex-start"
			padding="$4"
		>
			<SizableText fontSize="$5">
				Are you sure you want to delete your account?
			</SizableText>
			<SizableText fontSize="$3" color={"$gray10"} marginTop="$2">
				Deleting your account will result in the temporary removal of
				all your data for 30 days. If you wish to restore your account
				within this period, please contact the administrator. Proceed
				with caution as this action is irreversible after 30 days.
			</SizableText>
			<SizableText
				fontSize="$3"
				color={"$gray10"}
				marginTop="$4"
				marginBottom="$2"
			>
				You will need to type your email address to confirm this action.
			</SizableText>
			<TextInput
				control={form.control}
				name="email"
				label="Type your email address to confirm"
			/>
			<View width={"100%"} marginTop="$4">
				<DestructiveButton
					onPress={confirmDelete}
					text="Delete my account"
					disabled={!form.formState.isValid}
					theme={"red_active"}
					icon={Trash}
				/>
			</View>
			<LoadingModal
				isVisible={deleteAccount.isPending}
				text="Deleting your account..."
			/>
		</View>
	);
};

export default DeleteAccount;
