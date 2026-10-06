import { createMMKV } from "react-native-mmkv";
import { AuthTypes } from "./types";

const storage = createMMKV({ id: "auth-storage" });

export namespace AuthStorage {
  export const getAccessToken = (): string | null => {
    return storage.getString(AuthTypes.ACCESS_TOKEN_STORAGE_KEY) ?? null;
  };

  export const setAccessToken = (accessToken: string) => {
    if (!accessToken) return;
    storage.set(AuthTypes.ACCESS_TOKEN_STORAGE_KEY, accessToken);
  };

  export const getRefreshToken = (): string | null => {
    return storage.getString(AuthTypes.REFRESH_TOKEN_STORAGE_KEY) ?? null;
  };

  export const setRefreshToken = (refreshToken: string) => {
    if (!refreshToken) return;
    storage.set(AuthTypes.REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  };

  export const clearAuthStorage = () => {
    storage.remove(AuthTypes.ACCESS_TOKEN_STORAGE_KEY);
    storage.remove(AuthTypes.REFRESH_TOKEN_STORAGE_KEY);
  };
}
