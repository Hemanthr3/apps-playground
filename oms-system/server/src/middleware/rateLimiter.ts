import rateLimit from "express-rate-limit"

// Applied to auth routes only — prevents brute force attacks on login/register
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,                 // max 10 requests per IP per window
  standardHeaders: true,     // sends RateLimit-* headers so clients know their limit
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again after 15 minutes",
  },
})
