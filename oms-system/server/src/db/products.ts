import { pgTable, text, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";


export const products = pgTable('products', {
  id: integer('id')
    .primaryKey()
    .generatedByDefaultAsIdentity(),

  sku: text('sku')
    .notNull()
    .unique(),

  name: text('name').notNull(),

  description: text('description'),

  price: real('price').notNull(),

  stockQuantity: integer('stock_quantity')
    .default(0)
    .notNull(),

  isActive: boolean('is_active')
    .default(true)
    .notNull(),

  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),
});
export const insertProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);
