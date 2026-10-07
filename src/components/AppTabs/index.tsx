import { Ionicons } from "@expo/vector-icons";
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
            intensity={40}
            tint="light"
            style={{
              ...StyleSheet.absoluteFill,
              backgroundColor: "rgba(11, 10, 10, 0.2)",
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
          paddingTop: 8,

          backgroundColor: "transparent",
          borderTopWidth: 0,
          borderWidth: 0,
          elevation: 0,
        },

        tabBarButton: (props) => (
          <PlatformPressable {...props} pressColor="transparent" />
        ),

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },

        tabBarInactiveTintColor: "#fff",
        tabBarActiveTintColor: "#128085",

        animation: "shift",
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="screen2"
        options={{
          title: "Screen 2",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="myhub"
        options={{
          title: "My Hub",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
