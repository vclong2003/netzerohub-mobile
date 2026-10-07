import { useMutation } from "@tanstack/react-query";
import { api } from "./_config.api";
import { IRnFile } from "./_types";

export namespace StorageMutations {
  export interface IUploadFilePayload {
    file: IRnFile;
  }

  export interface IUploadFileResponse {
    bucketUrl: string;
  }

  export function useUploadFile() {
    return useMutation<IUploadFileResponse, Error, IUploadFilePayload>({
      mutationKey: ["useUploadFile"],
      mutationFn: async ({ file }) => {
        const formData = new FormData();

        formData.append("file", {
          uri: file.uri,
          name: file.name,
          type: file.type,
        } as unknown as Blob);

        const response = await api.post<IUploadFileResponse>(
          "/storage/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        return response as unknown as Promise<IUploadFileResponse>;
      },
    });
  }
}
