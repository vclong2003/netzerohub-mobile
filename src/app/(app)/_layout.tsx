import { LoadingScreen } from "@/components/LoadingScreen";
import { AuthQueries } from "@/services/service.auth";
import { useAuthStore } from "@/states/states.auth";
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const { isPending, data } = AuthQueries.useMyAccount();
  const { setIsAuthenticated } = useAuthStore();

  useEffect(() => {
    if (data?.id) setIsAuthenticated(true);
  }, [data, setIsAuthenticated]);

  if (isPending) return <LoadingScreen />;

  if (!data?.id) return <Redirect href="/auth" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#ffffff", flex: 1 },
      }}
    />
  );
}
