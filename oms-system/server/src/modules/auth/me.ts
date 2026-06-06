import type { Request, Response } from "express";

const me = (req: Request, res: Response) => {
  return res.status(200).json({ success: true, user: req.user });
};

export default me;
