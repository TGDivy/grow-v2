// middle ware for authorization from client and firebase auth
import { NextFunction, Request, Response } from "express";
import admin from "firebase-admin";
import { logger } from "../utils/logger";

export const requireUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    if (!user) {
        return res.status(403).send("Unauthorized");
    }
    logger.info(`User: ${user.uid} is authorized ${req.method} ${req.originalUrl}`);
    return next();
};
