import { getPresignedUrlForUpload } from "@/api/services/file";
import { useCallback, useRef, useState } from "react";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface UseFileUploadResult {
  status: UploadStatus;
  progress: number; // 0..100
  error: string | undefined;
  key: string| undefined;
  upload: (file: File) => Promise<void>;
  cancel: () => void;
  reset: () => void;
}

export function useFileUpload(): UseFileUploadResult {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [key, setKey] = useState<string|undefined>(undefined);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | undefined>(undefined);

  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const upload = useCallback(async (file: File) => {
    setStatus("uploading");
    setProgress(0);
    setError(undefined);

    try {
      const { url, key: fileKey } = await getPresignedUrlForUpload(file.name, file.type);

      console.log(url)

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;

        xhr.upload.addEventListener("progress", (event) => {
          if (!event.lengthComputable) return;
          const percent = Math.round((event.loaded / event.total) * 100);

          setProgress((prev) => {
            return percent !== prev ? percent : prev;
          });
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setProgress(100);
            setStatus("success");
            setKey(fileKey);
            resolve();
          } else {
            const msg = `Upload failed with status ${xhr.status}`;
            setError(msg);
            setStatus("error");
            reject(new Error(msg));
          }
        });

        xhr.addEventListener("error", () => {
          const msg = "Network error during upload";
          setError(msg);
          setStatus("error");
          reject(new Error(msg));
        });

        xhr.addEventListener("abort", () => {
          setError("Upload cancelled");
          setStatus("idle");
          reject(new DOMException("Aborted", "AbortError"));
        });

        xhr.open("PUT", url);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.setRequestHeader("x-amz-meta-file-name", file.name);
        xhr.send(file);
      });
    } catch (err) {
      // Ошибки получения presigned URL (axios) уже нормализованы интерцептором
      if ((err as Error).name !== "AbortError") {
        const message =
          (err as { message?: string }).message ?? "Upload failed";
        setError(message);
        console.log(message)
        setStatus("error");
      }
      throw err; // пробрасываем дальше, если вызывающий хочет знать
    } finally {
      xhrRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    xhrRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    setKey(undefined);
    setStatus("idle");
    setProgress(0);
    setError(undefined);
  }, []);

  return { status, progress, error, key, upload, cancel, reset };
}
