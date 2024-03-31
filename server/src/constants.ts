import admin from "firebase-admin";
import OpenAI from "openai";

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

if (!process.env.DB_CONN_STRING) {
    console.error("DB_CONN_STRING is not set");
    process.exit(1);
}

export const FIREBASE_CONFIG: admin.ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

export const PORT = Number(process.env.PORT) || 8080;
export const DB_CONN_STRING = process.env.DB_CONN_STRING;
export const openai = new OpenAI();
export const firebaseBucket = process.env.FIREBASE_BUCKET;
