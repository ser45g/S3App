import GetFileByKeyComponent from "@/components/file/get-file-by-key-component";
import UploadFileComponent from "@/components/file/upload-file-component";
import UploadFileMultipartComponent from "@/components/file/upload-file-multipart-component";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BedIcon } from "lucide-react";

const FileUploadDownloadPage = () => {
  return (
    <Card className=" w-full max-w-lg mx-auto  py-4 px-2 my-3">
      <CardHeader >
        <CardTitle className="flex-row text-3xl flex gap-4 items-center">
          <img src="https://cdn.worldvectorlogo.com/logos/amazon-s3-simple-storage-service.svg" className="w-16 h-16 rounded-full"/> S3 File Upload/Download
        </CardTitle> 
        
      </CardHeader>
      <CardContent className="flex flex-col space-y-2">
        <UploadFileComponent />

        <UploadFileMultipartComponent />

        <GetFileByKeyComponent />
      </CardContent>
    </Card>
  );
};

export default FileUploadDownloadPage;
