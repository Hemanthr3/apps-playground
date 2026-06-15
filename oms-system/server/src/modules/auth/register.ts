import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users, insertUserSchema } from "../../db/schema";
import { signToken } from "../../lib/auth";
import { AppError } from "../../lib/errors";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input using the Zod schema generated from your Drizzle table.
    // .pick() selects only the fields we care about for registration.
    // .safeParse() returns { success, data } or { success, error } instead of throwing.
    const result = insertUserSchema.pick({ email: true, password: true }).safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, errors: result.error.flatten().fieldErrors });
    }

    const { email, password } = result.data;

    // Check if email is already taken — same Drizzle pattern as your other controllers
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      throw new AppError(409, "Email already registered")
    }

    // Hash before storing — bcrypt adds a random salt automatically
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert and get the created row back via .returning()
    const [user] = await db
      .insert(users)
      .values({ email, password: hashedPassword })
      .returning();

    if (!user) {
      throw new AppError(500, "Failed to create user")
    }

    const token = await signToken({ id: user.id, email: user.email });

    return res.status(201).json({ success: true, token });
  } catch (error: any) {
    return next(error);
  }
};

export default register;
