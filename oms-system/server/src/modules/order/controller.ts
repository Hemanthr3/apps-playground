import type { Request, Response, NextFunction } from "express";
import { eq, inArray } from "drizzle-orm";
import { orders, customers, products, orderLineItems } from "../../db/schema";
import { db } from "../../db";
import { z } from "zod";
import { AppError } from "../../lib/errors";

const createOrderBodySchema = z.object({
  customer: z.object({
    firstName: z.string(),
    lastName: z.string().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
  }),
  items: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number().positive(),
    })
  ),
  shippingAmount: z.number().optional().default(0),
  taxAmount: z.number().optional().default(0),
});

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = createOrderBodySchema.parse(req.body);

    const result = await db.transaction(async (tx: any) => {
      let [customer] = await tx
        .select()
        .from(customers)
        .where(eq(customers.email, body.customer.email))
        .limit(1);

      if (!customer) {
        const [newCustomer] = await tx
          .insert(customers)
          .values({
            firstName: body.customer.firstName,
            lastName: body.customer.lastName,
            email: body.customer.email,
            phone: body.customer.phone,
          })
          .returning();
        customer = newCustomer;
      }

      const productIds = body.items.map((i) => i.productId);
      const dbProducts = await tx
        .select()
        .from(products)
        .where(inArray(products.id, productIds));

      if (dbProducts.length !== productIds.length) {
        throw new AppError(404, "One or more products not found")
      }

      let subtotal = 0;
      const itemsWithPrices = body.items.map((item) => {
        const product = dbProducts.find((p: any) => p.id === item.productId)!;
        const totalPrice = product.price * item.quantity;
        subtotal += totalPrice;
        return { ...item, unitPrice: product.price, totalPrice };
      });

      const totalAmount = subtotal + (body.shippingAmount || 0) + (body.taxAmount || 0);

      const [order] = await tx
        .insert(orders)
        .values({
          orderNumber: `ORD-${Date.now()}`,
          customerId: customer.id,
          status: "pending",
          subtotal,
          taxAmount: body.taxAmount || 0,
          shippingAmount: body.shippingAmount || 0,
          totalAmount,
        })
        .returning();

      await tx.insert(orderLineItems).values(
        itemsWithPrices.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        }))
      );

      return order;
    });

    return res.status(201).json({ success: true, message: "Order created successfully", data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: error.issues });
    }
    next(error)
  }
};

export default createOrder;
