import type { Request, Response } from "express";
import * as XLSX from "xlsx";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { sql } from "drizzle-orm";
import { db } from "../../db";
import { products } from "../../db/schema";
import { s3 } from "../../lib/storage";

const importProductsXlsx = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  if (req.file.mimetype !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    return res.status(400).json({ success: false, message: "Only .xlsx files are accepted" });
  }

  try {
    // Step 1: Store the file in MinIO.
    // Using a timestamp in the key ensures each upload is unique and we keep a history.
    const key = `imports/products/${Date.now()}.xlsx`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.MINIO_BUCKET!,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    // Step 2: Download it back from MinIO.
    // In a real async pipeline, this step would happen in a background worker.
    // Here we do it immediately to keep the demo synchronous.
    const stored = await s3.send(
      new GetObjectCommand({
        Bucket: process.env.MINIO_BUCKET!,
        Key: key,
      })
    );

    // Step 3: Convert the response stream to bytes.
    // GetObjectCommand returns a ReadableStream, not a Buffer.
    // transformToByteArray() drains the stream and gives us a Uint8Array.
    const bytes = await stored.Body!.transformToByteArray();

    // Step 4: Parse the bytes as an XLSX workbook.
    const workbook = XLSX.read(bytes, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return res.status(400).json({ success: false, message: "Spreadsheet has no sheets" });
    }
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      return res.status(400).json({ success: false, message: "Could not read sheet" });
    }

    const rows = XLSX.utils.sheet_to_json(sheet) as any[];

    // Step 5: Upsert rows — same logic as CSV approach.
    const toInsert = rows.map((row) => ({
      sku: String(row.sku),
      name: String(row.name),
      description: row.description ? String(row.description) : null,
      price: Number(row.price),
      stockQuantity: Number(row.stockQuantity),
      isActive: row.isActive === true || row.isActive === "true",
    }));

    const inserted = await db
      .insert(products)
      .values(toInsert)
      .onConflictDoUpdate({
        target: products.sku,
        set: {
          name: sql`excluded.name`,
          description: sql`excluded.description`,
          price: sql`excluded.price`,
          stockQuantity: sql`excluded.stock_quantity`,
          isActive: sql`excluded.is_active`,
        },
      })
      .returning();

    return res.status(200).json({
      success: true,
      storedAt: key,
      inserted: inserted.length,
      data: inserted,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default importProductsXlsx;
