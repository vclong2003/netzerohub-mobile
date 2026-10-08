import { useSearchLocation } from "@/hooks/use-search-location";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Geolocation from "@react-native-community/geolocation";
import { useEffect } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGreenChargingStationsContext } from "./context";

export function SearchBar() {
  const { setSelectedLocation, selectedLocation } =
    useGreenChargingStationsContext();
  const { query, setQuery, suggestions, setUserLocation } = useSearchLocation();
  const { top } = useSafeAreaInsets();

  useEffect(() => {
    if (!query) return setSelectedLocation(undefined);
    Geolocation.getCurrentPosition((pos) =>
      setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
    );
  }, [query]);

  return (
    <>
      <View style={[styles.wrapper, { top }]}>
        <SimpleLineIcons name="magnifier" size={22} color="#128085" />
        <TextInput
          placeholder="Enter street, suburb or postcode"
          style={styles.textInput}
          value={query}
          onChangeText={setQuery}
          clearButtonMode="while-editing"
        />
        {!!query && (
          <MaterialIcons
            name="cancel"
            size={20}
            color="#747474"
            onPress={() => {
              setQuery("");
              Keyboard.dismiss();
            }}
          />
        )}
        <View style={{ width: 1 }} />
        <TouchableOpacity>
          <FontAwesome6 name="filter" size={18} color="#747474" />
        </TouchableOpacity>
      </View>

      {!selectedLocation && query && suggestions.length > 0 && (
        <View style={[styles.suggestions, { top: top + 65 }]}>
          {suggestions.map((suggestion, index) => (
            <Text
              key={index}
              style={{ marginBottom: 14 }}
              onPress={() => setSelectedLocation(suggestion)}>
              {suggestion.address}
            </Text>
          ))}
        </View>
      )}
    </>
  );
}

export const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    zIndex: 1,
    left: 20,
    right: 20,

    backgroundColor: "rgb(255, 255, 255)",

    padding: 14,
    borderRadius: 12,

    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  textInput: {
    color: "#128085",
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: 0,
  },

  suggestions: {
    position: "absolute",
    zIndex: 2,

    left: 20,
    right: 20,

    backgroundColor: "rgb(255, 255, 255)",

    padding: 14,
    paddingBottom: 0,
    borderRadius: 12,
  },
});
