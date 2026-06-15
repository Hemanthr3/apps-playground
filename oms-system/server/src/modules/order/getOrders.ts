import type { Request, Response, NextFunction } from "express";
import { db } from "../../db";
import { orders, customers } from "../../db/schema";
import { eq } from "drizzle-orm";

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        totalAmount: orders.totalAmount,
        createdAt: orders.placedAt,
        customerFirstName: customers.firstName,
        customerLastName: customers.lastName,
        customerEmail: customers.email,
      })
      .from(orders)
      .leftJoin(customers, eq(orders.customerId, customers.id));

    const data = rows.map((row) => ({
      id: row.id,
      orderNumber: row.orderNumber,
      status: row.status,
      totalAmount: row.totalAmount,
      createdAt: row.createdAt,
      customer: row.customerEmail ? {
        firstName: row.customerFirstName,
        lastName: row.customerLastName,
        email: row.customerEmail,
      } : null,
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error)
  }
};

export default getOrders;
