import { MapTypes } from "@/types/types.map";
import { useDebounce } from "@/utils/utils.debounce";
import { TFeatureCollection } from "@/utils/utils.location";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export type TLocationSuggestion = {
  address: string;
  lat: number;
  lon: number;
};
export function useSearchLocation() {
  const [query, setQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{
    lat?: number;
    lon?: number;
  }>();
  const [suggestions, setSuggestions] = useState<TLocationSuggestion[]>([]);
  const debouncedQuery = useDebounce<string>(query, 300);
  const searchLocation = useCallback(async () => {
    if (!debouncedQuery.trim()) return setSuggestions([]);
    const { lat, lon } = userLocation || {};
    const payload = encodeURIComponent(debouncedQuery);
    const endpoint = `${MapTypes.MAPBOX_GEOCODE_API}/forward?q=${payload}&proximity=${lon || 0},${
      lat || 0
    }&country=au&access_token=${MapTypes.MAPBOX_PUBLIC_ACCESS_TOKEN}`;

    const response = await axios.get(endpoint);
    const data = response.data as TFeatureCollection;

    const suggestions: TLocationSuggestion[] = data.features.map((feature) => ({
      address: feature.properties.full_address,
      lat: feature.properties.coordinates.latitude,
      lon: feature.properties.coordinates.longitude,
    }));
    setSuggestions(suggestions);
  }, [debouncedQuery, userLocation]);

  useEffect(() => {
    searchLocation();
  }, [debouncedQuery]);

  return { query, setQuery, userLocation, setUserLocation, suggestions };
}
