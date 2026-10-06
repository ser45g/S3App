import { useContext, useRef, useState } from "react";
import { Button } from "../../ui/button";
import { observer } from "mobx-react-lite";
import * as z from "zod";
import { useForm } from "@tanstack/react-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "../../ui/field";
import { InputGroup, InputGroupInput } from "../../ui/input-group";
import { Progress } from "../../ui/progress";
import { useFileUpload } from "./uploading-file.hooks";
import { FileDropzone } from "@/components/ui/drag-and-drop-file";

const formSchema = z.object({
  files: z.array(z.file().nonoptional("File can't be null").refine((f) => f.size <= 100 * 1024 * 1024, "Max 100MB")).length(1)
  //.refine((f) => ["image/jpeg", "image/png"].includes(f.type), "Only JPEG/PNG")
});

const UploadingFile = () => {

  const formRef = useRef<HTMLFormElement>(null);

  const { status, progress, error, key, upload, cancel, reset } = useFileUpload();

  const isLoading = status === "uploading";

  const form = useForm({
    defaultValues: { files: null as File[] | null },
    validators: {
      onChange: formSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          if (!value.files?.[0]) return "Value can't be empty";

          if(value.files.length > 1) return "You can upload only one file at the time";
          console.log("got hereld")

          await upload(value.files[0]);
        } 
        catch (error) 
        {
          return "Could not upload the file";
        }
      },
    },
  });

  const clearFields = () => {
    reset();
    form.reset();
    formRef.current?.reset();
  };

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Standard Upload</CardTitle>
        <CardDescription>
          You can upload a file to a S3 cloud. You can access it later by a key
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
                    <div><FileDropzone field={field} maxSize={100*1024*1024} maxFiles={0} multiple={true} isInvalid ={isInvalid}  />
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
                    className="flex-1 bg-lime-300 text-lime-700"
                  >
                    Upload file
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
        <div className="my-4 flex flex-col gap-2">
          <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
            {(error) => {
              if (!error) return null;
              const message = Array.isArray(error) ? error.join(", ") : error;
              
              return <div className="text-destructive">{message}</div>;
            }}
          </form.Subscribe>
          {isLoading && (
              <div className="mb-4">
                <FieldGroup>
                  <Field className="w-full">
                    <FieldLabel htmlFor="progress-upload">
                      <span>Upload progress</span>
                      <span className="ml-auto">
                        {progress}%
                      </span>
                    </FieldLabel>
                    <Progress
                      value={progress}
                      className="bg-green-100"
                    />
                  </Field>
                  <Field>
                    <Button 
                    variant="destructive"
                      className=""
                      onClick={cancel}
                    >
                      Stop
                    </Button>
                  </Field>
                </FieldGroup>
              </div>
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

export default UploadingFile;
