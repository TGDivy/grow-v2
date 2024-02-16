import { json, urlencoded } from "body-parser";
import cors from "cors";
import express from "express";
import { PORT } from "./constants";
import { deserializeUser } from "./middleware/deserialize_user";
import routes from "./routes";
import { connectToDatabase } from "./services/database.service";
import { initializeFirebase } from "./utils/firebase";
import { logger } from "./utils/logger";
import { swaggerDocs } from "./utils/swagger";
import { connectDB } from "./utils/connect";

initializeFirebase();

const app = express();
app.use(json());
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(deserializeUser);

app.listen(PORT, async () => {
    logger.info(`Server started at http://localhost:${PORT}`);

    await connectDB();

    routes(app);

    swaggerDocs(app, PORT);
});
