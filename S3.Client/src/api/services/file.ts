import type { AxiosResponse } from "axios";
import { api } from "../clients";

export interface PresignedUrlApiResponse{
  key:string;
  url: string;
}

export async function  getPresignedUrlForUpload(fileName: string, contentType: string) {

  const {data} = await api.post<PresignedUrlApiResponse>(`/file/images/presigned?`, null, { params: { fileName, contentType } },);

  return data;
}

export async function getPresignedUrlForDownload(key: string):Promise<PresignedUrlApiResponse> {
  
  const {data} = await api.get<PresignedUrlApiResponse>(`/file/images/${encodeURIComponent(key)}/presigned`);

  return data;
}
