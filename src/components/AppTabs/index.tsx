import { Ionicons } from "@expo/vector-icons";
import Fa6Icons from "@expo/vector-icons/FontAwesome6";

import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { PlatformPressable } from "expo-router/build/react-navigation";
import { StyleSheet } from "react-native";

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarBackground: () => (
          <BlurView
            intensity={70}
            style={{
              ...StyleSheet.absoluteFill,
              backgroundColor: "rgb(255, 255, 255)",
            }}
          />
        ),
        tabBarStyle: {
          minHeight: 65,
          marginHorizontal: 20,
          position: "absolute",
          bottom: 24,
          borderRadius: 12,
          overflow: "hidden",
          paddingTop: 10,

          backgroundColor: "transparent",
          borderTopWidth: 0,
          borderWidth: 0,
          elevation: 0,
        },

        tabBarButton: (props) => (
          <PlatformPressable {...props} pressColor="transparent" />
        ),

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },

        tabBarInactiveTintColor: "#A0AEC0",
        tabBarActiveTintColor: "#128085",

        animation: "shift",
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Green Charging",
          tabBarIcon: ({ color, size }) => (
            <Fa6Icons name="charging-station" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recycling-centers"
        options={{
          title: "Recycling Centers",
          tabBarIcon: ({ color, size }) => (
            <Fa6Icons name="recycle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="myhub"
        options={{
          title: "My NetZero",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
