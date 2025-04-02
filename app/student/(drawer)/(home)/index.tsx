import React from "react";
import {
	Bell,
	ChevronRight,
	ClipboardList,
	Pen,
	Plus,
	Sun,
	UsersRound,
} from "@tamagui/lucide-icons";
import { Href, Link, router } from "expo-router";
import {
	Pressable,
	RefreshControl,
	TouchableNativeFeedback,
	View as RNView,
} from "react-native";
import {
	Card,
	Circle,
	H5,
	ListItem,
	ScrollView,
	Separator,
	YGroup,
} from "tamagui";
import { Avatar, Heading, SizableText, View, XStack, YStack } from "tamagui";
import { theme } from "@/theme/theme";
import { StatusBar } from "expo-status-bar";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useUser } from "@clerk/clerk-expo";
import { usePatientList } from "@/hooks/usePatientList";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "@/components/Loading";
import useNotifications from "@/hooks/useNotifications";

const Module = (props: { href: Href; label: string; icon: any }) => {
	return (
		<TouchableNativeFeedback onPress={() => router.push(props.href)}>
			<YStack
				alignItems="center"
				justifyContent="center"
				padding="$3"
				flex={1}
				width={100}
				backgroundColor={theme.cyan3}
				borderRadius={"$4"}
			>
				<Circle borderWidth={0.5} borderColor={theme.cyan10} padded>
					{props.icon}
				</Circle>
				<SizableText marginTop="$2" color={theme.cyan10}>
					{props.label}
				</SizableText>
			</YStack>
		</TouchableNativeFeedback>
	);
};

const Home = () => {
	const navigation = useNavigation();
	const { user } = useUser();
	const notification = useNotifications(user?.publicMetadata?._id as string);
	const patients = usePatientList(user?.id as string);
	const refreshPage = async () => {
		patients.refetch();
		notification.refetch();
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
			<XStack
				alignItems="center"
				paddingBottom="$2"
				paddingTop="$4"
				paddingHorizontal="$5"
			>
				<XStack alignItems="center" gap="$1">
					<Avatar>
						<Avatar.Image
							src={require("@/assets/images/logo.png")}
							objectFit="contain"
							width={40}
							height={40}
						/>
					</Avatar>
					<H5 fontWeight={900}>NU Vision</H5>
				</XStack>
				<XStack flex={1} />
				<TouchableNativeFeedback
					onPress={() => navigate("/student/notifications")}
					style={{ borderRadius: 999 }}
				>
					<RNView
						style={{
							position: "relative",
							width: 45,
							height: 45,
							justifyContent: "center",
							alignItems: "center",
							borderRadius: 999,
							backgroundColor: theme.cyan3,
						}}
					>
						<Bell />
						{notification?.data?.unread.length > 0 && (
							<XStack
								position="absolute"
								padding="$1.5"
								top={-5}
								right={-5}
								height={16}
								width={16}
								verticalAlign="middle"
								overflow="hidden"
								opacity={1}
								shadowColor={"$red9"}
								backgroundColor={"$red9"}
								zIndex={20}
								borderRadius={999}
								justifyContent="center"
								alignItems="center"
								display="flex"
							></XStack>
						)}
					</RNView>
				</TouchableNativeFeedback>
				<Pressable onPress={openDrawer} style={{ marginLeft: 20 }}>
					<Avatar circular>
						<Avatar.Image src={user?.imageUrl} />
					</Avatar>
				</Pressable>
			</XStack>
			<ScrollView
				contentContainerStyle={{ gap: "$5", paddingTop: "$4" }}
				refreshControl={
					<RefreshControl
						refreshing={
							patients.isFetching || notification.isFetching
						}
						onRefresh={refreshPage}
					/>
				}
				showsVerticalScrollIndicator={false}
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
						<Card
							bordered
							backgroundColor={theme.cyan3}
							borderColor={theme.cyan6}
							borderWidth={0.5}
							padded
							flex={1}
						>
							<SizableText color={theme.cyan11}>
								Patients
							</SizableText>
							<SizableText
								size={"$6"}
								color={theme.cyan12}
								fontWeight={900}
							>
								{patients?.data?.length ?? 0}
							</SizableText>
						</Card>
						<Card
							bordered
							backgroundColor={theme.cyan3}
							borderColor={theme.cyan6}
							borderWidth={0.5}
							padded
							flex={1}
						>
							<SizableText color={theme.cyan11}>
								Prescriptions
							</SizableText>
							<SizableText
								size={"$6"}
								color={theme.cyan12}
								fontWeight={900}
							>
								0
							</SizableText>
						</Card>
					</XStack>
				</YStack>
				<XStack gap="$2" paddingHorizontal="$5">
					<Module
						href={"/student/(pcr)"}
						label="Add patient"
						icon={<Plus color={theme.cyan10} />}
					/>
					<Module
						href={"/student/patients"}
						label="My Patients"
						icon={<ClipboardList color={theme.cyan10} />}
					/>
					<Module
						href={"/student/module/"}
						label="Modules"
						icon={<UsersRound color={theme.cyan10} />}
					/>
				</XStack>
				<View>
					<XStack
						alignItems="center"
						justifyContent="space-between"
						paddingHorizontal="$5"
					>
						<SizableText fontSize={"$3"} color={"$gray10"}>
							Recently patients
						</SizableText>
						<Link href={"/student/patients"}>
							<SizableText color={theme.cyan10}>
								{"See all"}
							</SizableText>
						</Link>
					</XStack>
					{patients?.data?.length || 0 > 0 ? (
						<View>
							{patients.data
								?.sort(
									(a: any, b: any) =>
										new Date(b.createdAt).getTime() -
										new Date(a.createdAt).getTime()
								)
								.slice(0, 5)
								.map((patient: any) => (
									<RNView key={patient._id}>
										<TouchableNativeFeedback
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
													patient.imageUrl === "" ? (
														<View
															padding="$2"
															width={"$4"}
															height={"$4"}
															alignItems="center"
															justifyContent="center"
															borderRadius={999}
															backgroundColor={
																theme.cyan3
															}
														>
															<SizableText
																color={
																	theme.cyan10
																}
															>
																{patient.firstName
																	.charAt(0)
																	.toUpperCase()}
																{patient.lastName
																	.charAt(0)
																	.toUpperCase()}
															</SizableText>
														</View>
													) : (
														<Avatar
															size={"$4"}
															circular
														>
															<Avatar.Image
																src={
																	patient.imageUrl
																}
															/>
															<Avatar.Fallback
																backgroundColor={
																	theme.cyan3
																}
															>
																<SizableText
																	color={
																		theme.cyan10
																	}
																>
																	{patient.firstName
																		.charAt(
																			0
																		)
																		.toUpperCase()}
																	{patient.lastName
																		.charAt(
																			0
																		)
																		.toUpperCase()}
																</SizableText>
															</Avatar.Fallback>
														</Avatar>
													)
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
				</View>
			</ScrollView>
			<StatusBar style="dark" />
		</SafeAreaView>
	);
};

export default Home;
