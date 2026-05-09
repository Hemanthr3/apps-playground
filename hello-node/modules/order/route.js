import express from "express"
import { confirmOrder, createOrder } from "./controller.js"

const orderRouter = express.Router()

orderRouter.post('/createOrder',createOrder)
orderRouter.post('/confirmOrder',confirmOrder)

export default orderRouter