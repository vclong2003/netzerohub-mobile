import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      <Slot />
    </View>
  );
}
