import { Button } from "@/components/button";
import { useLocationPermission } from "@/hooks/use-location-permission";
import { MapTypes } from "@/types/types.map";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Mapbox from "@rnmapbox/maps";
import { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecyclingCentersContext } from "./context";
import { SearchBar } from "./search-bar";

Mapbox.setAccessToken(MapTypes.MAPBOX_ACCESS_TOKEN);

const MOCK_STATIONS = [
  {
    id: "station-p4",
    name: "UOW P4 Western Carpark",
    coordinate: [150.8745, -34.4035],
  },
  {
    id: "station-unicentre",
    name: "UOW UniCentre / Northfields Entrance",
    coordinate: [150.8772, -34.4042],
  },
  {
    id: "station-library",
    name: "UOW Building 20 Library",
    coordinate: [150.8795, -34.4055],
  },
  {
    id: "station-smart",
    name: "UOW SMART Infrastructure Facility",
    coordinate: [150.8815, -34.4068],
  },
  {
    id: "station-sports",
    name: "UOW Sports Hub & Oval",
    coordinate: [150.878, -34.4082],
  },
];

export function Map() {
  const { bottom } = useSafeAreaInsets();
  const { requestPermission } = useLocationPermission();
  const cameraRef = useRef<Mapbox.Camera | null>(null);
  const [isFollowUserLocation, setIsFollowUserLocation] = useState(true);
  const { setSelectedLotId, selectedLocation, setSelectedLocation } =
    useRecyclingCentersContext();

  useEffect(() => {
    requestPermission();
  }, []);

  const zoomToCurrentLocation = useCallback(() => {
    setSelectedLocation(undefined);
    setIsFollowUserLocation(true);
  }, [cameraRef, setIsFollowUserLocation]);

  console.log("RecyclingCenters rendered");

  const zoomToSelectedLocation = useCallback(() => {
    if (!selectedLocation) return;
    setIsFollowUserLocation(false);
    setTimeout(
      () =>
        cameraRef?.current?.setCamera({
          centerCoordinate: [selectedLocation.lon, selectedLocation.lat],
          zoomLevel: 14,
          animationDuration: 1000,
        }),
      200,
    );
  }, [cameraRef, selectedLocation, setIsFollowUserLocation]);

  useEffect(() => {
    if (!selectedLocation) return;
    zoomToSelectedLocation();
  }, [selectedLocation, zoomToSelectedLocation]);

  return (
    <View style={{ flex: 1 }}>
      <SearchBar />
      <Mapbox.MapView
        onTouchStart={Keyboard.dismiss}
        style={{ flex: 1 }}
        logoEnabled={false}
        scaleBarEnabled={false}
        attributionEnabled={false}
        compassEnabled={true}
        compassFadeWhenNorth={false}
        compassPosition={{ bottom: bottom + 85, left: 20 }}
        onCameraChanged={(event) => {
          if (event.gestures.isGestureActive) setIsFollowUserLocation(false);
        }}
        styleURL={MapTypes.MAPBOX_STYLE_URL_1}>
        <Mapbox.Camera
          ref={cameraRef}
          animationDuration={3000}
          followZoomLevel={16}
          followUserLocation={isFollowUserLocation}
          allowUpdates
        />

        {/* Stations ------------------------------------------------ */}
        {MOCK_STATIONS.map((station) => (
          <Mapbox.MarkerView
            key={station.id}
            id={station.id}
            coordinate={station.coordinate}>
            <TouchableOpacity
              style={styles.markerContainer}
              onPress={() => console.log("Selected station:", station.name)}>
              <MaterialIcons name="factory" size={22} color="#009369" />
            </TouchableOpacity>
          </Mapbox.MarkerView>
        ))}

        {/* User Location ------------------------------------------- */}
        <Mapbox.Images>
          <Mapbox.Image name="userLocationImage">
            <View style={styles.userLocation} />
          </Mapbox.Image>
        </Mapbox.Images>
        <Mapbox.LocationPuck
          topImage="userLocationImage"
          pulsing={{ color: "#00dfa0", isEnabled: true, radius: 25 }}
        />
      </Mapbox.MapView>

      {/* Zoom to current ------------------------------------------------ */}
      <Button
        variant="green"
        preIcon={<MaterialIcons name="my-location" size={24} color="#FFF" />}
        onPress={zoomToCurrentLocation}
        style={styles.zoomBtn}
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },

  markerContainer: {
    backgroundColor: "#FFFFFF",
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#009369",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  userLocation: {
    backgroundColor: "#009369",
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    borderWidth: 3,
    borderColor: "#FFF",
  },

  zoomBtn: {
    position: "absolute",
    bottom: 116,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
});
