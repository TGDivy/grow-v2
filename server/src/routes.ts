import { Express } from "express";
import { createGoalHandler, deleteGoalHandler, getGoalHandler, updateGoalHandler } from "./controllers/goal.controller";
import { requireUser } from "./middleware/require_user";
import { validateResource } from "./middleware/validate_resource";
import { projectRouter } from "./routes/project.router";
import { createGoalSchema, deleteGoalSchema, getGoalSchema, updateGoalSchema } from "./schema/goal.schema";

const routes = (app: Express) => {
    app.get("/healthcheck", (req, res) => {
        res.status(200).send("Server is running");
    });

    app.use("/project", requireUser, projectRouter);

    app.post("/goals", [requireUser, validateResource(createGoalSchema)], createGoalHandler);
    app.get("/goals/:id", [requireUser, validateResource(getGoalSchema)], getGoalHandler);
    app.put("/goals/:id", requireUser, validateResource(updateGoalSchema), updateGoalHandler);
    app.delete("/goals/:id", [requireUser, validateResource(deleteGoalSchema)], deleteGoalHandler);
};

export default routes;
