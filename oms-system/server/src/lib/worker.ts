import { Worker } from "bullmq"
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./storage";
import { db } from "../db";
import { products } from "../db/schema";
import { sql } from "drizzle-orm";
import * as XLSX from "xlsx";
import { redisConnection } from "./redis";
import logger from "../../logger";

const log = logger.child({ module: "worker:product-import" })

const worker = new Worker("product-import", async (job) => {
  const { fileKey } = job.data
  log.info({ jobId: job.id, fileKey }, "job started")

  await job.updateProgress(10)
  await sleep(1000)

  const stored = await s3.send(
    new GetObjectCommand({
      Bucket: process.env.MINIO_BUCKET!,
      Key: fileKey,
    })
  );

  await job.updateProgress(30)
  await sleep(1000)
  log.info({ jobId: job.id }, "file downloaded from MinIO")

  const bytes = await stored.Body!.transformToByteArray();
  const workbook = XLSX.read(bytes, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) throw new Error("No sheet found in the file")
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) throw new Error("Could not read sheet")

  const rows = XLSX.utils.sheet_to_json(sheet) as any[];
  await job.updateProgress(60)
  await sleep(1000)
  log.info({ jobId: job.id, rows: rows.length }, "file parsed")

  const toInsert = rows.map((row) => ({
    sku: String(row.sku),
    name: String(row.name),
    description: row.description ? String(row.description) : null,
    price: Number(row.price),
    stockQuantity: Number(row.stockQuantity),
    isActive: row.isActive === true || row.isActive === "true",
  }));

  await job.updateProgress(80)
  await sleep(1000)

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

  await job.updateProgress(100)
  log.info({ jobId: job.id, inserted: inserted.length }, "job completed")
  return { inserted: inserted.length }

}, { connection: redisConnection })

worker.on("failed", (job, err) => {
  log.error({ jobId: job?.id, err }, "job failed")
})

export default worker
