import { Camera, CameraView } from "expo-camera";
import { router, Stack } from "expo-router";
import {
    ActivityIndicator,
    Alert,
    AppState,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
} from "react-native";
import { Overlay } from "./Overlay";
import { useEffect, useRef } from "react";
import axios from "axios";
import { SERVER } from "@/constants/link";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { View } from "tamagui";
import { theme } from "@/theme/theme";
import moment from "moment";

interface Access {
    user_id: string;
    accessToken: string;
    url: string;
}

export default function Home() {
    const qrLock = useRef(false);
    const appState = useRef(AppState.currentState);
    const { isLoaded, user } = useUser();
    const { signOut } = useAuth()

    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                qrLock.current = false;
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    if (!isLoaded) {
        return (
            <View flex={1} alignItems="center" justifyContent="center">
                <ActivityIndicator size={"large"} color={theme.cyan10} />
            </View>
        );
    }

    const onTimeIn = async (data: Access) => {
        try {
            const response = await axios.post(data.url, { user_id: user?.id, accessToken: data.accessToken });
            if (response.data.message === "Time In successful") {
                console.log(response.data.message)
                setTimeout(() => {
                    Alert.alert("Success", `Time in successful: ${moment(new Date).format("MMMM D, YYYY hh:mm:ss a")}\nYou may now continue using the app.`)
                    router.replace({ pathname: "/", params: { checkUserId: user?.id } });
                }, 1000);
            } else if (response.data.message === "Time Out successful") {
                Alert.alert("Success", `Time out successful: ${moment(new Date).format("MMMM D, YYYY hh:mm:ss a")}`)
                console.log(response.data.message)
                signOut()
            }   
            return;
        } catch (error: any) {
            if (error.response) {
                Alert.alert("Error", error.response.data || "An unexpected error occurred.");
            } else if (error.request) {
                Alert.alert("Network Error", "No response from the server. Please try again.");
            } else {
                Alert.alert("Error", error.message || "An unexpected error occurred.");
            }
        }
    };

    return (
        <SafeAreaView style={StyleSheet.absoluteFillObject}>
            <Stack.Screen
                options={{
                    title: "Overview",
                    headerShown: false,
                }}
            />
            {Platform.OS === "android" ? <StatusBar hidden /> : null}
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={async ({ data }: any) => {
                    if (data && !qrLock.current) {
                        qrLock.current = true;
                        setTimeout(() => {
                            onTimeIn(JSON.parse(data));
                        }, 200);
                    }
                }}
            />
            <Overlay />
        </SafeAreaView>
    );
}
