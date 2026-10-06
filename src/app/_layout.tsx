import { useQueryClient } from "@/services/_config.queryClient";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { queryClient } = useQueryClient();

  return (
    <KeyboardProvider>
      <ActionSheetProvider>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <SafeAreaProvider>
              <Slot />
            </SafeAreaProvider>
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </ActionSheetProvider>
    </KeyboardProvider>
  );
}
