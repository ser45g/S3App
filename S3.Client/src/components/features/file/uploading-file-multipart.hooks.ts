import { multipartApi, type UploadedPart } from '@/api/services/file-multipart';
import { useCallback, useRef, useState } from 'react';


export type MultipartStatus =
  | 'idle'
  | 'uploading'
  | 'paused'
  | 'success'
  | 'error'
  | 'aborted';

export interface UseMultipartUploadOptions {
  partSize?: number;         // по умолчанию 5 МБ (минимум S3)
  concurrency?: number;      // сколько частей грузить параллельно
  maxRetries?: number;       // ретраев на часть
}

export interface UseMultipartUploadResult {
  status: MultipartStatus;
  progress: number;          // 0..100, по байтам
  error: string | null;
  key: string | null;
  upload: (file: File) => Promise<void>;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
  reset: () => void;
}

export function useMultipartUpload(
  options: UseMultipartUploadOptions = {},
): UseMultipartUploadResult {
  const {
    partSize = 100 * 1024 * 1024,
    concurrency = 3,
    maxRetries = 3,
  } = options;

  const [status, setStatus] = useState<MultipartStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState<string|null>(null);

  // Всё «рабочее» состояние — в ref, чтобы не плодить ререндеры
  const abortRef = useRef<AbortController | null>(null);
  const pausedRef = useRef(false);
  const pauseResolversRef = useRef<Array<() => void>>([]);
  const uploadedBytesRef = useRef(0);
  const fileSizeRef = useRef(0);

  const waitIfPaused = useCallback(async () => {
    if (!pausedRef.current) return;
    await new Promise<void>((resolve) => {
      pauseResolversRef.current.push(resolve);
    });
  }, []);

  const updateProgress = useCallback((loaded: number) => {
    uploadedBytesRef.current = loaded;
    const percent = fileSizeRef.current
      ? Math.min(100, Math.round((loaded / fileSizeRef.current) * 100))
      : 0;
    setProgress(percent);
  }, []);

  const upload = useCallback(
    async (file: File) => {
      setStatus('uploading');
      setProgress(0);
      setError(null);
      pausedRef.current = false;
      pauseResolversRef.current = [];
      uploadedBytesRef.current = 0;
      fileSizeRef.current = file.size;

      const controller = new AbortController();
      abortRef.current = controller;

      
      let uploadId: string | null = null;
      let key: string|null=null;

      try {
        // 1. Стартуем multipart
        const start = await multipartApi.start(file.name, file.type);
        
        uploadId = start.uploadId;
        key = start.key;

        if(!uploadId )
          throw new Error("UploadId can't be empty")

        if(!key)
          throw new Error("Key can't be null");

        // 2. Готовим разбиение на части
        const parts: Array<{ PartNumber: number; Blob: Blob; Size: number }> = [];
        let partNumber = 1;
        for (let i = 0; i < file.size; i += partSize) {
          const end = Math.min(i + partSize, file.size);
          parts.push({
            PartNumber: partNumber++,
            Blob: file.slice(i, end),
            Size: end - i,
          });
        }

        const uploaded: UploadedPart[] = [];
        let nextIndex = 0;

        // 3. Параллельная загрузка частей с ограничением concurrency
        const worker = async () => {
          while (true) {
            if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
            await waitIfPaused();
            if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');

            const index = nextIndex++;
            if (index >= parts.length) return;

            const part = parts[index];
            let lastErr: unknown = null;

            for (let attempt = 0; attempt < maxRetries; attempt++) {
              try {
                const { url } = await multipartApi.getPartUrl(
                  key!,
                  uploadId!,
                  part.PartNumber,
                );

                let partLoaded = 0;
                const etag = await uploadPart(
                  url,
                  part.Blob,
                  controller.signal,
                  (loaded) => {
                    // Прогресс: уже загруженные байты + текущая часть
                    const delta = loaded - partLoaded;
                    partLoaded = loaded;
                    updateProgress(uploadedBytesRef.current + delta);
                  },
                );

                // Синхронизируем: часть завершена
                uploadedBytesRef.current += part.Size - partLoaded;
                updateProgress(uploadedBytesRef.current);

                uploaded.push({ PartNumber: part.PartNumber, ETag: etag });
                lastErr = null;
                break;
              } catch (err) {
                if ((err as Error).name === 'AbortError') throw err;
                lastErr = err;
                // экспоненциальная задержка перед ретраем
                await new Promise((r) => setTimeout(r, 300 * 2 ** attempt));
              }
            }

            if (lastErr) throw lastErr;
          }
        };

        await Promise.all(
          Array.from({ length: Math.min(concurrency, parts.length) }, worker),
        );

        // 4. Завершаем multipart (порядок по PartNumber важен!)
        uploaded.sort((a, b) => a.PartNumber - b.PartNumber);
        await multipartApi.complete(key, uploadId, uploaded);

        setKey(start.key);

        setProgress(100);
        setStatus('success');
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          // Отмена — попытаемся отменить multipart на бэке
          if (key && uploadId) {
            try {
              await multipartApi.abort(key, uploadId);
            } catch {
              /* ignore */
            }
          }
          setStatus('aborted');
          return;
        }

        const message =
          (err as { message?: string }).message ?? 'Upload failed';
        setError(message);
        setStatus('error');
        throw err;
      } finally {
        abortRef.current = null;
      }
    },
    [partSize, concurrency, maxRetries, waitIfPaused, updateProgress],
  );

  const pause = useCallback(() => {
    if (pausedRef.current) return;
    pausedRef.current = true;
    setStatus('paused');
  }, []);

  const resume = useCallback(() => {
    if (!pausedRef.current) return;
    pausedRef.current = false;
    setStatus('uploading');
    const resolvers = pauseResolversRef.current;
    pauseResolversRef.current = [];
    resolvers.forEach((r) => r());
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setProgress(0);
    setError(null);
    pausedRef.current = false;
    pauseResolversRef.current = [];
    uploadedBytesRef.current = 0;
    fileSizeRef.current = 0;
  }, []);

  return { status, progress, error, key, upload, pause, resume, cancel, reset };
}

function uploadPart(
  url: string,
  blob: Blob,
  signal: AbortSignal,
  onProgress: (loaded: number, total: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    const abortHandler = () => xhr.abort();
    signal.addEventListener('abort', abortHandler);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) onProgress(e.loaded, e.total);
    });

    xhr.addEventListener('load', () => {
      signal.removeEventListener('abort', abortHandler);
      if (xhr.status >= 200 && xhr.status < 300) {
        const etag = xhr.getResponseHeader('ETag');
        if (!etag) {
          reject(new Error('Missing ETag in response'));
          return;
        }
        resolve(etag);
      } else {
        reject(new Error(`Part upload failed: ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      signal.removeEventListener('abort', abortHandler);
      reject(new Error('Network error during part upload'));
    });

    xhr.addEventListener('abort', () => {
      signal.removeEventListener('abort', abortHandler);
      reject(new DOMException('Aborted', 'AbortError'));
    });

    xhr.open('PUT', url);
    xhr.send(blob);
  });
}
