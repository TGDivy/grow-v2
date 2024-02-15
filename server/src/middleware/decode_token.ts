// middle ware for authorization from client and firebase auth
import { NextFunction, Request, Response } from "express";
import admin from "firebase-admin";

export const decodeToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodeValue = await admin.auth().verifyIdToken(token);

    if (!token || !decodeValue) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  return next();
};
