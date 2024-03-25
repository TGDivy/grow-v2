import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCmXk3ZBMJ-or_IiTFCN4LOnvstpcfQwBI",
  authDomain: "grow-v2-d06b7.firebaseapp.com",
  projectId: "grow-v2-d06b7",
  storageBucket: "grow-v2-d06b7.appspot.com",
  messagingSenderId: "115811593555",
  appId: "1:115811593555:web:e0ec9c88c0ac6e6492c5a6",
  measurementId: "G-TYLV89XWQK",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);

getToken(messaging, {
  vapidKey:
    "BPaLNWmzkHnXhcrXjhWE2bFGW2MVnGRLywDoy1-EX4sciAbtJAlMl1IApY8qo4DrlcGt17ss57IdTYkJTJoxdPM",
})
  .then((currentToken) => {
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      console.log(currentToken);
    } else {
      // Show permission request UI
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }
  })
  .catch((err) => {
    console.log("An error occurred while retrieving token. ", err);
  });

auth.useDeviceLanguage();
