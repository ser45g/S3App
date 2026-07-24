import { API_BASE_URL } from "@/constants";

export async function getPresignedUrlToGetFile(key: string) {
  const response = await fetch(
    `${API_BASE_URL}/file/images/${encodeURIComponent(key)}/presigned`,
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.url;
}

export type UploadOptions = {
  onProgress?: (percent: number) => void;
};

export default class FileUploadService {
  private isAborted: boolean = false;

  async uploadFileToS3(url: string, file: File, options?: UploadOptions) {
    try {

      if(this.isAborted)
        throw new Error("Aborted")

      return new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.setRequestHeader("x-amz-meta-file-name", file.name);

        xhr.upload.onprogress = (event) => {
          if (this.isAborted) {
            xhr.abort();
            reject(new Error("Upload was aborted"));
          }

          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;

            if (options?.onProgress) {
              options.onProgress(percentComplete);
            }
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error occurred"));

        xhr.send(file);
      });
    } finally {
      this.isAborted=false;
    }
  }

  abortUpload(){
    this.isAborted=true;
  }

  async getPresignedUrlForUpload(fileName: string, contentType: string) {
    const params = new URLSearchParams({
      fileName: fileName,
      contentType: contentType,
    });

    const response = await fetch(
      `${API_BASE_URL}/file/images/presigned?${params}`,
      {
        method: "POST",
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
}
