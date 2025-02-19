import Loading from "@/components/Loading";
import { SERVER } from "@/constants/link";
import { SelectRecord } from "@/interfaces/select-record";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { router, useGlobalSearchParams } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { RefreshControl, TouchableNativeFeedback } from "react-native";
import { Avatar, ListItem, ScrollView, SizableText } from "tamagui";
import {View as RNView} from 'react-native'
import { ChevronRight, PlusCircle } from "@tamagui/lucide-icons";

const MyPatients = () => {
	const { user } = useUser();
	const { moduleId } = useGlobalSearchParams();
	const [records, setRecords] = useState<SelectRecord[] | null>(null);
	const [refreshing, setRefreshing] = useState(false);
	useEffect(() => {
		fetchData();
	}, [user?.id]);

	const fetchData = async () => {
		try {
			const { data } = await axios.get(`${SERVER}/record/get/all`, {
				params: { clinicianId: user?.id },
			});
			setRecords(data);
		} catch (error: any) {
			setRecords(error.response.data.message);
		}
	};

	const refreshPage = async () => {};

	const submitRecord = async (recordId: string) => {
		try {
			const body = {
				moduleId: moduleId,
				clinicianId: user?.publicMetadata._id,
				recordId: recordId,
			};
			const { data } = await axios.post(`${SERVER}/submission/new`);
			console.log(data);
			router.back();
		} catch (error: any) {
			console.log(error.response.data.message);
		}
	};

	if (!records) {
		return <Loading />;
	}

	return (
		<ScrollView
			flex={1}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={refreshPage}
				/>
			}
			contentContainerStyle={{ backgroundColor: "white" }}
		>
			{!records && <SizableText padding="$4">{records}</SizableText>}
			{records &&
				records.map((record, index) => {
					const fullName = [
						record?.patientId.firstName,
						record?.patientId.middleName,
						record?.patientId.lastName,
					]
						.filter(Boolean)
						.join(" ");
					return (
						<RNView key={record._id}>
							<TouchableNativeFeedback
								background={TouchableNativeFeedback.Ripple(
									"#ccc",
									false
								)}
								onPress={() =>
									alert("submit")
								}
							>
								<ListItem
									backgroundColor={"$background0"}
									icon={
										<Avatar size={"$4"} circular>
											<Avatar.Image
												src={record.patientId.imageUrl}
											/>
										</Avatar>
									}
                                    title={fullName}
									subTitle={`added ${moment(
										record?.createdAt
									).startOf('s').fromNow()}`}
									iconAfter={PlusCircle}
								/>
							</TouchableNativeFeedback>
						</RNView>
					);
				})}
		</ScrollView>
	);
};

export default MyPatients;
