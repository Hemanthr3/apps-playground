import { Router } from "express";
import orderRouter from "./modules/order/route";
import customerRouter from "./modules/customer/route";
import productRouter from "./modules/product/route";
import authRouter from "./modules/auth/route";
import authenticate from "./middleware/authenticate";
import { authLimiter } from "./middleware/rateLimiter";

const router = Router();

// Public routes — rate limited to prevent brute force
router.use("/auth", authLimiter, authRouter);

// Protected routes — authenticate middleware runs before every handler in these routers
router.use("/order", authenticate, orderRouter);
router.use("/customer", authenticate, customerRouter);
router.use("/product", authenticate, productRouter);

export default router;