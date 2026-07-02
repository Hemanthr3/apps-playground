import type { Request, Response, NextFunction } from "express";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "../../db";
import { customers } from "../../db/schema";
import { s3Public } from "../../lib/storage";

const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await db.select().from(customers);

    const customersWithPhotos = await Promise.all(
      data.map(async (customer) => {
        if (!customer.profilePhotoKey) {
          return { ...customer, profilePhotoUrl: null };
        }

        const url = await getSignedUrl(
          s3Public,
          new GetObjectCommand({
            Bucket: process.env.MINIO_BUCKET!,
            Key: customer.profilePhotoKey,
          }),
          { expiresIn: 60 * 60 }
        );

        return { ...customer, profilePhotoUrl: url };
      })
    );

    return res.status(200).json({ success: true, data: customersWithPhotos });
  } catch (error) {
    next(error)
  }
};

export default getCustomers;
