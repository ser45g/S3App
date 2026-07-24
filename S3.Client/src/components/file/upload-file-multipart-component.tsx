import { observer } from "mobx-react-lite";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { StoreContext } from "@/main";
import { useContext, useState, type ChangeEvent } from "react";

const UploadFileMultipartComponent = () => {
  const { store } = useContext(StoreContext);

  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const [uploadedFileKey, setUploadedFileKey] = useState("");
  const [error, setError] = useState("");

  const uploadFileMultipartToS3 = async () => {
    if (!uploadFile) {
      setError("Please select a file to upload");
      return;
    }
    try {
      await store.startMultipartUpload(uploadFile);

      const partSize = 10 * 1024 * 1024; // 100MB parts
      store.prepareParts(uploadFile, partSize);

      await store.uploadParts();
    } catch (er) {
      setError("Couldn't upload a multipart file");
    }
  };

  const pauseFileMultipartUploadToS3 = () => {store.togglePauseResume()};

  const fileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      clearFileds();
      setUploadFile(file);
    }
  };

  const clearFileds = () => {
    setError("");
    setUploadedFileKey("");
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Multipart Upload</h2>

        <Input
          type="file"
          onChange={fileSelected}
          id="fileInputMultipart"
          className="mb-4 w-full"
        />
        {store.multipartUploadState &&
           
            <div className=" mb-4">
              <div className="bg-gray-200 rounded-full h-2.5">
                <div
                  id="progressBar"
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{
                    width: `${store.multipartUploadState?.loadingPercent ?? 0}%`,
                  }}
                ></div>
              </div>
              <p id="progressText" className="text-sm mt-1">
                {`${store.multipartUploadState?.loadingPercent?.toFixed(2) ?? 0}%`}
              </p>

            </div>
          }

        <Button
          id="uploadButtonMultipart"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full"
          onClick={uploadFileMultipartToS3}
        >
          Upload File (Multipart)
        </Button>

        {store.multipartUploadState && (
          <Button
            id="pauseResumeButton"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded w-full mt-2 "
            onClick={pauseFileMultipartUploadToS3}
          >
            {store.multipartUploadState.isPaused?"Resume":"Pause"}
          </Button>
        )}
      </div>

      {error && (
        <div className="text-sm mt-1 break-all text-red-400 hover:text-red-600">
          {error}
        </div>
      )}

      {uploadedFileKey && (
        <div className="mt-4 text-sm text-gray-700 hover:text-green-900">{`Uploaded file key: ${uploadedFileKey}`}</div>
      )}

    </>
  );
};

export default observer(UploadFileMultipartComponent);
