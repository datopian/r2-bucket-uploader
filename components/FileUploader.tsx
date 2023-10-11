import React from "react";
import Uppy, { type UploadResult, UppyFile } from "@uppy/core";
import AwsS3, { type AwsS3UploadParameters } from "@uppy/aws-s3";
import { Dashboard } from "@uppy/react";
import { sha256 } from "crypto-hash";

// Uppy styles
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

export async function getUploadParameters(file: UppyFile) {
  const arrayBuffer = await new Response(file.data).arrayBuffer();
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: {
      accept: "application/json",
    },
    body: JSON.stringify({
      filename: file.name,
      fileHash: await sha256(arrayBuffer),
      contentType: file.type,
    }),
  });
  if (!response.ok) throw new Error("Unsuccessful request");

  // Parse the JSON response.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: { url: string; method: "PUT" } = await response.json();

  // Return an object in the correct shape.
  const object: AwsS3UploadParameters = {
    method: data.method,
    url: data.url,
    fields: {}, // For presigned PUT uploads, this should be left empty.
    // Provide content type header required by S3
    headers: {
      "Content-Type": file.type ? file.type : "application/octet-stream",
    },
  };
  return object;
}

export function FileUploader({
  onUploadSuccess,
}: {
  onUploadSuccess: (result: UploadResult) => void;
}) {
  const uppy = React.useMemo(() => {
    const uppy = new Uppy({
      autoProceed: true,
      restrictions: {
        maxNumberOfFiles: 3,
      },
    }).use(AwsS3, {
      id: "AwsS3",
      getUploadParameters: (file: UppyFile) => getUploadParameters(file),
    });
    return uppy;
  }, []);
  uppy.on("complete", (result) => {
    onUploadSuccess(result);
  });
  return <Dashboard uppy={uppy} showLinkToFileUploadResult={true} />;
}
