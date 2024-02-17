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
        let tasks: mongoose.Schema.Types.ObjectId[] = [];
        let projects: mongoose.Schema.Types.ObjectId[] = [];

        if (body.linkedEntities) {
            tasks = body.linkedEntities.tasks.map((id: string) => new mongoose.Schema.Types.ObjectId(id));
            projects = body.linkedEntities.projects.map((id: string) => new mongoose.Schema.Types.ObjectId(id));
        }

        const focusSession = await createFocusSession({ ...body, userId, linkedEntities: { tasks, projects } });

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

    const focusSession = await getFocusSession(userId);

    return res.send(focusSession);
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
        let tasks: mongoose.Schema.Types.ObjectId[] = [];
        let projects: mongoose.Schema.Types.ObjectId[] = [];

        if (body.linkedEntities) {
            tasks = body.linkedEntities.tasks.map((id: string) => new mongoose.Schema.Types.ObjectId(id));
            projects = body.linkedEntities.projects.map((id: string) => new mongoose.Schema.Types.ObjectId(id));
        }

        const focusSession = await updateFocusSession(userId, { ...body, userId, linkedEntities: { tasks, projects } });

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
        if (!focusSession.duration) {
            return res.status(400).send("Cannot stop a session that has not started");
        }
        if (!focusSession.startTime) {
            return res.status(400).send("Session has no start time");
        }

        await createPastFocusSession({
            ...focusSession,
            startTime: focusSession.startTime,
        });

        return res.send(focusSession);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).send;
        }
        if (error instanceof Error) {
            return res.status(500).send(error.message);
        }
        return res.status(500).send("Something went wrong");
    }
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