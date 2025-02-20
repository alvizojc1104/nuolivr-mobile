import CustomButton from "@/components/CustomButton";
import Loading from "@/components/Loading";
import { SERVER } from "@/constants/link";
import useStore from "@/hooks/useStore";
import { useUser } from "@clerk/clerk-expo";
import { Plus } from "@tamagui/lucide-icons";
import axios from "axios";
import { router, useGlobalSearchParams, useNavigation } from "expo-router";
import moment from "moment";
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
		return () => { };
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
			console.log(data.submissions[0])
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
				{submissions && submissions.length > 0 ? (
					submissions.map((submission) => (
						<View
							key={submission._id}
							padding={"$5"}
							borderBottomWidth={1}
							borderBottomColor={"gray.gray10"}
						>
							<SizableText>{submission._id}</SizableText>
							<SizableText>{submission.status}</SizableText>
							<SizableText>Submitted: {moment(submission.createdAt).format('MMM D YYYY')}</SizableText>
						</View>
					))
				) :
					<Loading />}
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
