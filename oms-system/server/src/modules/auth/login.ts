import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users, insertUserSchema } from "../../db/schema";
import { signToken } from "../../lib/auth";
import { AppError } from "../../lib/errors";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = insertUserSchema.pick({ email: true, password: true }).safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, errors: result.error.flatten().fieldErrors });
    }

    const { email, password } = result.data;

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      throw new AppError(401, "Invalid email or password")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(401, "Invalid email or password")
    }

    const token = await signToken({ id: user.id, email: user.email });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    next(error)
  }
};

export default login;
