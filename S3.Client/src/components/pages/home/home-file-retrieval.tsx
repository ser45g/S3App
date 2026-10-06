import DownloadingFile from '@/components/features/file/downloading-file'
import React from 'react'

const HomeFileRetrieval = () => {
  return (
    <section
        id="file-retrieval"
        className="container mx-auto flex flex-col items-center px-4 py-20 "
      >
        <div className="w-full max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Get files by their key
          </h2>
          <p className="mt-4 text-muted-foreground">
            When you upload a file, you get a key. You can use it to get a file
            later on
          </p>
        </div>
        <div className="w-full max-w-xl gap-4 mt-16">
          <DownloadingFile />
        </div>
      </section>

  )
}

export default HomeFileRetrieval