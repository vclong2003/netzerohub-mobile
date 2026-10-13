import { useQuery } from "@tanstack/react-query";
import { api } from "./_config.api";
import { IPageResponse } from "./_types";

export interface IAcceptedWasteType {
  code: string;
  id: number;
  name: string;
}

export interface IRecyclingCentre {
  acceptedWasteTypes: IAcceptedWasteType[];
  address: string;
  closingTime: string;
  id: number;
  imageUrls: string[];
  infoSheetUrls: string[];
  latitude: number;
  longitude: number;
  name: string;
  openingTime: string;
}

export namespace RecyclingCentresQueries {
  interface IGetRecyclingCentresPayload {
    page?: number;
    pageSize?: number;
  }

  export const useGetRecyclingCentres = (
    payload: IGetRecyclingCentresPayload,
  ) => {
    return useQuery<IPageResponse<IRecyclingCentre>>({
      queryKey: ["useGetRecyclingCentres", payload],
      queryFn: ({ signal }) =>
        api.get("/recycling-centres", { params: payload, signal }),
    });
  };

  export const useGetRecyclingCentreById = (recyclingCentreId?: number) => {
    return useQuery<IRecyclingCentre>({
      queryKey: ["useGetRecyclingCentreById", recyclingCentreId],
      queryFn: ({ signal }) =>
        api.get(`/recycling-centres/${recyclingCentreId}`, { signal }),
      enabled:
        typeof recyclingCentreId === "number" &&
        !isNaN(recyclingCentreId) &&
        recyclingCentreId > 0,
    });
  };
}
