import React, { useEffect } from "react";
import { View, useWindowDimensions } from "react-native";
import {
	TabView,
	SceneMap,
	TabBar,
	TabBarProps,
} from "react-native-tab-view";
import Submissions from "./Submissions";
import Members from "./Members";
import { theme } from "@/theme/theme";
import { useUser } from "@clerk/clerk-expo";
import Loading from "@/components/Loading";

const renderScene = SceneMap({
	mysubmissions: Submissions,
	members: Members,
});

const routes = [
	{ key: "mysubmissions", title: "My Submissions" },
	{ key: "members", title: "Members" },
];
const renderTabBar = (props: TabBarProps<any>) => {
	return (
		<TabBar
			{...props}
			activeColor={theme.cyan10}
			inactiveColor="black"
			style={{ backgroundColor: "white" }}
			indicatorStyle={{ backgroundColor: theme.cyan10 }}
			pressOpacity={0.1}
			pressColor="lightgray"
		/>
	);
};

export default function Module() {
	const { isLoaded, user } = useUser();
	const layout = useWindowDimensions();
	const [index, setIndex] = React.useState(0);

	if (!isLoaded) {
		return <Loading />;
	}

	return (
		<TabView
			navigationState={{ index, routes }}
			renderScene={renderScene}
			onIndexChange={setIndex}
			initialLayout={{ width: layout.width }}
			renderTabBar={renderTabBar}
			style={{ backgroundColor: "white", flex: 1 }}
		/>
	);
}
