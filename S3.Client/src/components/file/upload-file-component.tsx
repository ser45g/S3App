import { useContext, useRef, useState } from "react";
import { Button } from "../ui/button";
import { observer } from "mobx-react-lite";
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
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { InputGroup, InputGroupInput } from "../ui/input-group";
import { Progress } from "../ui/progress";

const formSchema = z.object({
  file: z
    .instanceof(File)
    .nonoptional("File can't be null")
    .refine((f) => f.size <= 100 * 1024 * 1024, "Max 100MB"),
  //.refine((f) => ["image/jpeg", "image/png"].includes(f.type), "Only JPEG/PNG")
});

const UploadFileComponent = () => {
  const { store } = useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm({
    defaultValues: { file: null as File | null },
    validators: {
      onChange: formSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          if (!value.file) return "Value can't be empty";

          const { key, url } = await store.getPresignedUrlForUpload(value.file.name, value.file.type);

          setIsLoading(true);

          await store.uploadFileToS3(url, value.file);
          
          setKey(key);
        } 
        catch (error) 
        {
          return "Could not upload the file";
        }
        finally
        {
          setIsLoading(false)
        }
      },
    },
  });

  const clearFields = () => {
    form.reset();
    setKey("");
    formRef.current?.reset();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Standard Upload</CardTitle>
        <CardDescription>
          You can upload a file to a S3 cloud. You can access it later by a key
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
          {store.fileUploadState &&
            store.fileUploadState.loadingPercent !== null && (
              <div className="mb-4">
                <FieldGroup>
                  <Field className="w-full">
                    <FieldLabel htmlFor="progress-upload">
                      <span>Upload progress</span>
                      <span className="ml-auto">
                        {store.fileUploadState?.loadingPercent.toFixed(2) ?? 0}%
                      </span>
                    </FieldLabel>
                    <Progress
                      value={store.fileUploadState?.loadingPercent ?? 0}
                      className="bg-green-100"
                    />
                  </Field>
                  <Field>
                    <Button 
                    variant="destructive"
                      className=""
                      onClick={() => store.abortFileUpload()}
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

export default observer(UploadFileComponent);
