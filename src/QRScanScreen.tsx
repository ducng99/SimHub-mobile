import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BarCodeScanner, BarCodeScannerResult, PermissionStatus } from "expo-barcode-scanner";
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper"

interface IProps {
    navigation: NativeStackNavigationProp<any>;
}

export default function QRScanScreen({ navigation }: IProps) {
    const [hasPermission, setHasPermission] = useState(false);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === PermissionStatus.GRANTED);
        })();
    }, []);

    function onQRScanned({ data }: BarCodeScannerResult) {
        setScanned(true);
        navigation.navigate("Home", { url: data });
    }

    return (
        <View style={styles.container}>
            {
                hasPermission ?
                    <BarCodeScanner
                        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                        onBarCodeScanned={scanned ? undefined : onQRScanned}
                        style={StyleSheet.absoluteFillObject}
                    /> :
                    <Text>No permission to use camera</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});