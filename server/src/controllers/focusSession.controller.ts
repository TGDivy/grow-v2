import { Request, Response } from "express";
import mongoose from "mongoose";
import { createActiveSessionInput } from "../schema/focusSession.schema";
import {
    createFocusSession,
    createPastFocusSession,
    getAllPastFocusSessions,
    getFocusSession,
    updateFocusSession,
} from "../services/focusSession.service";
import { logger } from "../utils/logger";
import { getTodo } from "../services/todo.service";
import e from "cors";

export const createFocusSessionHandler = async (
    req: Request<{}, {}, createActiveSessionInput["body"]>,
    res: Response,
) => {
    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    try {
        const body = req.body;
        let tasks: mongoose.Types.ObjectId[] = [];
        let projects: mongoose.Types.ObjectId[] = [];
        let startTime: Date | undefined;

        if (body.linkedEntities) {
            tasks = body.linkedEntities.tasks.map((id: string) => new mongoose.Types.ObjectId(id));
            projects = body.linkedEntities.projects.map((id: string) => new mongoose.Types.ObjectId(id));
        }

        if (body.startTime) startTime = new Date(body.startTime);

        const focusSession = await createFocusSession({
            ...body,
            userId,
            linkedEntities: { tasks, projects },
            startTime,
        });

        return res.send(focusSession);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(error);
        }
        if (error instanceof Error) {
            return res.status(500).send(error.message);
        }
        return res.status(500).send("Something went wrong");
    }
};

export const getActiveSessionHandler = async (req: Request<{}, {}, {}>, res: Response) => {
    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    try {
        const focusSession = await getFocusSession(userId);
        if (!focusSession) {
            return res.status(404).send("No active session found");
        }
        return res.send(focusSession);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(error);
        }
        if (error instanceof Error) {
            return res.status(500).send(error.message);
        }
        return res.status(500).send("Something went wrong");
    }
};

export const updateFocusSessionHandler = async (
    req: Request<{}, {}, createActiveSessionInput["body"]>,
    res: Response,
) => {
    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    try {
        const body = req.body;
        let tasks: mongoose.Types.ObjectId[] = [];
        let projects: mongoose.Types.ObjectId[] = [];
        let startTime: Date | undefined;

        if (body.linkedEntities) {
            tasks = body.linkedEntities.tasks.map((id: string) => new mongoose.Types.ObjectId(id));
            projects = body.linkedEntities.projects.map((id: string) => new mongoose.Types.ObjectId(id));
        }

        if (body.startTime) startTime = new Date(body.startTime);

        const focusSession = await updateFocusSession(userId, {
            ...body,
            userId,
            linkedEntities: { tasks, projects },
            startTime,
        });

        return res.send(focusSession);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(error);
        }
        if (error instanceof Error) {
            return res.status(500).send(error.message);
        }
        return res.status(500).send("Something went wrong");
    }
};

export const stopFocusSessionHandler = async (req: Request<{}, {}, {}>, res: Response) => {
    // we also need to create a copy of this to save it in the past sessions
    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    try {
        const focusSession = await updateFocusSession(userId, { active: false });

        if (!focusSession) {
            return res.status(404).send("No active session found");
        }
        // if focusSession mode was not Focus, we don't need to create a past session
        if (focusSession.mode !== "focus") {
            return res.send(focusSession);
        }
        if (!focusSession.duration) {
            return res.status(400).send("Cannot stop a session that has not started");
        }
        if (!focusSession.startTime) {
            return res.status(400).send("Session has no start time");
        }

        const pastFocusSession = await createPastFocusSession({
            ...focusSession,
            startTime: focusSession.startTime,
            duration: focusSession.duration,
            userId: focusSession.userId,
        });

        // add the time spent to each of user's tasks in the linkedEntities
        // we can do this in the background
        for (const todoId of focusSession?.linkedEntities?.tasks || []) {
            // get the task, then save it
            const todo = await getTodo(todoId.toString());
            if (todo) {
                todo.timeSpent = (todo.timeSpent || 0) + focusSession.duration;
                await todo.save();
            } else {
                logger.error("Todo not found", todoId);
            }
        }

        return res.send(focusSession);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(error);
        }
        if (error instanceof Error) {
            return res.status(500).send(error.message);
        }
        return res.status(500).send("Something went wrong");
    }
    logger.info("End of Code...", userId);
};

export const getAllPastFocusSessionsHandler = async (req: Request<{}, {}, {}>, res: Response) => {
    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    try {
        const pastSessions = await getAllPastFocusSessions(userId);

        return res.send(pastSessions);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).send(error.message);
        }
        return res.status(500).send("Something went wrong");
    }
};
