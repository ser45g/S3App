import { API_BASE_URL } from "@/constants";
import { makeAutoObservable } from "mobx";

type Part = {
  start: number;
  end: number;
};

type UploadedPart = {
  PartNumber: number;
  ETag: string;
};

type MultipartUploadState = {
  currentPart: number;
  file: File | null;
  parts: Part[];
  isPaused: boolean;
  key: string;
  uploadId: string;
  loadingPercent:number|null;
  uploadedParts: UploadedPart[];
};

type FileUploadState = {
  loadingPercent: number | null;
  isPaused: boolean;
  isAbortRequested: boolean;
};

export default class FileOperationsStore {
  constructor() {
    makeAutoObservable(this);
  }

  multipartUploadState: MultipartUploadState | null = null;

  fileUploadState: FileUploadState | null = null;

  abortFileUpload() {
    if (this.fileUploadState) 
      this.fileUploadState.isAbortRequested = true;
  }
  

  async uploadFileToS3(url: string, file: File) {
    this.fileUploadState = {
      loadingPercent: null,
      isPaused: false,
      isAbortRequested: false,
    } as FileUploadState;

    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url, true);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.setRequestHeader("x-amz-meta-file-name", file.name);

      xhr.upload.onprogress = (event) => {
        if (this.fileUploadState?.isAbortRequested) {
          xhr.abort();
          reject(new Error("Upload was aborted"));
        }

        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          this.fileUploadState!.loadingPercent = percentComplete;
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
    }).finally(() => {
      this.fileUploadState = null;
    });
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

  async getPresignedUrl(key: string) {
    const response = await fetch(
      `${API_BASE_URL}/file/images/${encodeURIComponent(key)}/presigned`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.url;
  }

  prepareParts(file: File, partSize: number) {

    if(!this.multipartUploadState)
      throw new Error("Multipart Upload state is null");

    const parts: Part[] = [];
    for (let i = 0; i < file.size; i += partSize) {
      parts.push({
        start: i,
        end: Math.min(i + partSize, file.size),
      } as Part);
    }
    this.multipartUploadState.parts=parts;
  }

  async startMultipartUpload(file: File) {
    const params = new URLSearchParams({
      fileName: file.name,
      contentType: file.type,
    });

    const response = await fetch(
      `${API_BASE_URL}/multipart/images/start-multipart?${params}`,
      {
        method: "POST",
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { uploadId, key } = await response.json();

    this.multipartUploadState = {
      currentPart: 0,
      file: file,
      parts: [],
      isPaused: false,
      loadingPercent: null,
      key,
      uploadId,
      uploadedParts: [],
    };
    
    return { uploadId, key };
  }

  async getPresignedUrlForPart(
    key: string,
    uploadId: string,
    partNumber: number,
  ) {
    const response = await fetch(`${API_BASE_URL}/multipart/images/${encodeURIComponent(key)}/presigned-part?uploadId=${uploadId}&partNumber=${partNumber}`,
      {
        method: "POST",
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async completeMultipartUpload(key: string, uploadId: string, parts: UploadedPart[]) {

    const response = await fetch(`${API_BASE_URL}/multipart/images/${encodeURIComponent(key)}/complete-multipart`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, uploadId, parts }),
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async uploadPart(url: string, part: Blob) {
    return fetch(url, {
      method: "PUT",
      body: part,
    });
  }

  async uploadParts() {
    if (this.multipartUploadState === null)
      throw new Error("Multipart update state was null");

    while (this.multipartUploadState.currentPart < this.multipartUploadState.parts.length && !this.multipartUploadState.isPaused) {
      const part = this.multipartUploadState.parts[this.multipartUploadState.currentPart];

      if (!this.multipartUploadState.file) {
        return;
      }
      const partFile = this.multipartUploadState.file.slice(part.start, part.end);

      try {
        const { url } = await this.getPresignedUrlForPart(this.multipartUploadState.key, this.multipartUploadState.uploadId, this.multipartUploadState.currentPart + 1,
        );
        const uploadPartResponse = await this.uploadPart(url, partFile);

        if (uploadPartResponse.ok) {

          const etag = uploadPartResponse.headers.get("etag");
         
          this.multipartUploadState.uploadedParts.push({
            PartNumber: this.multipartUploadState.currentPart + 1,
            ETag: etag ?? "",
          } as UploadedPart);

          this.multipartUploadState.loadingPercent = 100*this.multipartUploadState.uploadedParts.length/this.multipartUploadState.parts.length;
          //this.updatePartProgress(partProgressElement, 100);
        } else {
          //this.updatePartProgress(partProgressElement, 0, "Failed");
        }
      } catch (error) {
        console.error(
          `Error uploading part ${this.multipartUploadState.currentPart + 1}:`,
          error,
        );
        //this.updatePartProgress(partProgressElement, 0, "Failed");
      }

      this.multipartUploadState.currentPart++;
    }

    if (this.multipartUploadState.currentPart === this.multipartUploadState.parts.length && !this.multipartUploadState.isPaused) {
      const result = await this.completeMultipartUpload(
        this.multipartUploadState.key,
        this.multipartUploadState.uploadId,
        this.multipartUploadState.uploadedParts,
      );

      alert("File uploaded successfully using multipart upload!");
      this.resetMultipartUploadState();
    }
  }

  resetMultipartUploadState() {
    this.multipartUploadState = null;
  }

  togglePauseResume() {
    if (this.multipartUploadState !== null) {
      this.multipartUploadState.isPaused = !this.multipartUploadState.isPaused;
      if (!this.multipartUploadState.isPaused) {
        this.uploadParts();
      }
    }
    if (this.fileUploadState !== null) {
      this.fileUploadState.isPaused = !this.fileUploadState.isPaused;
    }
  }
}
