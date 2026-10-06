import { observer } from "mobx-react-lite";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

import { useContext, useRef, useState } from "react";

import * as z from "zod";
import { useForm } from "@tanstack/react-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { InputGroup, InputGroupInput } from "../../ui/input-group";
import { Field, FieldError, FieldGroup, FieldLabel } from "../../ui/field";
import { Progress } from "../../ui/progress";
import { useMultipartUpload } from "./uploading-file-multipart.hooks";
import { FileDropzone } from "@/components/ui/drag-and-drop-file";
import { toast } from "@/components/ui/toast";

const formSchema = z.object({
  files: z
    .array(
      z
        .file()
        .nonoptional("File can't be null")
        .refine((f) => f.size <= 10 * 1024 * 1024 * 1024, "Max 10GB"),
    )
    .length(1),

  //.refine((f) => ["image/jpeg", "image/png"].includes(f.type), "Only JPEG/PNG")
});

const UploadingFileMultipart = () => {
  const { status, progress, error, key, upload, pause, resume, cancel, reset } =
    useMultipartUpload({ partSize: 5 * 1024 * 1024, concurrency: 3 });

  const formRef = useRef<HTMLFormElement>(null);

  const isLoading = status === "uploading";
  const isPaused = status === "paused";
  const isIdle = status === "idle";

  const form = useForm({
    defaultValues: { files: null as File[] | null },
    validators: {
      onChange: formSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          if (!value.files?.[0]) return "Value can't be empty";

          if (value.files.length > 1)
            return "You can upload only one file at the time";

          await upload(value.files[0]);
          toast.add({
            title: "The file was uploaded successfully!",
            description: "You can now access it using the returned key",
            type: "success",
          });
          return undefined;
        } catch (error) {
          toast.add({
            title: "Could not upload the file",
            description: "Something went wrong...",
            type: "error",
          });
          return "Could not upload the file.";
        }
      },
    },
  });

  const clearFields = () => {
    form.reset();
    formRef.current?.reset();
    reset();
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Multipart Upload</CardTitle>
        <CardDescription>
          You can upload a big file to a S3 cloud using a multipart upload where
          a file is divided into multiple parts where each of them is uploaded
          separately. You can access it later by a key
        </CardDescription>
      </CardHeader>
      <CardContent className="my-auto">
        <form
          ref={formRef}
          id="bug-report-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="files"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <div>
                      <FileDropzone
                        field={field}
                        maxSize={5 * 1024 * 1024 * 1024}
                        maxFiles={0}
                        multiple={true}
                        isInvalid={isInvalid}
                      />
                    </div>

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <Field orientation="horizontal">
              <form.Subscribe selector={(state) => !state.canSubmit}>
                {(isDisabled) => (
                  <Button
                    type="submit"
                    id="getUrlButton"
                    disabled={isDisabled || isLoading}
                    aria-disabled={isDisabled || isLoading}
                    className="flex-1 bg-sky-300 text-sky-700"
                  >
                    Upload File (Multipart)
                  </Button>
                )}
              </form.Subscribe>

              <Button
                type="button"
                id="clearButton"
                variant="outline"
                disabled={isLoading}
                className=""
                onClick={clearFields}
              >
                Clear
              </Button>
            </Field>
          </FieldGroup>
        </form>
        <div className="my-4 flex flex-col">
          <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
            {(error) => {
              if (!error) return null;
              const message = Array.isArray(error) ? error.join(", ") : error;
              return <div className="text-destructive">{message}</div>;
            }}
          </form.Subscribe>
          {isLoading && (
            <div className=" mb-4">
              <Field className="w-full">
                <FieldLabel htmlFor="progress-upload">
                  <span>Upload progress</span>
                  <span className="ml-auto">{progress}%</span>
                </FieldLabel>
                <Progress value={progress} className="bg-green-100" />
              </Field>
            </div>
          )}

          {(isLoading || isPaused) && (
            <Button
              id="pauseResumeButton"
              variant={isPaused ? "destructive" : "secondary"}
              className=" "
              onClick={isPaused ? resume : pause}
            >
              {isPaused ? "Resume" : "Pause"}
            </Button>
          )}
        </div>
        {key && (
          <div className="mb-4">
            <p>You can access this file using this key: {key}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default observer(UploadingFileMultipart);
