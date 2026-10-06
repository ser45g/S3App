import { Link } from "react-router-dom";
import {
  Upload,
  Download,
  Shield,
  Zap,
  Cloud,
  Share2,
  CheckCircle2,
  ArrowRight,
  FileText,
  Settings2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import UploadingFile from "@/components/features/file/uploading-file";
import UploadingFileMultipart from "@/components/features/file/uploading-file-multipart";
import DownloadingFile from "@/components/features/file/downloading-file";

import HomeHeader from "./home-header";
import HomeHero from "./home-hero";
import HomeFeatures from "./home-features";
import HomeSteps from "./home-steps";
import HomeCta from "./home-cta";
import HomeFooter from "./home-footer";
import HomeUpload from "./home-upload";
import HomeFileRetrieval from "./home-file-retrieval";




export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      
      <HomeHeader/>

      <HomeHero/>

      <Separator/>

     
      <HomeUpload/>

      <Separator/>

      <HomeFileRetrieval/>

      <Separator/>
      
      <HomeFeatures/>

      <Separator />

      <HomeSteps/>

      <HomeCta/>
      
      <Separator />
     
      <HomeFooter/>
      
    </div>
  );
}
