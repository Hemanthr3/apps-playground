import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/auth";

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Read token from HttpOnly cookie — set by the login endpoint
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const payload = await verifyToken(token);
    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authenticate;
