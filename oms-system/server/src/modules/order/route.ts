import { Router } from "express";
import createOrder from "./controller";
import getOrders from "./getOrders";

const router = Router();

router.post("/", createOrder);
router.get("/", getOrders);

export default router;