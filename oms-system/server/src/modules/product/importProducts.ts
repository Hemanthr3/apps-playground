import type { Request, Response, NextFunction } from "express";
import * as XLSX from "xlsx";
import { db } from "../../db";
import { products } from "../../db/schema";
import { sql } from "drizzle-orm";
import { AppError } from "../../lib/errors";

const importProducts = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) throw new AppError(400, "Spreadsheet has no sheets")

    const sheet = workbook.Sheets[sheetName];
    if (!sheet) throw new AppError(400, "Could not read sheet")

    const rows = XLSX.utils.sheet_to_json(sheet) as any[];

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

    return res.status(200).json({ success: true, inserted: inserted.length, data: inserted });
  } catch (error) {
    next(error)
  }
};

export default importProducts;
