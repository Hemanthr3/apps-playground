import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// - id — same pattern as your other tables
// - email — text, not null, unique
// - password — text, not null (this will store the hashed password, never plain text)
// - createdAt — same as your other tables


export const users = pgTable("users",{
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    email:text('email').notNull().unique(),
    password:text('password').notNull(),
    createdAt:timestamp('created_at').defaultNow().notNull(),
})

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
    
