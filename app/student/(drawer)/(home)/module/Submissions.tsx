import CustomButton from "@/components/CustomButton";
import Loading from "@/components/Loading";
import { SERVER } from "@/constants/link";
import useStore from "@/hooks/useStore";
import { useUser } from "@clerk/clerk-expo";
import { Plus } from "@tamagui/lucide-icons";
import axios from "axios";
import { router, useGlobalSearchParams, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { Alert } from "react-native";
import { ScrollView, SizableText, View } from "tamagui";

const Submissions: React.FC = () => {
	const [submissions, setSubmissions] = React.useState<any[] | null>(null);
	const { user } = useUser();
	const { moduleId } = useGlobalSearchParams();
	console.log(moduleId);
	useEffect(() => {
		fetchSubmissions();
		return () => {};
	}, []);

	const fetchSubmissions = async () => {
		try {
			const { data } = await axios.get(`${SERVER}/submissions`, {
				params: {
					moduleId: moduleId,
					clinicianId: user?.publicMetadata._id,
				},
			});
			setSubmissions(data.submissions);
		} catch (error: any) {
			Alert.alert("Error", error.response.data.message);
			console.error(error.response.data.message);
		}
	};
	const submitNew = () => {
		router.push("/student/module/select-record");
	};

	return (
		<>
			<ScrollView flex={1}>
				{!submissions && <Loading />}
				{submissions && submissions.length > 0 ? (
					submissions.map((submission) => (
						<View
							key={submission._id}
							padding={"$5"}
							borderBottomWidth={1}
							borderBottomColor={"gray.gray10"}
						>
							<SizableText>{submission._id}</SizableText>
						</View>
					))
				) : (
					<View
						flex={1}
						justifyContent={"center"}
						alignItems={"center"}
					>
						<SizableText>You have no submissions yet.</SizableText>
					</View>
				)}
			</ScrollView>
			<CustomButton
				position="absolute"
				bottom={"$5"}
				right={"$5"}
				onPress={submitNew}
				buttonText="Submit new"
				iconAfter={<Plus color={"white"} />}
			/>
		</>
	);
};

export default Submissions;
