import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { customers } from "./customers";


export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
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
  placedAt: integer('placed_at', {
    mode: 'timestamp',
  })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const insertOrderSchema = createInsertSchema(orders);
export const selectOrderSchema = createSelectSchema(orders);

