import type { NextApiRequest, NextApiResponse } from "next";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_KEY_ID, R2_BUCKET_NAME } =
  process.env;

const R2 = new S3Client([{
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_KEY_ID,
  },
}]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { filename, fileHash, contentType } = JSON.parse(req.body as string);
  const signedUrl = await getSignedUrl(
    R2,
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: `resources/${fileHash}/${filename}`,
      ContentType: contentType as string,
    }),
    { expiresIn: 3600 }
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({
    url: signedUrl,
    method: "PUT",
  });
  res.end();
}
