import CustomButton from "@/components/CustomButton";
import { SERVER } from "@/constants/link";
import { Plus } from "@tamagui/lucide-icons";
import axios from "axios";
import { router, useGlobalSearchParams, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, SizableText, View } from "tamagui";

const Submissions: React.FC = () => {
	const { moduleId } = useGlobalSearchParams();
	const [submissions, setSubmissions] = React.useState<any[] | null>(null);
	
  const submitNew = () => {
		router.push("/student/module/select-record");
	};

	return (
		<>
			<ScrollView flex={1}></ScrollView>
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
