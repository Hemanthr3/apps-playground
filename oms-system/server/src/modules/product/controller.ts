import type { Request, Response, NextFunction } from "express";
import { db } from "../../db";
import { products } from "../../db/schema";

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await db.select().from(products);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error)
  }
};

export default getProducts;
