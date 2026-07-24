import { StoreContext } from "@/main";
import { useContext, useState, type ChangeEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { observer } from "mobx-react-lite";
import { isError } from "@/lib/utils";

const UploadFileComponent = () => {
  const { store } = useContext(StoreContext);

  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const [error, setError] = useState("");

  const [uploadedFileKey, setUploadedFileKey] = useState("");

  const fileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      clearFileds();
      setUploadFile(file);
    }
  };

  const clearFileds = ()=>{
    setError("");
    setUploadedFileKey("");
  }

  const uploadFileToS3 = async () => {
    
    clearFileds();

    if (!uploadFile) {
      setError("Please select a file");
      return;
    }

    try {
      const { key, url } = await store.getPresignedUrlForUpload(
        uploadFile.name,
        uploadFile.type,
      );

      await store.uploadFileToS3(url, uploadFile);

      setUploadedFileKey(key);
    } catch (error) {
      if(isError(error)){
        setError(error.message);
      }else{
        setError("Could not upload the file");
      }
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Standard Upload</h2>
      <Input
        type="file"
        onChange={fileSelected}
        id="fileInput"
        className="mb-4 w-full"
      />

      {store.fileUploadState &&
        store.fileUploadState.loadingPercent !== null && (
          <div className=" mb-4">
            <div className="bg-gray-200 rounded-full h-2.5">
              <div
                id="progressBar"
                className="bg-green-600 h-2.5 rounded-full"
                style={{
                  width: `${store.fileUploadState?.loadingPercent ?? 0}%`,
                }}
              ></div>
            </div>
            <p id="progressText" className="text-sm mt-1">
              {`${store.fileUploadState?.loadingPercent.toFixed(2) ?? 0}%`}
            </p>

            <Button
              className="bg-red-300 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full"
              onClick={() => store.abortFileUpload()}
            >
              Stop
            </Button>
          </div>
        )}

      <Button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
        onClick={uploadFileToS3}
      >
        Upload File
      </Button>

      {error && (
        <div className="text-sm mt-1 break-all text-red-400 hover:text-red-600">
          {error}
        </div>
      )}

      {uploadedFileKey && (
        <div className="mt-4 text-sm text-gray-700 hover:text-green-900">{`Uploaded file key: ${uploadedFileKey}`}</div>
      )}
    </div>
  );
};

export default observer(UploadFileComponent);
