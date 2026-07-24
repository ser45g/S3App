import { useContext, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { StoreContext } from "@/main";

const GetFileByKeyComponent = () => {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");

  const [url, setUrl] = useState("");

  const { store } = useContext(StoreContext);

  const getFileByKeyFromS3 = async () => {
    if(!key){
      setError("Please enter a key")
      return;
    }
    
    clearFetchResults();


    try {
      const presignedUrl = await store.getPresignedUrl(key);
      setUrl(presignedUrl);
    } catch (error) {
      setError("Could not get the specified file");
    }
  };

  const clearFields = () => {
    setKey("");
    clearFetchResults();
  };

  const clearFetchResults = () => {
    setError("");
    setUrl("");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Get Pre-signed URL</h2>
      <Input
        type="text"
        value={key}
        onChange={(event) => setKey(event.currentTarget.value)}
        id="objectKeyInput"
        placeholder="Enter object key"
        className="w-full px-3 py-2 border rounded-md mb-4"
      />
      <div className="flex space-x-2 mb-1">
        <Button
          id="getUrlButton"
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded grow"
          onClick={getFileByKeyFromS3}
        >
          Get Pre-signed URL
        </Button>
        <Button
          id="clearButton"
          className="bg-teal-400 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
          onClick={clearFields}
        >
          Clear
        </Button>
        
      </div>

      {url !== null && (
        <a
          id="presignedUrlResult"
          href={url}
          target="_blank"
          className="text-sm break-all text-blue-600 hover:text-blue-800 italic"
        >
          {url}
        </a>
      )}

      {error !== null && (
        <div id="error" className="text-sm break-all text-red-400 hover:text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default GetFileByKeyComponent;
