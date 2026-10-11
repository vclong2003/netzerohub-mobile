import { useQuery } from "@tanstack/react-query";
import { api } from "./_config.api";
import { IPageResponse } from "./_types";

export enum EPlugStatus {
  Available = "Available",
  Occupied = "Occupied",
  OutOfService = "OutOfService",
  Faulted = "Faulted",
}

export enum EPlugType {
  TYPE1 = "TYPE1",
  TYPE2 = "TYPE2",
  CCS = "CCS",
  CHAdeMO = "CHAdeMO",
  TESLA = "TESLA",
}

export enum ECurrentType {
  AC = "AC",
  DC = "DC",
}

export interface IPlug {
  id: number;
  identifier: string;
  status: EPlugStatus;
  type: EPlugType;
  currentType: ECurrentType;
  powerKw: number;
  createdAt: string;
  updatedAt: string;
}

export enum EStationStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export interface IStation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  renewableEnergyPercent: number;
  status: EStationStatus;
  imageUrls: string[];
  plugs: IPlug[];
  createdAt: string;
  updatedAt: string;
}

export namespace GreenChargingStationsQueries {
  export interface IGetStationsPayload {
    name?: string;
    status?: EStationStatus;
    renewableEnergyPercent?: number;
    plugType?: EPlugType;
    page?: number;
    pageSize?: number;
  }

  export function useGetStations(payload: IGetStationsPayload) {
    return useQuery<IPageResponse<IStation>>({
      queryKey: ["useGetStations", payload],
      queryFn: ({ signal }) =>
        api.get("/green-charging-stations", { params: payload, signal }),
    });
  }

  export function useGetStationById(stationId?: number) {
    return useQuery<IStation>({
      queryKey: ["useGetStationById", stationId],
      queryFn: ({ signal }) =>
        api.get(`/green-charging-stations/${stationId}`, { signal }),
      enabled: typeof stationId === "number" && !isNaN(stationId) && stationId > 0,
    });
  }
}
