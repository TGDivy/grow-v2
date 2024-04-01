import { Express } from "express";
import { createGoalHandler, deleteGoalHandler, getGoalHandler, updateGoalHandler } from "./controllers/goal.controller";
import {
    createProjectHandler,
    deleteProjectHandler,
    getAllProjectsHandler,
    getProjectFull,
    getProjectHandler,
    updateProjectHandler,
} from "./controllers/project.controller";
import {
    createTodoHandler,
    deleteTodoHandler,
    getAllTodosHandler,
    getTodoHandler,
    toggleTodoHandler,
    updateTodoHandler,
} from "./controllers/todo.controller";

import {
    createFocusSessionHandler,
    updateFocusSessionHandler,
    stopFocusSessionHandler,
    getActiveSessionHandler,
    getAllPastFocusSessionsHandler,
} from "./controllers/focusSession.controller";

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
import {
    createTodoSchema,
    deleteTodoSchema,
    getAllTodosSchema,
    getTodoSchema,
    updateTodoSchema,
} from "./schema/todo.schema";
import { createUserHandler, deleteUserHandler, getUserHandler, updateUserHandler } from "./controllers/user.controller";
import { createUserSchema, deleteUserSchema, getUserSchema, updateUserSchema } from "./schema/user.schema";
import { createActiveSessionSchema } from "./schema/focusSession.schema";
import {
    createJournalSessionHandler,
    postDelphiMessageHandler,
    getJournalSessionHandler,
    getAllJournalSessionsHandler,
    updateJournalSessionHandler,
    deleteJournalSessionHandler,
    finishJournalSessionHandler,
} from "./controllers/journal.controller";
import {
    createJournalSessionSchema,
    getDelphiMessageSchema,
    getJournalSessionSchema,
    updateJournalSessionSchema,
    deleteJournalSessionSchema,
    getAllJournalSessionsSchema,
    finishJournalSessionSchema,
} from "./schema/journal.schema";
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
    app.get("/project/:id/details", [requireUser, validateResource(getProjectSchema)], getProjectFull);

    app.put("/project/:id", requireUser, validateResource(updateProjectSchema), updateProjectHandler);
    app.delete("/project/:id", [requireUser, validateResource(deleteProjectSchema)], deleteProjectHandler);

    app.post("/todo", [requireUser, validateResource(createTodoSchema)], createTodoHandler);
    app.get("/todo", [requireUser, validateResource(getAllTodosSchema)], getAllTodosHandler);
    app.get("/todo/:id", [requireUser, validateResource(getTodoSchema)], getTodoHandler);
    app.put("/todo/:id", requireUser, validateResource(updateTodoSchema), updateTodoHandler);
    app.put("/todo/:id/toggle", requireUser, validateResource(getTodoSchema), toggleTodoHandler);
    app.delete("/todo/:id", [requireUser, validateResource(deleteTodoSchema)], deleteTodoHandler);

    // Journal routes
    app.post("/journal", [requireUser, validateResource(createJournalSessionSchema)], createJournalSessionHandler);
    app.get("/journal", [requireUser, validateResource(getAllJournalSessionsSchema)], getAllJournalSessionsHandler);
    app.get("/journal/:id", [requireUser, validateResource(getJournalSessionSchema)], getJournalSessionHandler);
    app.put(
        "/journal/:id/finish",
        [requireUser, validateResource(finishJournalSessionSchema)],
        finishJournalSessionHandler,
    );

    app.post("/journal/delphi/1", [requireUser, validateResource(getDelphiMessageSchema)], postDelphiMessageHandler);

    app.put("/journal/:id", requireUser, validateResource(updateJournalSessionSchema), updateJournalSessionHandler);
    app.delete(
        "/journal/:id",
        [requireUser, validateResource(deleteJournalSessionSchema)],
        deleteJournalSessionHandler,
    );

    // User routes
    app.post("/user", validateResource(createUserSchema), createUserHandler);
    app.get("/user/:uid", validateResource(getUserSchema), getUserHandler);
    app.put("/user/:uid", validateResource(updateUserSchema), updateUserHandler);
    app.delete("/user/:uid", validateResource(deleteUserSchema), deleteUserHandler);

    app.post(
        "/focus-sessions/active",
        [requireUser, validateResource(createActiveSessionSchema)],
        createFocusSessionHandler,
    );
    app.get("/focus-sessions/active", requireUser, getActiveSessionHandler);
    app.put(
        "/focus-sessions/active",
        [requireUser, validateResource(createActiveSessionSchema)],
        updateFocusSessionHandler,
    );
    app.put("/focus-sessions/active/stop", requireUser, stopFocusSessionHandler);
    app.get("/focus-sessions/past", requireUser, getAllPastFocusSessionsHandler);
};

export default routes;
