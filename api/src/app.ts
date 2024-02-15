import express from "express";
import db from "mongoose";
import todoRoutes from "./routes/todos";
import { json, urlencoded } from "body-parser";
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json";

const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

app.post("/signup", async (req, res) => {
  console.log("Request", req.body);
  try {
    const { email, password } = req.body;
    const user = await admin.auth().createUser({
      email,
      password,
      emailVerified: false,
      disabled: false,
    });
    res.status(200).json(user);
  } catch (error) {
    if (!(error instanceof Error)) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
    res.status(500).json({ message: error.message });
  }
});

app.use(json());

app.use(urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// app.use("/todos", todoRoutes);

// app.use(
//   (
//     err: Error,
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
//   ) => {
//     res.status(500).json({ message: err.message });
//   }
// );

// db.connect("mongodb://localhost:27017/todos", {});
// db.connection.once("open", () => {
//   console.log("Connected to database");
// });
// db.connection.on("error", (err) => {
//   console.log("Error", err);
// });

// app.listen(3000);
