import { Queue } from "bullmq"
import { redisConnection } from "./redis"

export const productImportQueue = new Queue("product-import", {
  connection: redisConnection,
})
