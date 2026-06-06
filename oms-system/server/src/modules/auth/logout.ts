import type { Request, Response } from "express";

const logout = (_req: Request, res: Response) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
  return res.status(200).json({ success: true, message: "Logged out" });
};

export default logout;
