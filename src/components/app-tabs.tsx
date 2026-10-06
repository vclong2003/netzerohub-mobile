import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function TabLayout() {
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
              backgroundColor: "rgba(11, 10, 10, 0.25)",
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
          paddingBottom: 10,

          backgroundColor: "transparent",
          borderTopWidth: 0,
          borderWidth: 0,
          elevation: 0,
        },

        tabBarButton: (props) => (
          <TouchableOpacity
            {...props}
            style={[props.style, { flex: 1, padding: 8 }]}
          />
        ),

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },

        tabBarInactiveTintColor: "#fff",
        tabBarActiveTintColor: "#128085",
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
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
