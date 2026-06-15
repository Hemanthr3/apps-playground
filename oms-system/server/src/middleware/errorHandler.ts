import type { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/errors";
import logger from "../../logger";

const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {

    logger.error({ err, method: req.method, URL: req.url }, "request error")

    if (err instanceof AppError) {
        // Known operational error — safe to expose message to client 
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
    }

    // Unknown error — never expose internal details to the client 
    return res.status(500).json({
        success: false,
        message: "Internal server error",
    })
}

export default errorHandler                                                                                                                                                                   
