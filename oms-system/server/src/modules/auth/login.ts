import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users, insertUserSchema } from "../../db/schema";
import { signToken } from "../../lib/auth";

const login = async (req: Request, res: Response) => {
  try {
    const result = insertUserSchema.pick({ email: true, password: true }).safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, errors: result.error.flatten().fieldErrors });
    }

    const { email, password } = result.data;

    const [user] = await db.select().from(users).where(eq(users.email, email));

    // Use the same message for both "not found" and "wrong password" —
    // different messages let attackers enumerate which emails are registered
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = await signToken({ id: user.id, email: user.email });

    // Set token as an HttpOnly cookie — JS cannot read this, browser sends it automatically
    // secure: false for localhost (http), set to true in production (https)
    // maxAge is in milliseconds — 7 days
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default login;
