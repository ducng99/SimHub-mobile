import { NavigationProp, Route, useFocusEffect } from "@react-navigation/native";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import React, { useEffect, useState } from "react";
import { Platform, StatusBar } from "react-native";
import WebView from "react-native-webview";

interface IProps {
    route: Route<string, { url: string }>;
    navigation: NavigationProp<ReactNavigation.RootParamList>;
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