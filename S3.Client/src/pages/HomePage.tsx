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

const features = [
  {
    icon: Upload,
    title: "Drag & Drop Uploads",
    description:
      "Upload files quickly with resumable multipart uploads, even on unstable connections.",
  },
  {
    icon: Download,
    title: "Instant Downloads",
    description:
      "Download any file with a single click. Files are served with lightning-fast CDN delivery.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description:
      "Files are encrypted in transit and at rest. Share with time-limited signed URLs.",
  },
  {
    icon: Zap,
    title: "Blazing Fast",
    description:
      "Parallel chunked uploads and downloads make large files feel small.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description:
      "Generate shareable links with optional password protection and expiry dates.",
  },
  {
    icon: Cloud,
    title: "Any File, Any Size",
    description:
      "From small documents to multi-gigabyte archives — we handle them all.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create your account",
    description: "Sign up in seconds — no credit card required.",
  },
  {
    step: "02",
    title: "Upload your files",
    description: "Drag files into the browser or use our API.",
  },
  {
    step: "03",
    title: "Share or download",
    description: "Get a link, or download from any device, anywhere.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-4 w-4" />
            </div>
            <span>FileFlow</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#features" className="text-muted-foreground hover:text-foreground">
              Features
            </a>
            <a href="#how" className="text-muted-foreground hover:text-foreground">
              How it works
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" >
              <Link to="/login">Sign in</Link>
            </Button>
            <Button size="sm" >
              <Link to="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"
        />
        <div className="container mx-auto px-4 py-24 text-center md:py-32">
          <Badge variant="secondary" className="mb-6">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Now with resumable uploads
          </Badge>

          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Upload, store & share
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {" "}
              any file
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            A simple, secure place for your files. Upload in seconds, download
            from anywhere, and share with a single link.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button >
              <Link to="/file" className="flex flex-row gap-2 items-center">
                Get started — it's free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" >
              <Link to="/demo">See a live demo</Link>
            </Button>
          </div>

          {/* Mock upload widget */}
          <div className="mx-auto mt-16 max-w-2xl">
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center gap-3 p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">Drop your files here</p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse — up to 5 GB per file
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Choose files
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to move files
          </h2>
          <p className="mt-4 text-muted-foreground">
            Built for speed, security, and simplicity.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="transition-colors hover:bg-accent/50">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* How it works */}
      <section id="how" className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Get started in 3 simple steps
          </h2>
          <p className="mt-4 text-muted-foreground">
            No setup, no configuration. Just sign up and go.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map(({ step, title, description }) => (
            <div key={step} className="relative">
              <div className="text-5xl font-bold text-primary/20">{step}</div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-24">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="flex flex-col items-center justify-between gap-6 p-10 md:flex-row md:p-14">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Ready to upload your first file?
              </h2>
              <p className="mt-2 text-primary-foreground/80">
                Join thousands of users who trust FileFlow every day.
              </p>
            </div>
            <Button className="p-4" variant="secondary" >
              <Link to="/signup" className="flex flex-row gap-2 items-center">
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} FileFlow. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms
            </a>
            <a href="#" className="hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}