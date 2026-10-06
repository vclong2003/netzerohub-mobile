import { useQuery } from "@tanstack/react-query";
import { api } from "./_config.api";
import { IAccount } from "./_types";

export namespace AuthQueries {
  export function useMyAccount() {
    return useQuery<IAccount>({
      queryKey: ["useMyAccount"],
      queryFn: ({ signal }) => api.get("/auth", { signal }),
      retry: 1,
    });
  }
}
