import admin from "firebase-admin";
import serviceAccount from "./../serviceAccountKey.json";

export const initializeFirebase = () =>
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
