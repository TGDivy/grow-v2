import { Express } from "express";
import { projectRouter } from "./routes/project.router";
import { requireUser } from "./middleware/require_user";

const routes = (app: Express) => {
    app.get("/healthcheck", (req, res) => {
        res.status(200).send("Server is running");
    });

    app.use("/project", requireUser, projectRouter);
};

export default routes;
