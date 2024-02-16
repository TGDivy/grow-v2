import admin from "firebase-admin";

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

if (!process.env.DB_CONN_STRING) {
    console.error("DB_CONN_STRING is not set");
    process.exit(1);
}

export const FIREBASE_CONFIG: admin.ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    // the private key is a single string with newlines escaped, however, the newlines escaped might be escaped again
    // so replace all \\n with \n
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

console.log(FIREBASE_CONFIG);

export const PORT = Number(process.env.PORT) || 8080;
export const DB_CONN_STRING = process.env.DB_CONN_STRING;
