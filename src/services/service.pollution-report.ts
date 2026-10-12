import { useInfiniteQuery } from "@tanstack/react-query";

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

export interface IPollutionReportItem {
  id: string;
  title: string;
  description: string;
  type: EPollutionType;
  status: EPollutionReportStatus;
  imageUrl?: string;
  address?: string;
  createdAt: string;
}

export interface IPageResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

const ALL_MOCK_REPORTS: IPollutionReportItem[] = Array.from(
  { length: 25 },
  (_, i) => {
    const index = i + 1;
    const statuses = [
      EPollutionReportStatus.Pending,
      EPollutionReportStatus.Acknowledged,
      EPollutionReportStatus.Processed,
      EPollutionReportStatus.Resolved,
      EPollutionReportStatus.Rejected,
    ];
    const types = [
      EPollutionType.Litter,
      EPollutionType.Water,
      EPollutionType.Land,
      EPollutionType.Air,
      EPollutionType.Noise,
    ];
    const sampleImages = [
      "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop",
      undefined, // reports without photos
    ];

    return {
      id: `rep-${index}`,
      title: `Pollution Incident #${index} - ${types[i % types.length]}`,
      description: `Reported environmental hazard near local public grounds. Visible contamination detected.`,
      type: types[i % types.length],
      status: statuses[i % statuses.length],
      imageUrl: sampleImages[i % sampleImages.length],
      address: "Northfields Ave, Keiraville NSW 2500",
      createdAt: new Date(Date.now() - i * 86400000 * 2.5).toISOString(),
    };
  },
);

async function mockFetchReports({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}): Promise<IPageResponse<IPollutionReportItem>> {
  await new Promise((res) => setTimeout(res, 800));

  const start = page * pageSize;
  const end = start + pageSize;
  const pagedData = ALL_MOCK_REPORTS.slice(start, end);
  const total = ALL_MOCK_REPORTS.length;

  return {
    data: pagedData,
    total,
    page,
    pageSize,
    hasMore: end < total,
  };
}

export namespace PollutionReportQueries {
  export function useGetMyReports(pageSize = 6) {
    return useInfiniteQuery({
      queryKey: ["useGetMyPollutionReports"],
      queryFn: ({ pageParam = 0 }) =>
        mockFetchReports({ page: pageParam, pageSize }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.page + 1 : undefined,
    });
  }
}
