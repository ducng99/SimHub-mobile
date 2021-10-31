import { DarkTheme as NavigationDarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StatusBar } from 'react-native';
import { DarkTheme as PaperDarkTheme, Provider as PaperProvider } from 'react-native-paper';
import HomeScreen from './src/HomeScreen';
import SimHubWeb from './src/SimHubWeb';

const Stack = createNativeStackNavigator();
const CombinedDarkTheme = {
    ...PaperDarkTheme,
    ...NavigationDarkTheme,
    colors: {
        ...PaperDarkTheme.colors,
        ...NavigationDarkTheme.colors
    }
};

export default function App() {
    return (
        <PaperProvider theme={CombinedDarkTheme}>
            <NavigationContainer theme={CombinedDarkTheme}>
                <StatusBar></StatusBar>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="SimHubWeb" component={SimHubWeb} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}
