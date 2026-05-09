import { Router } from "express";
import createOrder from "./controller";

const router = Router();

router.post("/", createOrder);

export default router;