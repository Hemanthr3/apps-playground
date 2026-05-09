import type { Request, Response } from "express";
import { db } from "../../db";
import { products } from "../../db/schema";

const getProducts = async (req: Request, res: Response) => {
  try {
    const data = await db.select().from(products).all();
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default getProducts;