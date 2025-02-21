import React, { useCallback, useEffect, useState } from "react";
import {
	Bell,
	ChevronRight,
	ClipboardList,
	Pen,
	Pill,
	Plus,
	Sun,
	User,
	UsersRound,
} from "@tamagui/lucide-icons";
import { Href, Link, router, useFocusEffect } from "expo-router";
import {
	Pressable,
	RefreshControl,
	TouchableNativeFeedback,
	useColorScheme,
	View as RNView,
} from "react-native";
import { Card, Circle, ListItem, ScrollView, Separator, YGroup } from "tamagui";
import { Avatar, Heading, SizableText, View, XStack, YStack } from "tamagui";
import { darkTheme, theme } from "@/theme/theme";
import { StatusBar } from "expo-status-bar";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useUser } from "@clerk/clerk-expo";
import { usePatientList } from "@/hooks/usePatientList";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "@/components/Loading";

const Module = (props: { href: Href; label: string; icon: any }) => {
	return (
		<TouchableNativeFeedback onPress={() => router.push(props.href)}>
			<YStack
				alignItems="center"
				justifyContent="center"
				padding="$1"
				flex={1}
				width={100}
			>
				<Circle borderWidth={1} borderColor={"$gray10"} padded>
					{props.icon}
				</Circle>
				<SizableText marginTop="$2">{props.label}</SizableText>
			</YStack>
		</TouchableNativeFeedback>
	);
};

const Home = () => {
	const navigation = useNavigation();
	const { user } = useUser();
	const { patients, fetchPatients } = usePatientList();
	const [refreshing, setRefreshing] = useState(false);
	const [disable, setDisable] = useState(false);

	useEffect(() => {
		if (!patients) {
			refreshPage();
		}
		setDisable(false);
	}, []);

	const refreshPage = async () => {
		setRefreshing(true);
		await fetchPatients(user?.id);
		setRefreshing(false);
	};

	const viewPatient = (patientId: string, patientName: string) => {
		router.push({
			pathname: `/student/patient/[patient_id]`,
			params: { patient_id: patientId, patientName: patientName },
		});
	};

	const openDrawer = () => {
		navigation.dispatch(DrawerActions.openDrawer());
	};
	const navigate = (href: Href<string>) => {
		router.push(href);
	};

	if (!patients) {
		return <Loading />;
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<XStack alignItems="center" pt="$4" pb="$2" paddingHorizontal="$5">
				<Avatar>
					<Avatar.Image
						src={require("@/assets/images/logo.png")}
						objectFit="contain"
					/>
				</Avatar>
				<XStack flex={1} />
				<Pressable onPress={() => navigate("/student/notifications")}>
					<Bell />
				</Pressable>
				<Pressable onPress={openDrawer} style={{ marginLeft: 20 }}>
					<Avatar circular>
						<Avatar.Image src={user?.imageUrl} />
					</Avatar>
				</Pressable>
			</XStack>
			<ScrollView
				contentContainerStyle={{ gap: "$5", paddingTop: "$5" }}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={refreshPage}
					/>
				}
			>
				<YStack paddingHorizontal="$5">
					<XStack alignItems="center" gap="$2">
						<Sun size={"$1"} color={theme.cyan10} />
						<SizableText
							size={"$1"}
							color={theme.cyan10}
							textTransform="uppercase"
						>
							{moment(new Date()).format("dddd, MMMM D")}
						</SizableText>
					</XStack>
					<Heading size={"$9"}>Overview</Heading>

					<XStack gap="$3" mt="$3">
						<Card bordered padded flex={1}>
							<SizableText>Patients</SizableText>
							<SizableText size={"$6"} fontWeight={900}>
								{patients ? patients.length : 0}
							</SizableText>
						</Card>
						<Card bordered padded flex={1}>
							<SizableText>Prescriptions</SizableText>
							<SizableText size={"$6"} fontWeight={900}>
								0
							</SizableText>
						</Card>
					</XStack>
				</YStack>
				<XStack gap="$2" paddingHorizontal="$5">
					<Module
						href={"/student/(pcr)"}
						label="Add patient"
						icon={<Plus />}
					/>
					<Module
						href={"/student/patients"}
						label="My Patients"
						icon={<ClipboardList />}
					/>
					<Module
						href={"/student/module/"}
						label="Modules"
						icon={<UsersRound />}
					/>
				</XStack>
				<XStack
					alignItems="center"
					justifyContent="space-between"
					mb="$2"
					paddingHorizontal="$5"
				>
					<SizableText fontSize={"$5"}>Recently added</SizableText>
					<Link href={"/student/patients"}>
						<SizableText color={theme.cyan10}>
							{"See all"}
						</SizableText>
					</Link>
				</XStack>
				{patients?.length || 0 > 0 ? (
					<View>
						{patients
							?.sort(
								(a: any, b: any) =>
									new Date(b.createdAt).getTime() -
									new Date(a.createdAt).getTime()
							)
							.map((patient: any) => (
								<RNView key={patient._id}>
									<TouchableNativeFeedback
										disabled={disable}
										background={TouchableNativeFeedback.Ripple(
											"#ccc",
											false
										)}
										onPress={() =>
											viewPatient(
												patient._id,
												`${patient.firstName} ${patient.lastName}`
											)
										}
									>
										<ListItem
											backgroundColor={"$background0"}
											icon={
												<Avatar size={"$4"} circular>
													<Avatar.Image
														src={patient.imageUrl}
													/>
												</Avatar>
											}
											title={`${patient.firstName} ${patient.middleName} ${patient.lastName}`}
											subTitle={`${moment(
												patient?.createdAt
											)
												.startOf("s")
												.fromNow()}`}
											iconAfter={ChevronRight}
										/>
									</TouchableNativeFeedback>
								</RNView>
							))}
					</View>
				) : (
					<View justifyContent="center" alignItems="center">
						<XStack gap="$2" alignItems="center">
							<Pen color={"gray"} size={16} />
							<SizableText color={"gray"} fontSize={"$3"}>
								You may start adding patients
							</SizableText>
						</XStack>
					</View>
				)}
			</ScrollView>
			<StatusBar style="dark" />
		</SafeAreaView>
	);
};

export default Home;
