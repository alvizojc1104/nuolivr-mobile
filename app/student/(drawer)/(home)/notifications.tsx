import CustomButton from "@/components/CustomButton";
import Loading from "@/components/Loading";
import { IconWrapper, RippleListItem } from "@/components/RippleListItem";
import useNotifications from "@/hooks/useNotifications";
import { theme } from "@/theme/theme";
import api from "@/utils/axios";
import { useUser } from "@clerk/clerk-expo";
import { RefreshCcw } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React from "react";
import { RefreshControl } from "react-native";
import { ScrollView, Separator, SizableText, View } from "tamagui";

const Notifications = () => {
	const { user } = useUser();
	const userId = user?.publicMetadata?._id as string;
	const notifications = useNotifications(userId);

	if (notifications.isLoading) {
		return <Loading />;
	}
	if (notifications.isError) {
		return (
			<View>
				<SizableText>Error loading notifications</SizableText>
				<CustomButton
					buttonText="Refresh"
					iconAfter={RefreshCcw}
					onPress={() => notifications.refetch()}
				/>
			</View>
		);
	}

	const handleNotificationClicked = async (_id: string) => {
		api.put(`/notifications/read/${_id}`)
			.then(() => {
				router.push("/student/(drawer)/(home)/module");
			})
			.catch((error) => {
				console.log(JSON.stringify(error));
			});
	};

	return (
		<ScrollView
			refreshControl={
				<RefreshControl
					refreshing={notifications.isFetching}
					onRefresh={() => notifications.refetch()}
				/>
			}
		>
			{notifications.data.read.length === 0 &&
			notifications.data.unread.length === 0 ? (
				<SizableText>No notifications available.</SizableText>
			) : (
				<>
					{notifications.data.unread.length > 0 && (
						<>
							<Separator />
							<SizableText
								marginHorizontal="$4"
								marginTop="$3"
								color={"$gray10"}
							>
								Unread
							</SizableText>
							{notifications.data.unread.map(
								(notification, index) => (
									<RippleListItem
										backgroundColor={theme.cyan2}
										title={notification.title}
										description={notification.message}
										key={`${notification.title}-${index}`}
										icon={
											<IconWrapper
												icon={
													<SizableText
														color={theme.cyan10}
													>
														N
													</SizableText>
												}
												backgroundColor={theme.cyan3}
											/>
										}
										fn={() => {
											handleNotificationClicked(
												notification._id
											);
										}}
									/>
								)
							)}
							<Separator marginTop="$3" />
						</>
					)}
					{notifications.data.read.length > 0 && (
						<>
							<SizableText
								marginHorizontal="$4"
								marginTop="$3"
								color={"$gray10"}
							>
								Read
							</SizableText>
							{notifications.data.read.map(
								(notification, index) => (
									<RippleListItem
										title={notification.title}
										description={notification.message}
										key={`${notification.title}-${index}`}
										icon={
											<IconWrapper
												icon={
													<SizableText
														color={theme.cyan10}
													>
														N
													</SizableText>
												}
												backgroundColor={theme.cyan3}
											/>
										}
										fn={() => {
											handleNotificationClicked(
												notification._id
											);
										}}
									/>
								)
							)}
						</>
					)}
				</>
			)}
		</ScrollView>
	);
};

export default Notifications;
