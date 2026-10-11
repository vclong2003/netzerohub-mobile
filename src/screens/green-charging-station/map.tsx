import { Button } from "@/components/button";
import { ProgressBar } from "@/components/progress-bar";
import { useLocationPermission } from "@/hooks/use-location-permission";
import {
  EStationStatus,
  GreenChargingStationsQueries,
} from "@/services/service.green-charging-stations";
import { MapTypes } from "@/types/types.map";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Mapbox from "@rnmapbox/maps";
import { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGreenChargingStationsContext } from "./context";
import { SearchBar } from "./search-bar";
import { StationBottomSheet } from "./station-bottom-sheet";
import { StationsFilterBottomSheet } from "./stations-filter-bottom-sheet";

Mapbox.setAccessToken(MapTypes.MAPBOX_ACCESS_TOKEN);

export function Map() {
  const { bottom } = useSafeAreaInsets();
  const { requestPermission } = useLocationPermission();
  const cameraRef = useRef<Mapbox.Camera | null>(null);
  const [isFollowUserLocation, setIsFollowUserLocation] = useState(true);
  const {
    selectedStationId,
    setSelectedStationId,
    selectedLocation,
    setSelectedLocation,
    stationsFilter,
  } = useGreenChargingStationsContext();

  const { data, isFetching } = GreenChargingStationsQueries.useGetStations({
    page: 0,
    pageSize: 100,
    status: EStationStatus.Active,
    ...stationsFilter,
  });
  const stations = data?.data || [];

  useEffect(() => {
    requestPermission();
  }, []);

  const zoomToCurrentLocation = useCallback(() => {
    setSelectedLocation(undefined);
    setIsFollowUserLocation(true);
  }, [cameraRef, setIsFollowUserLocation]);

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
      <ProgressBar isLoading={isFetching} />
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
        styleURL={MapTypes.MAPBOX_STYLE_URL}>
        <Mapbox.Camera
          ref={cameraRef}
          animationDuration={3000}
          followZoomLevel={16}
          followUserLocation={isFollowUserLocation}
          allowUpdates
        />

        {/* Stations ------------------------------------------------ */}
        {stations.map((station) => {
          const isSelected = selectedStationId === station.id;
          return (
            <Mapbox.MarkerView
              key={station.id}
              id={station.id.toString()}
              allowOverlap={true}
              allowOverlapWithPuck={true}
              coordinate={[station.longitude, station.latitude]}>
              <TouchableOpacity
                style={[
                  styles.markerContainer,
                  isSelected && styles.markerContainerSelected,
                ]}
                onPress={() => setSelectedStationId(station.id)}>
                <MaterialIcons
                  name="energy-savings-leaf"
                  size={22}
                  color={isSelected ? "#FFFFFF" : "#128085"}
                />
              </TouchableOpacity>
            </Mapbox.MarkerView>
          );
        })}

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
        onPress={zoomToCurrentLocation}
        style={styles.zoomBtn}
      />

      {/* Station Detail ------------------------------------------------- */}
      <StationBottomSheet />

      {/* Filter Modal --------------------------------------------------- */}
      <StationsFilterBottomSheet />
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

  markerContainerSelected: {
    backgroundColor: "#128085",
    borderColor: "#FFFFFF",
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
