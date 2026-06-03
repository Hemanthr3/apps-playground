import { Router } from "express";
import multer from "multer";
import getProducts from "./controller";
import importProducts from "./importProducts";
import importProductsXlsx from "./importProductsXlsx";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/", getProducts);

router.post("/import", upload.single("file"), importProducts);

router.post("/import-xlsx", upload.single("file"), importProductsXlsx);

export default router;
