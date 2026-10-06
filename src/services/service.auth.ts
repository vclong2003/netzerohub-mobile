import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./_config.api";
import { IAccount } from "./_types";

export namespace AuthQueries {
  export function useMyAccount() {
    return useQuery<IAccount>({
      queryKey: ["useMyAccount"],
      queryFn: ({ signal }) => api.get("/account/me", { signal }),
      retry: 1,
    });
  }
}
export namespace AuthMutations {
  export interface ILoginPayload {
    email: string;
    password: string;
  }

  export interface ILoginResponse {
    accessToken: string;
    refreshToken: string;
  }

  export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation<ILoginResponse, unknown, ILoginPayload>({
      mutationKey: ["useLogin"],
      mutationFn: (payload: ILoginPayload) => api.post("/auth/login", payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["useMyAccount"] });
      },
    });
  }
}
