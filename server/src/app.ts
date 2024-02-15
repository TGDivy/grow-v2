import express from "express";
import projectRoutes from "./routes/project";
import { json, urlencoded } from "body-parser";
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json";
import { PORT } from "./constants";
import cors from "cors";
import { decodeToken } from "./middleware/decode_token";

const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(decodeToken);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// app.use("/todos", todoRoutes);
app.use("/project", projectRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}, http://localhost:${PORT}`);
});
