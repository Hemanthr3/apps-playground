import type { Request, Response } from "express";


const uploadProfilePhoto = async (req: Request, res: Response) => {
  try {
     console.log(req.file, req.body)
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default uploadProfilePhoto;