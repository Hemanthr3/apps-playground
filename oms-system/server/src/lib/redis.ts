if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
  throw new Error("Please provide REDIS_HOST and REDIS_PORT in the environment variables")
}

export const redisConnection = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!),
}
