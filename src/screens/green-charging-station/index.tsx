import { GreenChargingStationsContext } from "./context";
import { Map } from "./map";

export function GreenChargingStations() {
  return (
    <GreenChargingStationsContext>
      <Map />
    </GreenChargingStationsContext>
  );
}
