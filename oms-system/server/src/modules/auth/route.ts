import { Router } from "express";
import register from "./register";
import login from "./login";
import logout from "./logout";
import me from "./me";
import authenticate from "../../middleware/authenticate";
import { authLimiter } from "../../middleware/rateLimiter";

const router = Router();

// Rate limiter only on login and register — not on /me or /logout
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.get("/me", authenticate, me);

export default router;