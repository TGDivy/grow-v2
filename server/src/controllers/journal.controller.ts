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
    getJournalSessionBetweenDates,
    getJournalSessions,
    updateJournalSession,
} from "../services/journal.service";
import admin from "firebase-admin";
import { getAllPastFocusSessionsBetweenDates } from "../services/focusSession.service";
import { getTodo } from "../services/todo.service";
import { getProjects } from "../services/project.service";
import OpenAI from "openai";
import { openai } from "../constants";
import { logger } from "../utils/logger";
import showdown from "showdown";

// helper function to get all user data
const getDelphiPrompt = async (userId: string) => {
    // User's Name from Firebase

    const userName = await admin
        .auth()
        .getUser(userId)
        .then((user) => {
            return user.displayName;
        });

    if (userName === undefined) {
        throw new Error("User not found");
    }

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // Active Projects
    const activeProjects = await getProjects(userId, { completed: false });

    // Today's Focus Sessions
    const focusSessions = await getAllPastFocusSessionsBetweenDates(userId, today, now);
    const timeWorkedToday = focusSessions.reduce((acc, session) => acc + session.duration, 0);

    const tasksWorkedToday: {
        [key: string]: {
            rawText: string;
            projectTitles: string[];
            timeWorked: number; // in seconds
            completed: boolean;
        };
    } = {};

    for (const session of focusSessions) {
        if (session.linkedEntities?.tasks !== undefined && session.linkedEntities.tasks.length > 0) {
            const taskId = session.linkedEntities.tasks[0].toString();
            const task = await getTodo(taskId);

            if (task !== null) {
                if (tasksWorkedToday[taskId] === undefined) {
                    tasksWorkedToday[taskId] = {
                        rawText: task.rawText,
                        projectTitles: task.projects.map((projectId) => {
                            const project = activeProjects.find(
                                (project) => project._id.toString() === projectId.toString(),
                            );
                            return project?.title ?? "Inactive Project";
                        }),
                        timeWorked: 0,
                        completed: task.completed ?? false,
                    };
                }
                tasksWorkedToday[taskId].timeWorked += session.duration;
            }
        }
    }

    // Past 3 days Journal Entries
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);
    const journalSessions = await getJournalSessionBetweenDates(userId, threeDaysAgo, today);

    const message: OpenAI.ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: `You are Delphi, a journaling companion within Odyssey, a life management app. Using user data on daily activities, goals, and reflections, you engage users in conversations for introspection and growth. You provide tailored prompts and insights, helping users navigate experiences, set intentions, and understand themselves better. Your interactions foster a supportive environment for self-expression and exploration. Your philosophy is influenced by books like “Atomic Habits”, “The 7 Habits of Highly Effective People”, “The Alchemist”, “Can't Hurt Me”, and “How to Win Friends and Influence People”.
    
        Below is the relevant user data for today:
        User's Name: ${userName}
        Today's Date: ${today.toLocaleDateString("en-US", { month: "long", day: "numeric", weekday: "long", year: "numeric" })}
        Time Worked Today: ${timeWorkedToday / 60} minutes
        Tasks Worked on Today: ${Object.values(tasksWorkedToday)
            .map((task) => {
                return `• ${task.rawText} for ${task.timeWorked / 60} minutes ${task.projectTitles.length > 0 ? `for project(s) ${task.projectTitles.join(", ")}` : ""} ${task.completed ? "✅" : "❌"}`;
            })
            .join("\n")}

        Active Projects: ${activeProjects
            .map((project) => {
                return `${project.title}: ${project.description ?? "NA"}`;
            })
            .join("\n")}

        User Goal Document Summary: NA
        User Plan for the Day: NA
        
        User Journaling Summaries:
        •	Yesterday's Summary: ${journalSessions.length > 0 ? journalSessions[0].summary : "NA"}
        •	Day Before Yesterday's Summary: ${journalSessions.length > 1 ? journalSessions[1].summary : "NA"}
        •	Two Days Ago Summary: ${journalSessions.length > 2 ? journalSessions[2].summary : "NA"}
        •	Last Week's Summary: NA
        •	Last Month's Summary: NA
        •	Last quarter's Summary: NA

        Note: NA means not available, and is when the user data for that field is missing. It is likely because the user is new to the app, and hasn't used that feature yet. The journaling summaries are the past interaction history with you, Delphi. Therefore, you can use them to guide the conversation and provide insights based on the user's past reflections, or start fresh if the user is new.

        Ensure that your messages are in markdown format.
    `,
        },
        { role: "user", content: "" },
    ];

    const completion = await openai.chat.completions.create({
        messages: message,
        model: "gpt-4-turbo-preview",
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    return completion;
};

const DEFAULT_JOURNALLING_PROMPT = "How are you feeling today?";

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

        const prompt = await getDelphiPrompt(userId);

        console.log(prompt.choices);

        const message = prompt.choices[0].message.content ?? DEFAULT_JOURNALLING_PROMPT;
        const converter = new showdown.Converter();
        const htmlMessage = converter.makeHtml(message);

        const journalSession = await createJournalSession({
            ...body,
            userId,
            exchanges: [{ speaker: "assistant", rawText: message, timestamp: new Date(), htmlString: htmlMessage }],
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
