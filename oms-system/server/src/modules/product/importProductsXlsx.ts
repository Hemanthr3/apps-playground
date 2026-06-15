import type { Request, Response, NextFunction } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../lib/storage";
import { productImportQueue } from "../../lib/queue";
import { AppError } from "../../lib/errors";

const importProductsXlsx = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    throw new AppError(400, "No file uploaded")
  }

  if (req.file.mimetype !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    throw new AppError(400, "Only .xlsx files are accepted")
  }

  try {
    const key = `imports/products/${Date.now()}.xlsx`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.MINIO_BUCKET!,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    const job = await productImportQueue.add("import", { fileKey: key });

    return res.status(202).json({
      success: true,
      message: "Import queued",
      jobId: job.id,
      storedAt: key,
    });
  } catch (error) {
    next(error)
  }
};

export default importProductsXlsx;
