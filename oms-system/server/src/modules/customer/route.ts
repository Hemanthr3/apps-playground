import { Router } from "express";
import multer from "multer";
import getCustomers from "./controller";
import uploadProfilePhoto from "./uploadProfilePhoto";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/", getCustomers);

router.post(
  "/profile-upload/:id",
  upload.single("uploaded_file"),
  uploadProfilePhoto
);

export default router;
