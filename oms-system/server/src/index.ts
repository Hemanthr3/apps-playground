import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import pinoHttp from "pino-http"
import logger from "../logger";
import router from "./route";
import errorHandler from "./middleware/errorHandler";
import helmet from "helmet"

const PORT = process.env.PORT || 3000;

const app = express()

app.use(pinoHttp({
  logger,
  // Use warn level for 4xx, error for 5xx, info for everything else
  customLogLevel: (_req, res) => {
    if (res.statusCode >= 500) return "error"
    if (res.statusCode >= 400) return "warn"
    return "info"
  },
  // Only log what matters — method, url, status, response time
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode}`
  },
  customErrorMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode}`
  },
  // Only log method + url on req, statusCode on res — nothing else
  serializers: {
    req: (req) => `${req.method} ${req.url}`,
    res: (res) => `${res.statusCode}`,
  },
}))
app.use(helmet())
// credentials: true allows cookies to be sent cross-origin (frontend on 5173, backend on 8000)
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true }))
app.use(express.json())
// cookieParser reads req.cookies from incoming requests
app.use(cookieParser())

app.use('/api', router)

app.get('/health', (req, res) => {
  return res.json({ message: "server is healthy!" })
})

app.use(errorHandler)

app.listen(PORT, () => {
  logger.info(`server is up ${PORT}`)
})
