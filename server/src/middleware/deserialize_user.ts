import { NextFunction, Request, Response } from "express";
import admin from "firebase-admin";
import { logger } from "../utils/logger";

export const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return next();
    }
    try {
        const decodeValue = await admin.auth().verifyIdToken(token);

        if (!token || !decodeValue) {
            return next();
        }

        const user = await admin.auth().getUser(decodeValue.uid);

        res.locals.user = user;
    } catch (e) {
        logger.error(e);
    }
    next();
};
