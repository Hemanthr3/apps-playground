import type { Request, Response } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../lib/storage";
import { productImportQueue } from "../../lib/queue";

const importProductsXlsx = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  if (req.file.mimetype !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    return res.status(400).json({ success: false, message: "Only .xlsx files are accepted" });
  }

  try {
    // Step 1: Store the file in MinIO
    const key = `imports/products/${Date.now()}.xlsx`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.MINIO_BUCKET!,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    // Step 2: Add a job to the queue — worker picks it up and processes in background
    // 202 Accepted means "request received, processing not yet complete"
    const job = await productImportQueue.add("import", { fileKey: key });

    return res.status(202).json({
      success: true,
      message: "Import queued",
      jobId: job.id,
      storedAt: key,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default importProductsXlsx;
