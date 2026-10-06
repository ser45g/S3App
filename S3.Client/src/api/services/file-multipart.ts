import { api } from "../clients";
import type { PresignedUrlApiResponse } from "./file";

export interface StartMultipartResponse {
  uploadId: string;
  key: string;
}

export interface CompleteMultipartUploadResponse{
  key: string;
  url: string;
}

export interface UploadedPart {
  PartNumber: number;
  ETag: string;
}


export const multipartApi = {
  start: async (
    fileName: string,
    contentType: string,
  ): Promise<StartMultipartResponse> => {
    const { data } = await api.post<StartMultipartResponse>(
      '/multipart/images/start-multipart',
      null,
      { params: { fileName, contentType } },
    );
    return data;
  },

  getPartUrl: async (
    key: string,
    uploadId: string,
    partNumber: number,
  ): Promise<PresignedUrlApiResponse> => {
    const { data } = await api.post<PresignedUrlApiResponse>(
      `/multipart/images/${encodeURIComponent(key)}/presigned-part`,
      null,
      { params: { uploadId, partNumber } },
    );
    return data;
  },

  complete: async (
    key: string,
    uploadId: string,
    parts: UploadedPart[],
  ): Promise<CompleteMultipartUploadResponse> => {
    return await api.post(
      `/multipart/images/${encodeURIComponent(key)}/complete-multipart`,
      { key, uploadId, parts },
    );
  },

  abort: async (key: string, uploadId: string): Promise<void> => {
    await api.delete(
      `/multipart/images/${encodeURIComponent(key)}/abort-multipart`,
      { params: { uploadId } },
    );
  },
  
};