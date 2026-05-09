import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";


export const customers = sqliteTable('customers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name'),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  createdAt: integer('created_at', {
    mode: 'timestamp',
  })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const insertCustomerSchema = createInsertSchema(customers);
export const selectCustomerSchema = createSelectSchema(customers);
