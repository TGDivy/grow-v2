import admin from "firebase-admin";
import { FIREBASE_CONFIG } from "../constants";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
import cron from "node-cron";

export const initializeFirebase = () =>
    admin.initializeApp({
        credential: admin.credential.cert(FIREBASE_CONFIG),
    });

export const initializeCronJobForTestNotification = () => {
    cron.schedule("*/10 * * * * *", async () => {
        const message: Message = {
            notification: {
                title: "Test Notification",
                body: "Well Done!",
            },
            data: {
                url: "/focus",
            },
            webpush: {
                headers: {
                    Urgency: "high",
                },
                notification: {
                    click_action: "https://odyssey.divyb.xyz/focus",
                    fcmOptions: {
                        link: "https://odyssey.divyb.xyz/focus",
                    },
                },
            },
            token: "fkxBUeQFaY5DHKeCD60ST3:APA91bEBfUteEGPgkH2K0YKYddRzponoZsy9Gp1lbvd_qLiI9auOEMXryevupnwQOYM2iytgh8LTUJ5f8YIDl0f3gFghUmpoj_vfuGYhs0S2lkxG6ah2bDU_cgew-WC6O-Il4JPdLueW",
        };

        try {
            await admin.messaging().send(message);
            console.log("Successfully sent message");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    });
};
