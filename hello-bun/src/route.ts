import { Router } from "express";
import orderRouter from "./modules/order/route";
import customerRouter from "./modules/customer/route";
import productRouter from "./modules/product/route";

const router = Router();

router.use("/order", orderRouter);
router.use("/customer", customerRouter);
router.use("/product", productRouter);

export default router;