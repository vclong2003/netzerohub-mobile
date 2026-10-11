import AppTabs from "@/components/apptabs";
import { FloatingReportButton } from "@/components/floating-report-button";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function TabsLayout() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <AppTabs />
      <FloatingReportButton
        onReportPress={() => router.navigate("/(app)/pollution-report")}
      />
    </View>
  );
}
