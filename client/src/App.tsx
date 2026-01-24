import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@react-native-vector-icons/ionicons";

import HomeScreen from "./screens/HomeScreen";
// import LoginScreen from "./screens/LoginScreen";
import DetailScanScreen from "./screens/DetailScanScreen";
import ScanHistoryScreen from "./screens/ScanHistoryScreen";
import SettingsScreen from "./screens/SettingsScreen";
import CameraScannerScreen from "./screens/CameraScannerScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


// --- Bagian Tab (Main screen setelah login)
const MainTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#082374ff", /* Warna biru gelap sesuai tema Anda */
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Scanner"
        component={CameraScannerScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="scan-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};


// --- Stack utama (Login → MainTab)
const RootStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTab} />


    </Stack.Navigator>
  );
};


// --- Entry point utama aplikasi
const App = () => {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};

export default App;
