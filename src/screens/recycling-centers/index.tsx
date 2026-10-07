import { RecyclingCentersContext } from "./context";
import { Map } from "./map";

export function RecyclingCenters() {
  return (
    <RecyclingCentersContext>
      <Map />
    </RecyclingCentersContext>
  );
}
