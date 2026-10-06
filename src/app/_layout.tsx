import { useQueryClient } from "@/services/_config.queryClient";
import { toastConfig } from "@/utils/utils.toast";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Platform, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { queryClient } = useQueryClient();

  return (
    <>
      {Platform.OS === "android" && (
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
      )}
      <KeyboardProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ActionSheetProvider>
            <QueryClientProvider client={queryClient}>
              <BottomSheetModalProvider>
                <SafeAreaProvider>
                  <Stack screenOptions={{ headerShown: false }} />
                </SafeAreaProvider>
              </BottomSheetModalProvider>
            </QueryClientProvider>
          </ActionSheetProvider>
        </GestureHandlerRootView>
      </KeyboardProvider>
      <Toast config={toastConfig} />
    </>
  );
}
