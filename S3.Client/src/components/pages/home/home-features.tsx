import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Cloud, Download, Share2, Shield, Upload, Zap } from 'lucide-react';

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


const HomeFeatures = () => {
  return (
    <section id="features" className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need is to drag and drop some files
          </h2>
          <p className="mt-4 text-muted-foreground">
            Built for speed, security, and simplicity.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="transition-colors hover:bg-accent/50"
            >
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
  )
}

export default HomeFeatures