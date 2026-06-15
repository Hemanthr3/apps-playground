import type { Request, Response, NextFunction } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { customers } from "../../db/schema";
import { s3 } from "../../lib/storage";
import { AppError } from "../../lib/errors";

const uploadProfilePhoto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new AppError(400, "No file uploaded")
    }

    const customerId = req.params.id;
    const extension = req.file.mimetype.split("/")[1];
    const key = `customers/${customerId}/profile.${extension}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.MINIO_BUCKET!,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    await db
      .update(customers)
      .set({ profilePhotoKey: key })
      .where(eq(customers.id, Number(customerId)));

    return res.status(200).json({ success: true, key });
  } catch (error) {
    next(error)
  }
};

export default uploadProfilePhoto;
