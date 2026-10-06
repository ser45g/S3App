import { useState } from "react";
import { Button } from "../../ui/button";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";

import { useForm } from "@tanstack/react-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../../ui/field";
import {
  InputGroup,
  InputGroupInput,
} from "../../ui/input-group";
import { getPresignedUrlForDownload } from "@/api/services/file";

const formSchema = z.object({
  key: z
    .string()
    .min(5, "Key must be at least 5 characters.")
    .max(150, "Key must be at most 150 characters."),
});

const DownloadingFile = () => {
  const [url, setUrl] = useState("");

  const form = useForm({
    defaultValues: { key: "" },
    validators: {
      onChange: formSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          
          const {url:presignedUrl} = await getPresignedUrlForDownload(value.key);
          
          setUrl(presignedUrl);
        } catch (err) {
          return "Couldn't get the presigned url.";
        }
      },
    },
    onSubmit: async ({ value }) => {
      // This only runs if onSubmitAsync passes
      console.log("Form submitted successfully", value);
    },
  });
  const clearFields = () => {
    form.reset();
    setUrl("");
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Get Pre-signed URL</CardTitle>
        <CardDescription>
          You need to provide a key for a file. It'll return a url that you can use to download that file
        </CardDescription>
      </CardHeader>
      <CardContent className="my-auto">
        <form
          id="get-file-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="key"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Key
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
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
                    disabled={isDisabled}
                    aria-disabled={isDisabled}
                    className="flex-1 bg-violet-300 text-violet-700"
                  >
                    Get Pre-signed URL
                  </Button>
                )}
              </form.Subscribe>

              <Button
                type="button"
                id="clearButton"
                variant="outline"
                className=""
                onClick={clearFields}
              >
                Clear
              </Button>
            </Field>
          </FieldGroup>
        </form>
        <div className="mt-4 flex flex-col space-y-2 text-center">
          <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
            {(error) => {
              if (!error) return null;
              const message = Array.isArray(error) ? error.join(", ") : error;
              return <div className="text-destructive">{message}</div>;
            }}
          </form.Subscribe>
          {url !== null && (
            <a
              id="presignedUrlResult"
              href={url}
              target="_blank"
              className="text-sm break-all text-blue-500 hover:text-red-400 dark:hover:text-blue-400 dark:text-red-300 italic"
            >
              {url}
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadingFile;
