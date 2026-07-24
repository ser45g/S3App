import GetFileByKeyComponent from "@/components/file/get-file-by-key-component";
import UploadFileComponent from "@/components/file/upload-file-component";
import UploadFileMultipartComponent from "@/components/file/upload-file-multipart-component";

const FileUploadDownloadPage = () => {

  return (
    <div className="flex w-full h-full flex-col justify-center items-center">
      <div className="bg-green-50 border-2 border-green-200 p-8 m-4 rounded-lg shadow-lg shadow-green-300 w-lg">
        <h1 className="text-2xl font-bold mb-16 text-center flex items-center justify-center">
          S3 File Upload
          <img
            src="https://cdn.worldvectorlogo.com/logos/amazon-s3-simple-storage-service.svg"
            alt="Amazon S3 Logo"
            className="w-16 h-16 ml-4 rounded-md"
          />
        </h1>

        <UploadFileComponent />

        <hr className="my-8 border-t border-gray-300" />

        <UploadFileMultipartComponent/>

        <hr className="my-8 border-t border-gray-300" />

        <GetFileByKeyComponent />
      </div>
    </div>
  );
};

export default  FileUploadDownloadPage;
