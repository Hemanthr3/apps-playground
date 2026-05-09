import express from "express"
import { createCancel } from "./controller.js"

 const router = express.Router()

router.get('/create',createCancel)

export default router;