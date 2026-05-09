import { Router } from "express";
import getProducts from "./controller";

const router = Router();

router.get("/", getProducts);

export default router;