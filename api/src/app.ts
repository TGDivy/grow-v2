import express from "express";
import db from "mongoose";
import todoRoutes from "./routes/todos";
import { json, urlencoded } from "body-parser";
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json";
import { PORT } from "./constants";

const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

app.use(json());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}, http://localhost:${PORT}`);
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
