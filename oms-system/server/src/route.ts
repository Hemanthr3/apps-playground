import { Router } from "express";
import orderRouter from "./modules/order/route";
import customerRouter from "./modules/customer/route";
import productRouter from "./modules/product/route";
import authRouter from "./modules/auth/route";
import authenticate from "./middleware/authenticate";
import { authLimiter } from "./middleware/rateLimiter";

const router = Router();

// Public routes — rate limiter applied per-route inside authRouter
router.use("/auth", authRouter);

// Protected routes — authenticate middleware runs before every handler in these routers
router.use("/order", authenticate, orderRouter);
router.use("/customer", authenticate, customerRouter);
router.use("/product", authenticate, productRouter);

export default router;