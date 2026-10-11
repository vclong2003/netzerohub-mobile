import { LoadingScreen } from "@/components/loading-screen";
import { AuthQueries } from "@/services/service.auth";
import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
  const { isPending, data } = AuthQueries.useMyAccount();

  if (isPending) return <LoadingScreen />;

  if (!data?.id) return <Redirect href="/auth" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { flex: 1, backgroundColor: "#fff" },
      }}
    />
  );
}
