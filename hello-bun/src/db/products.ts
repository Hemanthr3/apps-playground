import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";


export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sku: text('sku').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  price: real('price').notNull(),
  stockQuantity: integer('stock_quantity')
    .default(0)
    .notNull(),
  isActive: integer('is_active', {
    mode: 'boolean',
  })
    .default(true)
    .notNull(),
  createdAt: integer('created_at', {
    mode: 'timestamp',
  })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const insertProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);
