import { MapTypes } from "@/types/types.map";
import axios from "axios";
import { Linking } from "react-native";

// Reverse Geocoding ----------------------------------------------------------------------------
export type TFeatureCollection = {
  type: string;
  features: {
    type: string;
    id: string;
    geometry: {
      type: string;
      coordinates: number[];
    };
    properties: {
      mapbox_id: string;
      feature_type: string;
      full_address: string;
      name: string;
      name_preferred: string;
      coordinates: {
        longitude: number;
        latitude: number;
      };
      place_formatted: string;
      bbox: number[];
      context: {
        place: {
          mapbox_id: string;
          name: string;
          wikidata_id: string;
          short_code?: string;
        };
        region: {
          mapbox_id: string;
          name: string;
          wikidata_id: string;
          region_code: string;
          region_code_full: string;
        };
        country: {
          mapbox_id: string;
          name: string;
          wikidata_id: string;
          country_code: string;
          country_code_alpha_3: string;
        };
        locality?: {
          mapbox_id: string;
          name: string;
          wikidata_id: string;
        };
        postcode?: {
          mapbox_id: string;
          name: string;
        };
        neighborhood?: {
          mapbox_id: string;
          name: string;
          wikidata_id: string;
        };
      };
    };
  }[];
};
export async function reverseGeocode({
  lat,
  lon,
}: {
  lat?: number;
  lon?: number;
}): Promise<string> {
  const endpoint = `${MapTypes.MAPBOX_GEOCODE_API}/reverse?longitude=${lon || 0}&latitude=${lat || 0}&access_token=${
    MapTypes.MAPBOX_PUBLIC_ACCESS_TOKEN
  }`;
  const response = await axios.get(endpoint);
  const featureCollection = response.data as TFeatureCollection;
  return featureCollection.features?.[0]?.properties?.full_address || "";
}

// Get direction  -------------------------------------------------------------------------------
type TGetDirectionPayload = {
  source: {
    lat?: number;
    lon?: number;
  };
  destination: {
    lat?: number;
    lon?: number;
  };
};
export type TRouteResponse = {
  routes: {
    weight_name: string;
    weight: number;
    duration: number;
    distance: number;
    legs: {
      notifications: {
        details: {
          actual_value: string;
          message: string;
        };
        subtype: string;
        type: string;
        geometry_index_end: number;
        geometry_index_start: number;
      }[];
      via_waypoints: any[]; // Empty array, adjust if more details available
      admins: {
        iso_3166_1_alpha3: string;
        iso_3166_1: string;
      }[];
      weight: number;
      duration: number;
      steps: any[]; // Empty array, adjust if more details available
      distance: number;
      summary: string;
    }[];
    geometry: string;
  }[];
  waypoints: {
    distance: number;
    name: string;
    location: [number, number];
  }[];
  code: string;
  uuid: string;
};
export async function getDirection({
  source,
  destination,
}: TGetDirectionPayload) {
  const endpoint = `${MapTypes.MAPBOX_DIRECTIONS_API}/mapbox/driving/${source.lon || 0},${source.lat || 0};${
    destination.lon || 0
  },${destination.lat || 0}?access_token=${MapTypes.MAPBOX_PUBLIC_ACCESS_TOKEN}`;
  const response = await axios.get(endpoint);
  const routes = response.data as TRouteResponse;
  return routes?.routes?.[0] || null;
}

// Open in Google Maps  -------------------------------------------------------------------------------
export function openInGoogleMaps(latitude: number = 0, longitude: number = 0) {
  const url = `https://www.google.com/maps/?q=${latitude},${longitude}`;
  Linking.openURL(url).catch((err) => console.error("An error occurred", err));
}
