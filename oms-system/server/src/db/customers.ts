import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";


export const customers = pgTable('customers', {
  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  firstName: text('first_name').notNull(),

  lastName: text('last_name'),

  email: text('email').notNull().unique(),

  phone: text('phone'),

  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),
});

export const insertCustomerSchema = createInsertSchema(customers);
export const selectCustomerSchema = createSelectSchema(customers);
