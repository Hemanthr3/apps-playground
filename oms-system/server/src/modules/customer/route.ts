import { Router } from "express";
import getCustomers from "./controller";
import uploadProfilePhoto from "./uploadProfilePhoto";

import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = Router();

router.get("/", getCustomers);

router.post(
    "/profile-upload",
    upload.single("uploaded_file"),
    uploadProfilePhoto
);

export default router;