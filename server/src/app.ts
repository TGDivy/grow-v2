import { json, urlencoded } from "body-parser";
import cors from "cors";
import express from "express";
import { PORT } from "./constants";
import { deserializeUser } from "./middleware/deserialize_user";
import routes from "./routes";
import connect from "./utils/connect";
import { initializeFirebase } from "./utils/firebase";
import { logger } from "./utils/logger";
import { UserRecord } from "firebase-admin/lib/auth/user-record";

initializeFirebase();

const app = express();
app.use(json());
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(deserializeUser);

app.listen(PORT, async () => {
    logger.info(`Server started at http://localhost:${PORT}`);

    await connect();

    routes(app);
});

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// connectToDatabase()
//     .then(() => {
//         app.use("/project", projectRouter);

//         app.listen(PORT, () => {
//             console.log(`Server started at http://localhost:${PORT}`);
//         });
//     })
//     .catch((error: Error) => {
//         console.error("Database connection failed", error);
//         process.exit();
//     });
