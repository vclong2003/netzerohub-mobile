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

  export interface IRegisterPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    phone?: string;
  }

  export interface IVerifyAccountPayload {
    email: string;
    otp: string;
  }

  export interface IUpdateAccountPayload {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    phone?: string;
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

  export function useUpdateAccount() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationKey: ["useUpdateAccount"],
      mutationFn: (payload: IUpdateAccountPayload) =>
        api.put("/account/me", payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["useMyAccount"] });
      },
    });
  }

  export function useRegister() {
    return useMutation({
      mutationKey: ["useRegister"],
      mutationFn: (payload: IRegisterPayload) =>
        api.post("/auth/register", payload),
    });
  }

  export function useVerifyAccount() {
    return useMutation({
      mutationKey: ["useVerifyAccount"],
      mutationFn: (payload: IVerifyAccountPayload) =>
        api.post("/auth/verify", payload),
    });
  }
}
