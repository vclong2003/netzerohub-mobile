import constate from "constate";
import { useState } from "react";

function useValues() {
  const [selectedCenterId, setSelectedCenterId] = useState<
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
    selectedCenterId,
    setSelectedCenterId,

    selectedLocation,
    setSelectedLocation,

    userLocation,
    setUserLocation,
  };
}

export const [RecyclingCentersContext, useRecyclingCentersContext] =
  constate(useValues);
