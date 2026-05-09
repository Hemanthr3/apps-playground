import type { Request, Response } from "express";
import { db } from "../../db";
import { orders, customers } from "../../db/schema";
import { eq } from "drizzle-orm";

const getOrders = async (req: Request, res: Response) => {
  try {
    const data = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        totalAmount: orders.totalAmount,
        createdAt: orders.placedAt,
        customer: {
          firstName: customers.firstName,
          lastName: customers.lastName,
          email: customers.email,
        },
      })
      .from(orders)
      .leftJoin(customers, eq(orders.customerId, customers.id))
      .all();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default getOrders;
