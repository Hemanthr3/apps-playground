import { Router } from "express";
import register from "./register";
import login from "./login";
import logout from "./logout";
import me from "./me";
import authenticate from "../../middleware/authenticate";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, me);

export default router;