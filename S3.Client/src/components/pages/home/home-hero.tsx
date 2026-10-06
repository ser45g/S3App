import { ArrowRight, CheckCircle2 } from 'lucide-react'
import React from 'react'
import { Button } from '../../ui/button'
import { Link } from 'react-router-dom'
import { Badge } from '../../ui/badge'

const HomeHero = () => {
  return (
    <section className="relative overflow-hidden h-screen">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-background to-background"
        />
        <div className="container mx-auto px-4 py-24 text-center md:py-32">
          <Badge variant="secondary" className="mb-6">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Now with resumable uploads
          </Badge>

          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Upload, store & share any file
            
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            A simple, secure place for your files. Upload in seconds, download
            from anywhere, and share with a single link.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button>
              <Link to="/file" className="flex flex-row gap-2 items-center">
                Get started — it's free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              <Link to="/demo">See a live demo</Link>
            </Button>
          </div>
        </div>
      </section>
  )
}

export default HomeHero