import { Express } from "express";
import { createGoalHandler, deleteGoalHandler, getGoalHandler, updateGoalHandler } from "./controllers/goal.controller";
import {
    createProjectHandler,
    deleteProjectHandler,
    getAllProjectsHandler,
    getProjectHandler,
    updateProjectHandler,
} from "./controllers/project.controller";
import { requireUser } from "./middleware/require_user";
import { validateResource } from "./middleware/validate_resource";
import { createGoalSchema, deleteGoalSchema, getGoalSchema, updateGoalSchema } from "./schema/goal.schema";
import {
    createProjectSchema,
    deleteProjectSchema,
    getAllProjectsSchema,
    getProjectSchema,
    updateProjectSchema,
} from "./schema/project.schema";

const routes = (app: Express) => {
    /**
     * @swagger
     * /healthcheck:
     *  get:
     *    tag:
     *      - Healthcheck
     *    description: Check if server is running
     *    responses:
     *      200:
     *         description: Server is running!
     */
    app.get("/healthcheck", (req, res) => {
        res.status(200).send("Server is running!");
    });

    app.post("/goals", [requireUser, validateResource(createGoalSchema)], createGoalHandler);
    app.get("/goals/:id", [requireUser, validateResource(getGoalSchema)], getGoalHandler);
    app.put("/goals/:id", requireUser, validateResource(updateGoalSchema), updateGoalHandler);
    app.delete("/goals/:id", [requireUser, validateResource(deleteGoalSchema)], deleteGoalHandler);

    app.post("/project", [requireUser, validateResource(createProjectSchema)], createProjectHandler);
    app.get("/project", [requireUser, validateResource(getAllProjectsSchema)], getAllProjectsHandler);
    app.get("/project/:id", [requireUser, validateResource(getProjectSchema)], getProjectHandler);
    app.put("/project/:id", requireUser, validateResource(updateProjectSchema), updateProjectHandler);
    app.delete("/project/:id", [requireUser, validateResource(deleteProjectSchema)], deleteProjectHandler);
};

export default routes;
