import React from "react";
import Uppy, { type UploadResult } from "@uppy/core";
import { Dashboard } from "@uppy/react";
import { sha256 } from "crypto-hash";
import AwsS3Multipart from "@uppy/aws-s3-multipart";

// Uppy styles
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

const fetchUploadApiEndpoint = async (endpoint: string, data: any) => {
  const res = await fetch(`/api/multipart-upload/${endpoint}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return res.json();
};

export function MultipartFileUploader({
  onUploadSuccess,
}: {
  onUploadSuccess: (result: UploadResult) => void;
}) {
  const uppy = React.useMemo(() => {
    const uppy = new Uppy({
      autoProceed: true,
    }).use(AwsS3Multipart, {
      createMultipartUpload: async (file) => {
        const arrayBuffer = await new Response(file.data).arrayBuffer();
        const fileHash = await sha256(arrayBuffer);
        const contentType = file.type;
        return fetchUploadApiEndpoint("create-multipart-upload", {
          file,
          fileHash,
          contentType,
        });
      },
      prepareUploadParts: (file, partData) =>
        fetchUploadApiEndpoint("prepare-upload-parts", { file, partData }),
      completeMultipartUpload: (file, props) =>
        fetchUploadApiEndpoint("complete-multipart-upload", { file, ...props }),
      listParts: (file, props) =>
        fetchUploadApiEndpoint("list-parts", { file, ...props }),
      abortMultipartUpload: (file, props) =>
        fetchUploadApiEndpoint("abort-multipart-upload", { file, ...props }),
    });
    return uppy;
  }, []);
  uppy.on("complete", (result) => {
    onUploadSuccess(result);
  });
  uppy.on("upload-success", (file, response) => {
    uppy.setFileState(file.id, {
      progress: uppy.getState().files[file.id].progress,
      uploadURL: response.body.Location,
      response: response,
      isPaused: false,
    })
  });

  return <Dashboard uppy={uppy} showLinkToFileUploadResult={true} />;
}
