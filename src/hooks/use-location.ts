import Geolocation from "@react-native-community/geolocation";
import { useCallback, useEffect, useState } from "react";

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState<
    [number, number] | undefined
  >();
  const [locationWatchId, setLocationWatchId] = useState<number | undefined>();

  const watchUserLocation = useCallback(() => {
    Geolocation.watchPosition(
      ({ coords: { longitude, latitude } }) => {
        console.log("watchPosition ---------", { longitude, latitude });
        setUserLocation([longitude, latitude]);
      },
      (error) => console.error(error),
      { enableHighAccuracy: true, timeout: 1000 },
    );
  }, [locationWatchId]);
  const stopWatchingUserLocation = useCallback(() => {
    if (locationWatchId) {
      Geolocation.clearWatch(locationWatchId);
      setLocationWatchId(undefined);
    }
  }, [locationWatchId]);

  useEffect(() => {
    watchUserLocation();
  }, []);

  return { userLocation, watchUserLocation, stopWatchingUserLocation };
}
