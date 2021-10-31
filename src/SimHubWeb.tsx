import { Route, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import React, { useEffect, useState } from "react";
import { Platform, StatusBar } from "react-native";
import WebView from "react-native-webview";

interface IProps {
    route: Route<string, { url: string }>;
    navigation: NativeStackNavigationProp<any>;
}

export default function SimHubWeb({ navigation, route }: IProps) {
    const [isHardwareAvailable, setIsHardwareAvailable] = useState(false);

    useEffect(() => {
        if (Platform.OS === "android" && Platform.Version >= 19) {
            setIsHardwareAvailable(true);
            console.log("Hardware acceleration enabled");
        }
    }, []);

    useFocusEffect(() => {
        StatusBar.setHidden(true);
        activateKeepAwake();

        return () => deactivateKeepAwake();
    });

    return (
        <>
            <WebView
                source={{ uri: route.params?.url ?? "" }}
                androidLayerType={isHardwareAvailable ? "hardware" : "software"}
                onError={console.error}
                onHttpError={console.error}>
            </WebView>
        </>
    );
}