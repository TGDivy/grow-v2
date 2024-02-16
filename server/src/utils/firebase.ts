import admin from "firebase-admin";
import { FIREBASE_CONFIG } from "../constants";

export const initializeFirebase = () =>
    admin.initializeApp({
        credential: admin.credential.cert(FIREBASE_CONFIG),
    });
