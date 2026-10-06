import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileIcon, UploadCloud, X } from "lucide-react";
import { Input } from "./input";

import type { AnyFieldApi } from "@tanstack/react-form";
import { Button } from "./button";

interface FileDropzoneProps {
  field: AnyFieldApi;

  isInvalid: boolean;

  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
}

export function FileDropzone({
  field,
  maxSize = 5 * 1024 * 1024,
  maxFiles,
  multiple,
  className,
  disabled,
}: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxSize,
    maxFiles: maxFiles,
    multiple: multiple,
    disabled,
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
      field.handleChange(acceptedFiles);
    },
  });

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const files: File[] | null = field.state.value ?? null;

  return (
    <div className="w-full space-y-4">
      <Card
        {...getRootProps()}
        className={`flex flex-col items-center justify-center gap-3 p-10 cursor-pointer border-2 border-dashed transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/50"}
          ${isInvalid ? "border-destructive" : ""}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <Input
          {...getInputProps({
            id: field.name,
            name: field.name,
            onBlur: field.handleBlur,
            className
          })}
        />
        <UploadCloud className="h-8 w-8 text-muted-foreground" />

        {isDragActive ? (
          <p className="font-medium text-primary">Drop the file here …</p>
        ) : (
          <div className="text-center">
            <p className="font-medium">Click to upload or drag and drop</p>
            <p className="text-sm text-muted-foreground">
              Max file size: {maxSize / 1024 / 1024}MB
            </p>
          </div>
        )}
      </Card>
      <ul>
        {files &&
          files.map((file) => (
            <li
              key={file.name}
              className="flex items-center justify-between p-3 border rounded-md text-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="font-medium truncate">{file.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    field.handleChange(files.filter((f) => f !== file));
                  }}
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
