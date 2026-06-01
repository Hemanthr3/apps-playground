import type { Request, Response } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { customers } from "../../db/schema";
import { s3 } from "../../lib/storage";

const uploadProfilePhoto = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const customerId = req.params.id;
    const extension = req.file.mimetype.split("/")[1];
    const key = `customers/${customerId}/profile.${extension}`;

    const minioResponse = await s3.send(
      new PutObjectCommand({
        Bucket: process.env.MINIO_BUCKET!,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    console.log("MinIO response:", minioResponse);

    await db
      .update(customers)
      .set({ profilePhotoKey: key })
      .where(eq(customers.id, Number(customerId)));

    return res.status(200).json({ success: true, key });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default uploadProfilePhoto;
