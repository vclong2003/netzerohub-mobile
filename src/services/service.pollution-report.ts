import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "./_config.api";
import { IPageResponse } from "./_types";

export enum EPollutionReportStatus {
  Pending = "PENDING",
  Acknowledged = "ACKNOWLEDGED",
  Processed = "PROCESSED",
  Resolved = "RESOLVED",
  Rejected = "REJECTED",
}

export enum EPollutionType {
  Litter = "LITTER",
  Land = "LAND",
  Water = "WATER",
  Air = "AIR",
  Noise = "NOISE",
}

export interface IPollutionReport {
  id: string;
  title: string;
  description: string;
  type: EPollutionType;
  status: EPollutionReportStatus;
  imageUrl?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt?: string;
}

export namespace PollutionReportQueries {
  export interface IGetMyReportsPayload {
    pageSize: number;
  }

  export function useGetMyReports(payload: IGetMyReportsPayload) {
    return useInfiniteQuery<IPageResponse<IPollutionReport>>({
      queryKey: ["useGetMyPollutionReports", payload],
      queryFn: ({ signal, pageParam }) =>
        api.get("/pollution-reports/my", {
          params: { ...payload, page: pageParam },
          signal,
        }),
      initialPageParam: 0,
      getNextPageParam: (currentPage) =>
        currentPage.hasNext ? currentPage.page + 1 : undefined,
    });
  }
}

export namespace PollutionReportMutations {
  export interface ICreatePollutionReportPayload {
    title: string;
    description: string;
    type: EPollutionType;
    imageUrl?: string;
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  }

  export function useCreatePollutionReport() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationKey: ["useCreatePollutionReport"],
      mutationFn: (payload: ICreatePollutionReportPayload) =>
        api.post("/pollution-reports", payload),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["useGetMyPollutionReports"],
        });
      },
    });
  }
}
