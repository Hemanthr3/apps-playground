import { S3Client } from "@aws-sdk/client-s3";

const credentials = {
  accessKeyId: process.env.MINIO_ACCESS_KEY!,
  secretAccessKey: process.env.MINIO_SECRET_KEY!,
};

// Used for upload/download operations (internal Docker network)
export const s3 = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT,
  region: "us-east-1",
  credentials,
  forcePathStyle: true,
});

// Used for generating presigned URLs — must use the public hostname so
// the signature matches the URL the browser will actually request
export const s3Public = new S3Client({
  endpoint: process.env.MINIO_PUBLIC_URL ?? process.env.MINIO_ENDPOINT,
  region: "us-east-1",
  credentials,
  forcePathStyle: true,
});
