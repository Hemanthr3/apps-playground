import type { Request, Response } from "express";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "../../db";
import { customers } from "../../db/schema";
import { s3 } from "../../lib/storage";

const getCustomers = async (req: Request, res: Response) => {
  try {
    const data = await db.select().from(customers);

    // For each customer, generate a temporary presigned URL if they have a photo.
    // getSignedUrl takes the s3 client, a GetObjectCommand, and an expiry in seconds.
    // The URL is only valid for that window — after that it returns 403.
    const customersWithPhotos = await Promise.all(
      data.map(async (customer) => {
        if (!customer.profilePhotoKey) {
          return { ...customer, profilePhotoUrl: null };
        }

        const url = await getSignedUrl(
          s3,
          new GetObjectCommand({
            Bucket: process.env.MINIO_BUCKET!,
            Key: customer.profilePhotoKey,
          }),
          { expiresIn: 60 * 60 } // 1 hour
        );

        return { ...customer, profilePhotoUrl: url };
      })
    );

    return res.status(200).json({
      success: true,
      data: customersWithPhotos,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default getCustomers;
