import { Alert, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { SERVER } from "@/constants/link";
import Loading from "@/components/Loading";
import Modules from "@/components/Modules";
import { ScrollView, SizableText, View } from "tamagui";
import { router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { Plus } from "@tamagui/lucide-icons";
import useStore from "@/hooks/useStore";
import { useQuery } from "@tanstack/react-query";

export interface IModule {
	_id: string;
	addedDate: string;
	id: {
		_id: string;
		createdBy: string;
		name: string;
		acronym: string;
	};
	icon: string;
	onPress: () => void;
}

const Module = () => {
	const { user, isLoaded } = useUser();
	const [refreshing, setRefreshing] = useState(false);
	const { setSelectedModuleId, clearSelectedModuleId } = useStore();
	const modulesQuery = useQuery({
		queryKey: ["modules", user?.id],
		queryFn: async () => {
			const response = await axios.get(
				`${SERVER}/account/module?id=${user?.id}`
			);
			return response.data.modules as IModule[];
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!user,
	});

	useEffect(() => {
		return () => {
			clearSelectedModuleId();
		};
	}, []);

	if (!isLoaded) {
		return;
	}

	const openModule = (id: string, name: string, acronym: string) => {
		setSelectedModuleId(id);
		router.push({
			pathname: `/student/module/[moduleId]`,
			params: { moduleName: name, iconText: acronym, moduleId: id },
		});
	};

	const refreshPage = async () => {
		setRefreshing(true);
		modulesQuery.refetch();
		setRefreshing(false);
	};

	if (modulesQuery.isLoading) {
		return <Loading />;
	}

	return (
		<View flex={1} backgroundColor={"white"}>
			<ScrollView
				flex={1}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={refreshPage}
					/>
				}
			>
				{modulesQuery.data?.length === 0 && (
					<View
						alignItems="center"
						justifyContent="center"
						flex={1}
						padding="$5"
					>
						<SizableText textAlign="center" color={"gray"}>
							You have no modules yet. Ask your faculty or join a
							module by using a join code.
						</SizableText>
					</View>
				)}
				{modulesQuery.data &&
					modulesQuery.data.length > 0 &&
					modulesQuery.data.map((item, index) => {
						return (
							<View key={index}>
								<Modules
									name={item.id.name}
									iconText={item.id.acronym}
									onPress={() =>
										openModule(
											item.id._id,
											item.id.name,
											item.id.acronym
										)
									}
								/>
							</View>
						);
					})}
			</ScrollView>
			<View position="absolute" bottom={"$5"} right="$5">
				<CustomButton
					buttonText="Join"
					iconAfter={Plus}
					onPress={() => Alert.alert("Join module")}
				/>
			</View>
		</View>
	);
};

export default Module;
