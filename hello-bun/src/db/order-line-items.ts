import { pgTable, integer, real} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { orders } from "./orders";
import { products } from "./products";


export const orderLineItems = pgTable('order_line_items', {
  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  orderId: integer('order_id')
    .notNull()
    .references(() => orders.id, {
      onDelete: 'cascade',
    }),

  productId: integer('product_id')
    .notNull()
    .references(() => products.id),

  quantity: integer('quantity').notNull(),

  unitPrice: real('unit_price').notNull(),

  totalPrice: real('total_price').notNull(),
});

export const insertOrderLineItemSchema = createInsertSchema(orderLineItems);
export const selectOrderLineItemSchema = createSelectSchema(orderLineItems);

