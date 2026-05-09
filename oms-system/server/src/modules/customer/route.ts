import { Router } from "express";
import getCustomers from "./controller";

const router = Router();

router.get("/", getCustomers);

export default router;