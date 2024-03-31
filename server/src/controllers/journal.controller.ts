import { Request, Response } from "express";
import mongoose from "mongoose";
import OpenAI from "openai";
import {
    ChatCompletionCreateParams,
    ChatCompletionCreateParamsNonStreaming,
    ChatCompletionCreateParamsStreaming,
} from "openai/resources/chat/completions";
import showdown from "showdown";
import { openai } from "../constants";
import {
    createJournalSessionInput,
    deleteJournalSessionInput,
    finishJournalSessionInput,
    getJournalSessionInput,
    updateJournalSessionInput,
} from "../schema/journal.schema";
import {
    createJournalSession,
    deleteJournalSession,
    getJournalSession,
    getJournalSessionBetweenDates,
    getJournalSessions,
    updateJournalSession,
} from "../services/journal.service";
import { logger } from "../utils/logger";
import { getDelphiJournalSM, getDelphiJournalSummarySM } from "./helper/delphi";

export const createJournalSessionHandler = async (
    req: Request<{}, {}, createJournalSessionInput["body"]>,
    res: Response,
) => {
    logger.info(`Start`);

    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    try {
        const body = req.body;

        const userCurrentDate = new Date(body.userCurrentDate);

        userCurrentDate.setHours(0, 0, 0, 0);

        // Get the end of the user's current day
        const endOfUserCurrentDate = new Date(userCurrentDate);
        endOfUserCurrentDate.setHours(23, 59, 59, 999);

        logger.info(`Getting journal sessions`);

        // Check if a journal session already exists for the current user and the current date
        const existingJournalSessions = await getJournalSessionBetweenDates(
            userId,
            userCurrentDate,
            endOfUserCurrentDate,
        );

        if (existingJournalSessions && existingJournalSessions.length > 0) {
            if (body.forceRecreate === true) {
                logger.info(`Recreating journal session for user ${userId} on ${userCurrentDate}`);

                await deleteJournalSession(existingJournalSessions[0]._id);
            } else {
                logger.info(`Journal session already exists for user ${userId} on ${userCurrentDate}`);
                return res.send(existingJournalSessions[0]);
            }
        }

        logger.error(`Creating journal session for user ${userId} on ${userCurrentDate}`);

        // const prompt = await getDelphiPrompt(userId);

        // console.log(prompt.choices);

        // const message = prompt.choices[0].message.content ?? DEFAULT_JOURNALLING_PROMPT;
        // const converter = new showdown.Converter();
        // const htmlMessage = converter.makeHtml(message);

        const journalSession = await createJournalSession({
            ...body,
            userId,
            exchanges: [],
            // exchanges: [{ speaker: "assistant", rawText: message, timestamp: new Date(), htmlString: htmlMessage }],
        });

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

export const getDelphiMessageHandler = async (req: Request<{}, {}, {}>, res: Response) => {
    console.log("Delphi message handler");

    res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8",
    });

    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    const config: ChatCompletionCreateParamsStreaming = {
        stream: true, // This is the key to request stream from openai api
        messages: [
            {
                role: "system",
                content: await getDelphiJournalSM(userId),
            },
            { role: "user", content: "" },
        ],
        // model: "gpt-4-turbo-preview",
        model: "3.5-turbo",
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    };

    const completion = await openai.chat.completions.create(config);

    // read chunk by chunk from api and send it to the client chunck by chunk
    for await (const chunk of completion) {
        const [choice] = chunk.choices;
        const { content } = choice.delta;
        const finalContent = content ? content : "";
        res.write(finalContent);
    }
    res.write("\n");
    res.end();
};

export const finishJournalSessionHandler = async (
    req: Request<finishJournalSessionInput["params"], {}, {}>,
    res: Response,
) => {
    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    const journalSessionId = req.params.id;

    // Create a summary of the journal session
    // Generate an image of the journal session
    // Generate tags for the journal session

    try {
        let journalSession = await getJournalSession(journalSessionId);

        if (!journalSession) {
            return res.sendStatus(404);
        }

        if (journalSession.userId !== userId) {
            return res.status(403).send("Unauthorized");
        }

        console.log("Getting journal summary");

        const systemMessage = await getDelphiJournalSummarySM(journalSession._id.toString());
        console.log(systemMessage);
        const config: ChatCompletionCreateParams = {
            messages: [
                {
                    role: "system",
                    content: systemMessage,
                },
                { role: "user", content: "" },
            ],
            model: "gpt-3.5-turbo",
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        };

        const completion = await openai.chat.completions.create(config);

        console.log("Got journal summary", completion);
        const [choice] = completion.choices;
        console.log(choice);
        const { content } = choice.message;
        const summary = content ? content : "";

        journalSession = await updateJournalSession(journalSessionId, { summary });

        return res.send(journalSession);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).send("Invalid id");
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

        for (const exchange of body?.exchanges || []) {
            exchange.timestamp = new Date(exchange.timestamp);
        }

        journalSession = await updateJournalSession(journalSessionId, { ...body });

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
