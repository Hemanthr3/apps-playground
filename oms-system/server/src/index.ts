import express from "express"
import {drizzle} from "drizzle-orm/bun-sqlite"

import logger from "../logger";
import router from "./route";


const db = drizzle(process.env.DB_FILE_NAME!)
const PORT = process.env.PORT || 3000;

const app = express()

app.use(express.json())

app.use('/api',router)

app.get('/health',(req,res)=>{
    return res.json({
        message:"server is healthy!"
    })
})

app.listen(PORT,()=>{
    logger.info(`server is up ${PORT}`)
})