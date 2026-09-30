import { observer } from "mobx-react-lite";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { useContext, useRef, useState } from "react";
import { StoreContext } from "@/App";

import * as z from "zod";
import { useForm } from "@tanstack/react-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { InputGroup, InputGroupInput } from "../ui/input-group";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Progress } from "../ui/progress";

const formSchema = z.object({
  file: z
    .instanceof(File)
    .nonoptional("File can't be null")
    .refine((f) => f.size <= 10 * 1024 * 1024 * 1024, "Max 10GB"),
  //.refine((f) => ["image/jpeg", "image/png"].includes(f.type), "Only JPEG/PNG")
});

const UploadFileMultipartComponent = () => {
  const { store } = useContext(StoreContext);
  const [key, setKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm({
    defaultValues: { file: null as File | null },
    validators: {
      onChange: formSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          if (!value.file) return "Value can't be empty";

          const {uploadId, key } = await store.startMultipartUpload(value.file);

          const partSize = 10 * 1024 * 1024;

          setIsLoading(true);

          store.prepareParts(value.file, partSize);

          await store.uploadParts();

          setKey(key)
        } catch (error) {
          return "Could not upload the file.";
        }finally{
          setIsLoading(false)
        }
      },
    }
  });

  const clearFields = () => {
    form.reset();
    formRef.current?.reset();
    store.resetMultipartUploadState();
  };

  const pauseFileMultipartUploadToS3 = () => {
    store.togglePauseResume();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Multipart Upload</CardTitle>
        <CardDescription>
          You can upload a big file to a S3 cloud using a multipart upload where a file is divided into multiple parts where each of them is uploaded separately. You can access it later by a key
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              name="file"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>File</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        name={field.name}
                        disabled={isLoading}
                        type="file"
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(e.target.files?.[0] ?? null)
                        }
                        aria-invalid={isInvalid}
                        aria-disabled={isLoading}
                        placeholder="67695cb3-ff40-450a-86a4-04f8204bc2a9"
                        autoComplete="off"
                      />
                    </InputGroup>

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
          {store.multipartUploadState && (
            <div className=" mb-4">
              <Field className="w-full">
                    <FieldLabel htmlFor="progress-upload">
                      <span>Upload progress</span>
                      <span className="ml-auto">
                        {store.multipartUploadState?.loadingPercent?.toFixed(2) ?? 0}%
                      </span>
                    </FieldLabel>
                    <Progress
                      value={store.multipartUploadState?.loadingPercent ?? 0}
                      className="bg-green-100"
                    />
                  </Field>
            </div>
          )}

          {store.multipartUploadState && (
            <Button
              id="pauseResumeButton"
              variant={store.multipartUploadState.isPaused ? "destructive" : "secondary"}
              className=" "
              onClick={pauseFileMultipartUploadToS3}
            >
              {store.multipartUploadState.isPaused ? "Resume" : "Pause"}
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

export default observer(UploadFileMultipartComponent);
