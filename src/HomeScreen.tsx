import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleProp, ViewStyle } from 'react-native';
import { TextInput, Button, Snackbar, Text } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Route, useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CanConnectTo } from './Utils';

const ipRegex = new RegExp(/^(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/);
const urlRegex = new RegExp(/(?:http:\/\/)?([0-9.]+):(\d+)/i);

interface IProps {
    route: Route<string, { url: string }>;
    navigation: NativeStackNavigationProp<any>;
}

export default function HomeScreen({ navigation, route }: IProps) {
    const [ip, setIp] = useState('192.168.1.2');
    const [port, setPort] = useState('8888');
    const [loading, setLoading] = useState(false);

    const [isSnackbarShown, showSnackbar] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const savedIP = await AsyncStorage.getItem('ip');
                const savedPort = await AsyncStorage.getItem('port');
                if (savedIP) {
                    setIp(savedIP);
                }
                if (savedPort) {
                    setPort(savedPort);
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);

    useEffect(() => {
        if (route.params?.url) {
            CanConnectTo(route.params.url).then(valid => {
                if (valid) {
                    const matches = urlRegex.exec(route.params.url);
                    if (matches && matches.length > 2) {
                        setIp(matches[1]);
                        setPort(matches[2]);

                        AsyncStorage.setItem('ip', ip);
                        AsyncStorage.setItem('port', port);
                    }

                    navigation.navigate('SimHubWeb', { url: route.params.url });
                }
                else {
                    showSnackbar(true);
                    setSnackbarText('Could not connect to the server.');
                }
            });
        }
    }, [route.params?.url]);

    useFocusEffect(() => {
        StatusBar.setHidden(false);
    });

    function handleConnect() {
        setLoading(true);

        if (ipRegex.test(ip) && port.length > 0) {
            const url = `http://${ip}:${port}`;
            console.log("Openning ", url);

            CanConnectTo(url).then(valid => {
                if (valid) {
                    AsyncStorage.setItem('ip', ip);
                    AsyncStorage.setItem('port', port);
                    navigation.navigate('SimHubWeb', { url });
                }
                else {
                    showSnackbar(true);
                    setSnackbarText('Could not connect to the server.');
                }

                setLoading(false);
            });
        }
        else {
            showSnackbar(true);
            setSnackbarText('Please enter a valid IP address and port.');

            setLoading(false);
        }
    }

    function handlePortChange(text: string) {
        const portNumber = parseInt(text.replace(/[^0-9]/g, ''));

        if (text.length === 0 || (portNumber && portNumber > 0 && portNumber < 65536)) {
            setPort(text);
        }
    }
    
    function handleOnQRScan() {
        navigation.navigate('QRScanner');
    }

    return (
        <ScrollView contentContainerStyle={styles}>
            <TextInput label="IP:" value={ip} onChangeText={newIP => setIp(newIP)} placeholder="192.168.1.2" keyboardType="default" autoCompleteType="off" disableFullscreenUI={true} style={{ marginBottom: 5 }}></TextInput>
            <TextInput label="Port:" value={port} onChangeText={newPort => handlePortChange(newPort)} placeholder="8888" maxLength={5} keyboardType="numeric" autoCompleteType="off" disableFullscreenUI={true} style={{ marginBottom: 5 }}></TextInput>
            <Button mode="contained" loading={loading} onPress={handleConnect}>Connect</Button>

            <Text style={{ marginVertical: 10 }}>Or</Text>
            <Button icon="camera" mode="contained" onPress={() => handleOnQRScan()}>Scan QR Code</Button>

            <Snackbar visible={isSnackbarShown} onDismiss={() => showSnackbar(false)} action={{ label: "Close" }} >
                {snackbarText}
            </Snackbar>
        </ScrollView>
    );
}

const styles: StyleProp<ViewStyle> = {
    paddingHorizontal: 10,
    flex: 1,
};