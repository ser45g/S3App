import React from 'react'
import UploadingFile from '../../features/file/uploading-file'
import UploadingFileMultipart from '../../features/file/uploading-file-multipart'

const HomeUpload = () => {
  return (
     <section
        id="upload"
        className="container mx-auto flex flex-col items-center px-4 py-20 "
      >
        <div className="w-full max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Drag and drop files to upload them
          </h2>
          <p className="mt-4 text-muted-foreground">
            Built for small files (less than 100Mb) and for big files (multipart
            upload, up to 5 Gb).
          </p>
        </div>
        <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-4 mt-16">
          <UploadingFile />

          <UploadingFileMultipart />
        </div>
      </section>
  )
}

export default HomeUpload