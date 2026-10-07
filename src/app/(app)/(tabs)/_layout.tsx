import AppTabs from "@/components/apptabs";
import { FloatingReportButton } from "@/components/floating-report-button";
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <AppTabs />
      <FloatingReportButton />
    </View>
  );
}
