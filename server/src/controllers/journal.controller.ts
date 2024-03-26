import { Request, Response } from "express";
import mongoose from "mongoose";
import {
    createJournalSessionInput,
    updateJournalSessionInput,
    getJournalSessionInput,
    deleteJournalSessionInput,
} from "../schema/journal.schema";
import {
    createJournalSession,
    deleteJournalSession,
    getJournalSession,
    getJournalSessions,
    updateJournalSession,
} from "../services/journal.service";

export const createJournalSessionHandler = async (
    req: Request<{}, {}, createJournalSessionInput["body"]>,
    res: Response,
) => {
    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    try {
        const body = req.body;

        const startTime = new Date(body.startTime);
        const endTime = new Date();

        const journalSession = await createJournalSession({ ...body, userId, startTime, endTime });

        return res.send(journalSession);
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

export const getJournalSessionHandler = async (
    req: Request<getJournalSessionInput["params"], {}, {}>,
    res: Response,
) => {
    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    const journalSessionId = req.params.id;

    try {
        const journalSession = await getJournalSession(journalSessionId);

        if (!journalSession) {
            return res.sendStatus(404);
        }

        if (journalSession.userId !== userId) {
            return res.status(403).send("Unauthorized");
        }

        return res.send(journalSession);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).send("Invalid id");
        }
        return res.status(500).send("Something went wrong");
    }
};

export const getAllJournalSessionsHandler = async (req: Request<{}, {}, {}>, res: Response) => {
    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    try {
        const journalSessions = await getJournalSessions(userId);
        return res.send(journalSessions);
    } catch (error) {
        return res.status(500).send("Something went wrong");
    }
};

export const updateJournalSessionHandler = async (
    req: Request<updateJournalSessionInput["params"], {}, updateJournalSessionInput["body"]>,
    res: Response,
) => {
    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    const journalSessionId = req.params.id;

    try {
        const body = req.body;
        let journalSession = await getJournalSession(journalSessionId);

        if (!journalSession) {
            return res.sendStatus(404);
        }

        if (journalSession.userId !== userId) {
            return res.status(403).send("Unauthorized");
        }

        const startTime = body.startTime ? new Date(body.startTime) : journalSession.startTime;
        const endTime = body.endTime ? new Date(body.endTime) : journalSession.endTime;

        journalSession = await updateJournalSession(journalSessionId, { ...body, startTime, endTime });

        if (!journalSession) {
            return res.sendStatus(404);
        }

        return res.send(journalSession);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(error);
        }
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).send("Invalid id");
        }
        return res.status(500).send("Something went wrong");
    }
};

export const deleteJournalSessionHandler = async (req: Request<deleteJournalSessionInput["params"]>, res: Response) => {
    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    const journalSessionId = req.params.id;

    try {
        const journalSession = await getJournalSession(journalSessionId);

        if (!journalSession) {
            return res.sendStatus(404);
        }

        if (journalSession.userId !== userId) {
            return res.status(403).send("Unauthorized");
        }

        await deleteJournalSession(journalSessionId);

        return res.sendStatus(204);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).send("Invalid id");
        }
        return res.status(500).send("Something went wrong");
    }
};
