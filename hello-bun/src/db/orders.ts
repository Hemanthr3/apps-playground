import { pgTable, text, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { customers } from "./customers";

export const orders = pgTable('orders', {
  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  orderNumber: text('order_number')
    .notNull()
    .unique(),

  customerId: integer('customer_id')
    .notNull()
    .references(() => customers.id),

  status: text('status')
    .default('pending')
    .notNull(),

  subtotal: real('subtotal').notNull(),

  taxAmount: real('tax_amount')
    .default(0)
    .notNull(),

  shippingAmount: real('shipping_amount')
    .default(0)
    .notNull(),

  totalAmount: real('total_amount').notNull(),

  placedAt: timestamp('placed_at')
    .defaultNow()
    .notNull(),
});

export const insertOrderSchema = createInsertSchema(orders);
export const selectOrderSchema = createSelectSchema(orders);

