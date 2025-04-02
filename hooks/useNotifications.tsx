import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

interface INotification {
	_id: string;
	senderId: string;
	recipientId: string;
	type: string;
	senderAvatar: string;
	title: string;
	message: string;
	isRead: boolean;
	targetUrl: string;
	createdAt: Date;
	updatedAt: Date;
}

type GroupedNotifications = {
	read: INotification[];
	unread: INotification[];
};
export default function useNotifications(recipientId: string) {
	const notifications = useQuery({
		queryKey: ["notifications", recipientId],
		queryFn: async () => {
			const response = await api.get(`/notifications/${recipientId}`);

			return response.data as GroupedNotifications;
		},
	});

	return {
		...notifications,
		data: notifications.data || { read: [], unread: [] },
	};
}
