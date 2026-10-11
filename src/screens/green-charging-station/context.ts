import constate from "constate";
import { useState } from "react";

function useValues() {
  const [selectedStationId, setSelectedStationId] = useState<
    number | undefined
  >();
  const [selectedLocation, setSelectedLocation] = useState<
    { lat: number; lon: number } | undefined
  >();
  const [userLocation, setUserLocation] = useState<{
    lat?: number;
    lon?: number;
  }>({
    lat: undefined,
    lon: undefined,
  });

  return {
    selectedStationId,
    setSelectedStationId,

    selectedLocation,
    setSelectedLocation,

    userLocation,
    setUserLocation,
  };
}

export const [GreenChargingStationsContext, useGreenChargingStationsContext] =
  constate(useValues);
