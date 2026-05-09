import express from "express"
import dotenv from "dotenv"
import cancelRouter from "./modules/cancel/route.js"
import orderRouter from "./modules/order/route.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.get('/health',(req, res)=>{
    return res.json({
        message: "health-api!"
    })
})

app.use('/cancel',cancelRouter)
app.use('/order',orderRouter)

app.listen(PORT,()=>{
    console.log(`serve is up and running on ${PORT}`)
})
