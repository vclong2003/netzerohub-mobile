import { GreenChargingStationsQueries } from "@/services/service.green-charging-stations";
import constate from "constate";
import { useState } from "react";

type TStationsFilter = Omit<
  GreenChargingStationsQueries.IGetStationsPayload,
  "name" | "page" | "pageSize" | "status"
>;

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
  const [stationsFilter, setStationsFilter] = useState<TStationsFilter>({
    renewableEnergyPercent: undefined,
    plugType: undefined,
  });
  const [showFilterModal, setShowFilterModal] = useState(false);

  return {
    selectedStationId,
    setSelectedStationId,

    selectedLocation,
    setSelectedLocation,

    userLocation,
    setUserLocation,

    stationsFilter,
    setStationsFilter,

    showFilterModal,
    setShowFilterModal,
  };
}

export const [GreenChargingStationsContext, useGreenChargingStationsContext] =
  constate(useValues);
