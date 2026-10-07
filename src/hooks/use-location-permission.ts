import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { Alert, AppState, AppStateStatus, Linking } from "react-native";
import Toast from "react-native-toast-message";

export function useLocationPermission() {
  const [isGranted, setIsGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [canAskAgain, setCanAskAgain] = useState(true);
  const [status, setStatus] = useState<Location.PermissionStatus | null>(null);

  const checkPermission = useCallback(async () => {
    try {
      const res = await Location.getForegroundPermissionsAsync();
      setIsGranted(res.granted);
      setCanAskAgain(res.canAskAgain);
      setStatus(res.status);
      return res.granted;
    } catch (err) {
      console.error("Error checking location permission:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkPermission();

    const subscription = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        if (nextState === "active") {
          checkPermission();
        }
      },
    );

    return () => subscription.remove();
  }, [checkPermission]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const current = await Location.getForegroundPermissionsAsync();

      if (current.granted) {
        setIsGranted(true);
        return true;
      }

      if (
        !current.canAskAgain &&
        current.status === Location.PermissionStatus.DENIED
      ) {
        Alert.alert(
          "Location Permission Required",
          "You previously denied location access. Please enable it in Settings to continue.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ],
        );
        return false;
      }

      const res = await Location.requestForegroundPermissionsAsync();
      setIsGranted(res.granted);
      setCanAskAgain(res.canAskAgain);
      setStatus(res.status);

      if (!res.granted) {
        Toast.show({
          type: "error",
          text1: "Location permission denied",
          text2: res.canAskAgain
            ? "Tap again to grant permission."
            : "Please enable location in your device settings.",
        });
      }

      return res.granted;
    } catch (err) {
      console.error("Error requesting location permission:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isGranted,
    isLoading,
    canAskAgain,
    status,
    requestPermission,
    checkPermission,
    openSettings: () => Linking.openSettings(),
  };
}
