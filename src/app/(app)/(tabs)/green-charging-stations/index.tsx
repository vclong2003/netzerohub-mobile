import { Button } from "@/components/Button";
import { useLocationPermission } from "@/hooks/use-location-premission";
import { MapTypes } from "@/types/types.map";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Mapbox from "@rnmapbox/maps";
import { useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

export default function GreenChargingStations() {
  const { bottom } = useSafeAreaInsets();
  const { requestPermission } = useLocationPermission();
  const cameraRef = useRef(null);
  const [isFollowUserLocation, setIsFollowUserLocation] = useState(true);

  useEffect(() => {
    requestPermission();
  }, []);

  console.log("GreenChargingStations rendered");

  return (
    <View style={{ flex: 1 }}>
      <Mapbox.MapView
        onTouchStart={Keyboard.dismiss}
        style={{ flex: 1 }}
        logoEnabled={false}
        scaleBarEnabled={false}
        attributionEnabled={false}
        compassEnabled={true}
        compassFadeWhenNorth={false}
        compassPosition={{ bottom: bottom + 85, left: 20 }}
        styleURL={MapTypes.MAPBOX_STYLE_URL}>
        <Mapbox.Camera
          ref={cameraRef}
          animationDuration={3000}
          followUserLocation={true}
          followZoomLevel={16}
          allowUpdates
        />

        {/* Stations ------------------------------------------------ */}
        {MOCK_STATIONS.map((station) => (
          <Mapbox.MarkerView
            key={station.id}
            id={station.id}
            coordinate={station.coordinate}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.markerContainer}
              onPress={() => console.log("Selected station:", station.name)}>
              <MaterialIcons
                name="energy-savings-leaf"
                size={20}
                color="#128085"
              />
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
          pulsing={{ color: "#128085", isEnabled: true, radius: 25 }}
        />
      </Mapbox.MapView>

      {/* Zoom to current ------------------------------------------------ */}
      <Button
        variant="green"
        preIcon={<MaterialIcons name="my-location" size={24} color="#FFF" />}
        // onPress={zoomToCurrentLocation}
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
    borderColor: "#128085",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  userLocation: {
    backgroundColor: "#128085",
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
