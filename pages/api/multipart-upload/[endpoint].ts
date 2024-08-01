import type { NextApiRequest, NextApiResponse } from "next";
import {
  UploadPartCommand,
  S3Client,
  ListPartsCommand,
  CreateMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_KEY_ID, R2_BUCKET_NAME } =
  process.env;

const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_KEY_ID,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { endpoint } = req.query;

  switch (endpoint) {
    case "create-multipart-upload":
      return createMultipartUpload(req, res);
    case "prepare-upload-parts":
      return prepareUploadParts(req, res);
    case "complete-multipart-upload":
      return completeMultipartUpload(req, res);
    case "list-parts":
      return listParts(req, res);
    case "abort-multipart-upload":
      return abortMultipartUpload(req, res);
    case "sign-part":
      return signPart(req, res);
  }
  return res.status(404).end();
}

export async function createMultipartUpload(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { file, contentType } = req.body;
  const filename = file.name;
  try {
    const params = {
      Bucket: R2_BUCKET_NAME,
      Key: `resources/${filename}`,
      ContentType: contentType,
    };

    const command = new CreateMultipartUploadCommand({ ...params });
    const response = await R2.send(command);
    return res.status(200).json({
      uploadId: response.UploadId,
      key: response.Key,
    });
  } catch (err) {
    console.log("Error", err);
    return res.status(500).json({ source: { status: 500 } });
  }
}

export async function prepareUploadParts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { partData } = req.body;

  const parts = partData.parts;

  const response = {
    presignedUrls: {},
  };

  for (let part of parts) {
    try {
      const params = {
        Bucket: R2_BUCKET_NAME,
        Key: partData.key,
        PartNumber: part.number,
        UploadId: partData.uploadId,
      };
      const command = new UploadPartCommand({ ...params });
      const url = await getSignedUrl(R2, command, { expiresIn: 3600 });

      response.presignedUrls[part.number] = url;
    } catch (err) {
      console.log("Error", err);
      return res.status(500).json(err);
    }
  }

  return res.status(200).json(response);
}

export async function listParts(req: NextApiRequest, res: NextApiResponse) {
  const { key, uploadId } = req.body;

  try {
    const params = {
      Bucket: R2_BUCKET_NAME,
      Key: key,
      UploadId: uploadId,
    };
    const command = new ListPartsCommand({ ...params });
    const response = await R2.send(command);

    return res.status(200).json(response["Parts"]);
  } catch (err) {
    console.log("Error", err);
    return res.status(500).json(err);
  }
}

export async function completeMultipartUpload(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { key, uploadId, parts } = req.body;

  try {
    const params = {
      Bucket: R2_BUCKET_NAME,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    };
    const command = new CompleteMultipartUploadCommand({ ...params });
    const response = await R2.send(command);
    return res.status(200).json(response);
  } catch (err) {
    console.log("Error", err);
    return res.status(500).json(err);
  }
}

export async function abortMultipartUpload(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { key, uploadId } = req.body;

  try {
    const params = {
      Bucket: R2_BUCKET_NAME,
      Key: key,
      UploadId: uploadId,
    };
    const command = new AbortMultipartUploadCommand({ ...params });
    const response = await R2.send(command);

    return res.status(200).json(response);
  } catch (err) {
    console.log("Error", err);
    return res.status(500).json(err);
  }
}

export async function signPart(req: NextApiRequest, res: NextApiResponse) {
  const { key, uploadId } = req.body;
  const partNumber = parseInt(req.body.partNumber);

  const params = {
    Bucket: R2_BUCKET_NAME,
    Key: key,
    PartNumber: partNumber,
    UploadId: uploadId,
  };

  const command = new UploadPartCommand({ ...params });
  const url = await getSignedUrl(R2, command, { expiresIn: 3600 });
  return res.status(200).json({
    url: url,
  });
}
