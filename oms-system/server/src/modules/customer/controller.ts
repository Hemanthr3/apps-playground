import type { Request, Response } from "express";
import { db } from "../../db";
import { customers } from "../../db/schema";

const getCustomers = async (req: Request, res: Response) => {
  try {
    const data = await db.select().from(customers);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default getCustomers;