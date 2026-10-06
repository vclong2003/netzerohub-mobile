import AppTabs from "@/components/AppTabs";
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <AppTabs />
    </View>
  );
}
